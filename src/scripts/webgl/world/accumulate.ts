import * as THREE from 'three';
import { AREAS, PALETTE, STOREY } from '../constants';
import type { BuildContext } from './types';

/**
 * Section D — accumulation: rows of coin stacks that grow from left to right, a long "ledger"
 * hall, and a plaza carrying the BreezePocket wave emblem (fades in with logoRatio).
 */
const PLAZA = { dx: -40, dz: 8, size: 30 };

/** Two stacked swoosh shapes approximating the logo mark, in a 100×60 design space. */
function emblemGeometry(): THREE.ExtrudeGeometry {
  const upper = new THREE.Shape();
  upper.moveTo(0, 30);
  upper.bezierCurveTo(22, 58, 62, 62, 100, 52);
  upper.bezierCurveTo(86, 40, 62, 40, 42, 32);
  upper.bezierCurveTo(28, 27, 12, 24, 0, 30);
  const lower = new THREE.Shape();
  lower.moveTo(0, 10);
  lower.bezierCurveTo(20, 34, 56, 38, 90, 30);
  lower.bezierCurveTo(78, 20, 56, 19, 38, 12);
  lower.bezierCurveTo(26, 7, 12, 4, 0, 10);
  const geometry = new THREE.ExtrudeGeometry([upper, lower], { depth: 0.8, bevelEnabled: false });
  geometry.center();
  geometry.rotateX(-Math.PI / 2);
  geometry.scale(0.24, 1, 0.24);
  return geometry;
}

export interface AccumulateResult {
  emblem: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshStandardMaterial>;
}

export function buildAccumulate(ctx: BuildContext): AccumulateResult {
  const { boxes, cylinders, group, random } = ctx;
  const c = AREAS.accumulate;
  const at = (dx: number, dz: number) => ({ x: c.x + dx, z: c.z + dz });

  boxes.add({ ...at(4, -8), w: 116, h: 0.2, d: 84, color: PALETTE.pad });

  // Three rows of stacks, each growing left → right (2 → 12 coins).
  for (const [row, dz] of [-34, -10, 14].entries()) {
    for (let i = 0; i < 7; i++) {
      const coins = 2 + Math.round((i / 6) * 10) + (row === 1 ? 1 : 0);
      const x = c.x - 20 + i * 9;
      const z = c.z + dz;
      for (let k = 0; k < coins; k++) {
        const top = k === coins - 1;
        cylinders.add({ x: x + (random() - 0.5) * 0.5, y: k * STOREY * 0.7, z: z + (random() - 0.5) * 0.5, w: 6.4, h: STOREY * 0.58, d: 6.4, rot: random() * Math.PI, color: top ? (i % 2 ? PALETTE.coinBlue : PALETTE.coinCyan) : PALETTE.coin });
      }
    }
  }

  // Ledger hall with roof units and a stepped office block.
  boxes.add({ ...at(48, -34), w: 22, h: 9, d: 20 });
  for (let i = 0; i < 3; i++) boxes.add({ ...at(41 + i * 7, -34), y: 9, w: 3, h: 1.8, d: 3 });
  boxes.add({ ...at(44, -6), w: 20, h: 14, d: 14 });
  boxes.add({ ...at(42, -8), y: 14, w: 12, h: 4, d: 8 });
  for (let i = 0; i < 5; i++) boxes.add({ ...at(37 + i * 3.5, 1.12), w: 0.36, h: 14, d: 0.3 });

  // Plaza with the emblem.
  boxes.add({ ...at(PLAZA.dx, PLAZA.dz), w: PLAZA.size, h: 0.35, d: PLAZA.size, color: PALETTE.plaza });
  const emblemMaterial = new THREE.MeshStandardMaterial({
    color: PALETTE.primary,
    emissive: PALETTE.coinCyan,
    emissiveIntensity: 0.25,
    roughness: 0.5,
    transparent: true,
    opacity: 0,
  });
  const emblem = new THREE.Mesh(emblemGeometry(), emblemMaterial);
  emblem.position.set(c.x + PLAZA.dx, 0.36, c.z + PLAZA.dz);
  emblem.visible = false;
  emblem.name = 'emblem';
  group.add(emblem);

  // Lamp posts around the plaza.
  for (const [px, pz] of [
    [-52, -18],
    [-28, -18],
    [-52, 34],
    [-28, 34],
  ]) {
    boxes.add({ ...at(px, pz), w: 0.5, h: 9, d: 0.5 });
    boxes.add({ ...at(px, pz), y: 9, w: 2.2, h: 0.5, d: 2.2, color: PALETTE.coinCyan });
  }

  return { emblem };
}
