import * as THREE from 'three';
import { AREAS, PALETTE } from '../constants';
import type { BuildContext } from './types';

/** Section B — power plant: hyperboloid cooling towers, halls, stack, tanks, pipes, switchyard. */
const COOLING = { height: 44, base: 12.5, throat: 8.2, top: 8.8, throatAt: 0.72 };

function coolingTowerGeometry(): THREE.LatheGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    let r: number;
    if (f < COOLING.throatAt) {
      const k = (COOLING.throatAt - f) / COOLING.throatAt;
      r = COOLING.throat + (COOLING.base - COOLING.throat) * k * k;
    } else {
      const k = (f - COOLING.throatAt) / (1 - COOLING.throatAt);
      r = COOLING.throat + (COOLING.top - COOLING.throat) * k * k;
    }
    points.push(new THREE.Vector2(r, f * COOLING.height));
  }
  return new THREE.LatheGeometry(points, 28);
}

export function buildPlant(ctx: BuildContext): { emitters: THREE.Vector3[] } {
  const { boxes, cylinders, group, people } = ctx;
  const c = AREAS.plant;
  const at = (dx: number, dz: number) => ({ x: c.x + dx, z: c.z + dz });

  boxes.add({ ...at(0, 0), w: 130, h: 0.2, d: 100, color: PALETTE.pad });

  const towerGeometry = coolingTowerGeometry();
  const towerMaterial = new THREE.MeshStandardMaterial({ color: PALETTE.building, roughness: 0.9, side: THREE.DoubleSide });
  const discGeometry = new THREE.CircleGeometry(COOLING.throat * 0.95, 24);
  const discMaterial = new THREE.MeshStandardMaterial({ color: PALETTE.main, roughness: 1 });
  const emitters: THREE.Vector3[] = [];
  for (const [dx, dz] of [
    [-34, -14],
    [-6, -26],
  ]) {
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.set(c.x + dx, 0, c.z + dz);
    tower.castShadow = true;
    tower.receiveShadow = true;
    tower.name = 'cooling-tower';
    group.add(tower);
    const disc = new THREE.Mesh(discGeometry, discMaterial);
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(c.x + dx, COOLING.height * 0.86, c.z + dz);
    group.add(disc);
    boxes.add({ x: c.x + dx, z: c.z + dz, w: 30, h: 0.3, d: 30, color: PALETTE.plaza });
    emitters.push(new THREE.Vector3(c.x + dx, COOLING.height + 1, c.z + dz));
  }

  // Long low hall with ridge vents.
  boxes.add({ ...at(22, 14), w: 64, h: 10, d: 22 });
  for (let i = 0; i < 6; i++) boxes.add({ ...at(-4 + i * 10.4, 14), y: 10, w: 2.4, h: 1.6, d: 3 });

  // Turbine hall with a raised roof strip and roof units.
  boxes.add({ ...at(26, -20), w: 34, h: 16, d: 18 });
  boxes.add({ ...at(26, -20), y: 16, w: 34, h: 2, d: 6 });
  for (let i = 0; i < 4; i++) boxes.add({ ...at(14 + i * 8, -26), y: 16, w: 3, h: 1.4, d: 2.4 });

  // Stack on a base block.
  boxes.add({ ...at(50, -14), w: 6, h: 5, d: 6 });
  cylinders.add({ ...at(50, -14), w: 1.8, h: 46, d: 1.8 });
  cylinders.add({ ...at(50, -14), y: 46, w: 2.6, h: 1.2, d: 2.6 });

  // Storage tanks.
  for (const dx of [-44, -31, -18]) {
    cylinders.add({ ...at(dx, 22), w: 11, h: 9, d: 11 });
    cylinders.add({ ...at(dx, 22), y: 9, w: 3, h: 0.8, d: 3 });
  }

  // Pipes on supports.
  boxes.add({ ...at(0, 32), y: 3.2, w: 60, h: 0.9, d: 0.9 });
  for (let i = 0; i < 6; i++) boxes.add({ ...at(-25 + i * 10, 32), w: 0.5, h: 3.2, d: 0.5 });
  boxes.add({ ...at(46, -4), y: 3.2, w: 0.9, h: 0.9, d: 14 });
  boxes.add({ ...at(46, -4), w: 0.5, h: 3.2, d: 0.5 });

  // Switchyard with transformers.
  boxes.add({ ...at(34, 40), w: 32, h: 0.3, d: 12, color: PALETTE.plaza });
  for (let i = 0; i < 6; i++) boxes.add({ ...at(22 + i * 5, 40), y: 0.3, w: 3, h: 3.4, d: 2.2, color: PALETTE.main });

  for (const [dx, dz, rot] of [
    [4, -4, 0.4],
    [8, -2, 2.1],
    [2, 0, 3.6],
    [12, -6, 1.2],
    [14, 0, 5.1],
    [6, -8, 0.9],
  ]) {
    people.push({ x: c.x + dx, y: 0.2, z: c.z + dz, rot });
  }

  return { emitters };
}
