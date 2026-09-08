import { AREAS, PALETTE, STOREY } from '../constants';
import type { InstanceBatch } from '../batch';
import type { BuildContext } from './types';

/** Section A — downtown cluster: stepped towers with façade ribs, low blocks, a plaza with people. */
interface Footprint {
  dx: number;
  dz: number;
  w: number;
  d: number;
  storeys: number;
}

const TOWERS: Footprint[] = [
  { dx: -22, dz: -14, w: 14, d: 14, storeys: 13 },
  { dx: -2, dz: -24, w: 12, d: 10, storeys: 10 },
  { dx: 18, dz: -18, w: 10, d: 12, storeys: 8 },
  { dx: 24, dz: 2, w: 12, d: 12, storeys: 11 },
  { dx: 18, dz: 22, w: 10, d: 10, storeys: 7 },
  { dx: -4, dz: 24, w: 12, d: 12, storeys: 9 },
  { dx: -24, dz: 2, w: 10, d: 10, storeys: 6 },
  { dx: -36, dz: -2, w: 10, d: 12, storeys: 9 },
];

const BLOCKS: Footprint[] = [
  { dx: 0, dz: -44, w: 14, d: 8, storeys: 2 },
  { dx: 40, dz: -38, w: 10, d: 8, storeys: 1 },
  { dx: 44, dz: 26, w: 8, d: 10, storeys: 2 },
  { dx: 30, dz: 38, w: 12, d: 8, storeys: 1 },
  { dx: 8, dz: 42, w: 10, d: 8, storeys: 2 },
  { dx: -30, dz: 36, w: 10, d: 10, storeys: 1 },
  { dx: -46, dz: 20, w: 8, d: 8, storeys: 2 },
  { dx: -46, dz: -20, w: 10, d: 8, storeys: 1 },
  { dx: -24, dz: -40, w: 8, d: 8, storeys: 2 },
  { dx: 46, dz: -12, w: 8, d: 8, storeys: 1 },
];

const RIB_STEP = 3;

/** Thin vertical ribs on the two camera-facing faces (+X and +Z). */
function ribs(boxes: InstanceBatch, cx: number, cz: number, w: number, d: number, y: number, h: number): void {
  const nx = Math.floor((w - 2) / RIB_STEP);
  for (let i = 0; i < nx; i++) {
    const x = cx - ((nx - 1) * RIB_STEP) / 2 + i * RIB_STEP;
    boxes.add({ x, y, z: cz + d / 2 + 0.12, w: 0.36, h, d: 0.3 });
  }
  const nz = Math.floor((d - 2) / RIB_STEP);
  for (let i = 0; i < nz; i++) {
    const z = cz - ((nz - 1) * RIB_STEP) / 2 + i * RIB_STEP;
    boxes.add({ x: cx + w / 2 + 0.12, y, z, w: 0.3, h, d: 0.36 });
  }
}

function tower(boxes: InstanceBatch, spec: Footprint, cx: number, cz: number, random: () => number): void {
  const tiers = spec.storeys >= 9 ? [0.5, 0.3, 0.2] : spec.storeys >= 6 ? [0.65, 0.35] : [1];
  let y = 0;
  let w = spec.w;
  let d = spec.d;
  let ox = 0;
  let oz = 0;
  tiers.forEach((share, i) => {
    const h = Math.max(1, Math.round(spec.storeys * share)) * STOREY;
    boxes.add({ x: cx + ox, y, z: cz + oz, w, h, d });
    if (i < 2) ribs(boxes, cx + ox, cz + oz, w, d, y, h);
    y += h;
    const nw = w * 0.78;
    const nd = d * 0.78;
    ox += (random() - 0.5) * (w - nw);
    oz += (random() - 0.5) * (d - nd);
    w = nw;
    d = nd;
  });
  const units = 1 + Math.floor(random() * 3);
  for (let i = 0; i < units; i++) {
    boxes.add({
      x: cx + ox + (random() - 0.5) * (w - 3),
      y,
      z: cz + oz + (random() - 0.5) * (d - 3),
      w: 2.2,
      h: 1.1 + random(),
      d: 1.8,
    });
  }
  if (spec.storeys >= 11) boxes.add({ x: cx + ox, y, z: cz + oz, w: 0.3, h: 6, d: 0.3 });
}

export function buildDowntown(ctx: BuildContext): void {
  const { boxes, random, people } = ctx;
  const c = AREAS.downtown;
  boxes.add({ x: c.x, z: c.z, w: 110, h: 0.2, d: 110, color: PALETTE.pad });
  boxes.add({ x: c.x, z: c.z, w: 26, h: 0.3, d: 26, color: PALETTE.plaza });

  for (const spec of TOWERS) tower(boxes, spec, c.x + spec.dx, c.z + spec.dz, random);
  for (const spec of BLOCKS) {
    const h = spec.storeys * STOREY;
    boxes.add({ x: c.x + spec.dx, z: c.z + spec.dz, w: spec.w, h, d: spec.d });
    boxes.add({ x: c.x + spec.dx + 1, y: h, z: c.z + spec.dz - 1, w: 2, h: 1, d: 1.6 });
  }

  // Plaza furniture: planters at the corners and a kiosk.
  for (const [px, pz] of [
    [-9, -9],
    [9, -9],
    [-9, 9],
    [9, 9],
  ]) {
    boxes.add({ x: c.x + px, y: 0.3, z: c.z + pz, w: 2.4, h: 0.8, d: 2.4, color: PALETTE.main });
  }
  boxes.add({ x: c.x + 6, y: 0.3, z: c.z + 5, w: 3, h: 2.5, d: 3 });

  // Container yard: a 3×3 pile of stacked cubes with a second layer, west of the city.
  const yardX = c.x - 82;
  const yardZ = c.z + 46;
  boxes.add({ x: yardX + 3, z: yardZ + 3, w: 22, h: 0.2, d: 22, color: PALETTE.pad });
  for (let i = 0; i < 9; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    boxes.add({ x: yardX + col * 3.4, z: yardZ + row * 3.4, w: 3, h: 3, d: 3 });
    if ((col + row) % 2 === 0) boxes.add({ x: yardX + col * 3.4, y: 3, z: yardZ + row * 3.4, w: 3, h: 3, d: 3 });
  }
  boxes.add({ x: yardX + 3.4, y: 6, z: yardZ + 3.4, w: 3, h: 3, d: 3 });

  for (let i = 0; i < 16; i++) {
    const angle = random() * Math.PI * 2;
    const radius = 3 + random() * 8;
    people.push({ x: c.x + Math.cos(angle) * radius, y: 0.3, z: c.z + Math.sin(angle) * radius, rot: random() * Math.PI * 2 });
  }
}
