import * as THREE from 'three';
import { InstanceBatch, createRandom, createSurfaceMaterial } from '../batch';
import { AREAS, PALETTE, TIMING } from '../constants';
import type { BuildContext } from './types';
import { buildDowntown } from './downtown';
import { buildPlant } from './plant';
import { buildWindFarm } from './windfarm';
import { buildCampus } from './campus';
import { People, type PersonSpot } from './people';
import { Smoke, createRadialTexture } from './smoke';
import { Network } from './network';
import { createSpot } from './lines';

export interface WorldOptions {
  mobile: boolean;
}

export interface WorldState {
  /** Smoothed camera progress. */
  progress: number;
  /** Raw scroll target (0 while the page rests on the hero). */
  targetProgress: number;
  /** Seconds since the scene started (pauses with the loop). */
  time: number;
  /** Active flow step 0..3. */
  section: number;
}

export interface World {
  group: THREE.Group;
  update(dt: number, state: WorldState): void;
  dispose(): void;
}

const SPOTS: Array<{ centre: THREE.Vector3; size: number }> = [
  { centre: AREAS.downtown, size: 100 },
  { centre: AREAS.plant, size: 140 },
  { centre: new THREE.Vector3(AREAS.windFarm.x + 10, 0, AREAS.windFarm.z - 10), size: 150 },
  { centre: new THREE.Vector3(AREAS.campus.x - 10, 0, AREAS.campus.z - 10), size: 140 },
];
const SPOT_OPACITY = 0.12;
const SEED = 20240907;

/** Builds the whole procedural world into one group and returns its per-frame updater. */
export function buildWorld(options: WorldOptions): World {
  const group = new THREE.Group();
  group.name = 'world';
  const random = createRandom(SEED);
  const surface = createSurfaceMaterial();
  const boxes = new InstanceBatch(new THREE.BoxGeometry(1, 1, 1), surface);
  const cylinders = new InstanceBatch(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), surface);
  const spots: PersonSpot[] = [];
  const ctx: BuildContext = { group, boxes, cylinders, people: spots, random, surface };

  buildDowntown(ctx);
  const { emitters } = buildPlant(ctx);
  const turbines = buildWindFarm(ctx);
  const { emblem } = buildCampus(ctx);
  group.add(boxes.build('boxes'), cylinders.build('cylinders'), turbines.group);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(3000, 3000),
    new THREE.MeshStandardMaterial({ color: PALETTE.floor, roughness: 1, metalness: 0 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.name = 'floor';
  group.add(floor);

  const peopleMaterial = new THREE.MeshStandardMaterial({ color: PALETTE.main, roughness: 0.8, metalness: 0 });
  const people = new People(spots, peopleMaterial, random);
  group.add(people.mesh);

  const radial = createRadialTexture();
  const smoke = new Smoke(radial, emitters, random, options.mobile ? 6 : 9);
  group.add(smoke.group);

  const network = new Network(random);
  group.add(network.group);

  const highlights = SPOTS.map((spot) => createSpot(radial, spot.centre, spot.size));
  group.add(...highlights);

  let logoRatio = 0;

  return {
    group,
    update(dt, state) {
      turbines.update(dt);
      people.update(state.time);
      smoke.update(dt);
      network.update(dt, state);

      logoRatio = THREE.MathUtils.clamp(logoRatio + 2 * dt * (state.progress >= TIMING.emblem ? 1 : -1), 0, 1);
      emblem.visible = logoRatio > 0;
      emblem.material.opacity = logoRatio;
      const pop = 0.85 + 0.15 * (1 - Math.pow(1 - logoRatio, 3));
      emblem.scale.set(pop, 1, pop);

      const k = 1 - Math.exp(-3 * dt);
      for (let i = 0; i < highlights.length; i++) {
        const material = highlights[i].material;
        const target = state.section === i ? SPOT_OPACITY : 0;
        material.opacity += (target - material.opacity) * k;
        highlights[i].visible = material.opacity > 0.002;
      }
    },
    dispose() {
      turbines.dispose();
      people.dispose();
      smoke.dispose();
      network.dispose();
      radial.dispose();
      const seen = new Set<THREE.BufferGeometry | THREE.Material>();
      group.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const geometry = object.geometry as THREE.BufferGeometry;
        if (!seen.has(geometry)) {
          seen.add(geometry);
          geometry.dispose();
        }
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          if (seen.has(material)) continue;
          seen.add(material);
          material.dispose();
        }
      });
    },
  };
}
