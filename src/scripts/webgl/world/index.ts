import * as THREE from 'three';
import { InstanceBatch, createRandom, createSurfaceMaterial } from '../batch';
import { AREAS, PALETTE, TIMING } from '../constants';
import type { BuildContext, WorldState } from './types';
import { buildHoldings } from './holdings';
import { buildSellTarget, buildBuyTarget } from './targets';
import { buildAccumulate } from './accumulate';
import { Network } from './network';
import { createRadialTexture, createSpot } from './lines';

export type { WorldState } from './types';

export interface WorldOptions {
  /** Reserved for lighter builds on small devices. */
  mobile: boolean;
}

export interface World {
  group: THREE.Group;
  update(dt: number, state: WorldState): void;
  dispose(): void;
}

const SPOTS: Array<{ centre: THREE.Vector3; size: number }> = [
  { centre: AREAS.holdings, size: 100 },
  { centre: AREAS.sell, size: 140 },
  { centre: new THREE.Vector3(AREAS.buy.x + 10, 0, AREAS.buy.z - 10), size: 150 },
  { centre: new THREE.Vector3(AREAS.accumulate.x - 10, 0, AREAS.accumulate.z - 10), size: 140 },
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
  const ctx: BuildContext = { group, boxes, cylinders, random, surface };

  buildHoldings(ctx);
  const sell = buildSellTarget(ctx);
  const buy = buildBuyTarget(ctx);
  const { emblem } = buildAccumulate(ctx);
  group.add(boxes.build('boxes'), cylinders.build('cylinders'));

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(3000, 3000),
    new THREE.MeshStandardMaterial({ color: PALETTE.floor, roughness: 1, metalness: 0 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.name = 'floor';
  group.add(floor);

  const radial = createRadialTexture();

  const network = new Network(random);
  group.add(network.group);

  const highlights = SPOTS.map((spot) => createSpot(radial, spot.centre, spot.size));
  group.add(...highlights);

  let logoRatio = 0;

  return {
    group,
    update(dt, state) {
      sell.update(dt, state);
      buy.update(dt, state);
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
