import { AREAS, PALETTE, STOREY } from '../constants';
import type { BuildContext } from './types';

/**
 * Section A — holdings: stacks of token coins on a plaza (tallest in the centre), low "wallet"
 * slabs around the edge and a small vault of cubes to the west.
 */
interface StackSpec {
  dx: number;
  dz: number;
  diameter: number;
  coins: number;
  /** Colour of the top coin (an accent token); others stay white. */
  accent?: number;
}

const STACKS: StackSpec[] = [
  { dx: -22, dz: -14, diameter: 14, coins: 13, accent: PALETTE.coinBlue },
  { dx: -2, dz: -24, diameter: 12, coins: 10 },
  { dx: 18, dz: -18, diameter: 10, coins: 8, accent: PALETTE.coinCyan },
  { dx: 24, dz: 2, diameter: 12, coins: 11, accent: PALETTE.coinBlue },
  { dx: 18, dz: 22, diameter: 10, coins: 7 },
  { dx: -4, dz: 24, diameter: 12, coins: 9, accent: PALETTE.coinCyan },
  { dx: -24, dz: 2, diameter: 10, coins: 6 },
  { dx: -36, dz: -2, diameter: 10, coins: 9 },
];

const SLABS = [
  { dx: 0, dz: -44, w: 14, h: 5, d: 8 },
  { dx: 40, dz: -38, w: 10, h: 3, d: 8 },
  { dx: 44, dz: 26, w: 8, d: 10, h: 5 },
  { dx: 30, dz: 38, w: 12, h: 3, d: 8 },
  { dx: 8, dz: 42, w: 10, h: 5, d: 8 },
  { dx: -30, dz: 36, w: 10, h: 3, d: 10 },
  { dx: -46, dz: 20, w: 8, h: 5, d: 8 },
  { dx: -46, dz: -20, w: 10, h: 3, d: 8 },
  { dx: -24, dz: -40, w: 8, h: 5, d: 8 },
  { dx: 46, dz: -12, w: 8, h: 3, d: 8 },
];

export function buildHoldings(ctx: BuildContext): void {
  const { boxes, cylinders, random } = ctx;
  const c = AREAS.holdings;
  boxes.add({ x: c.x, z: c.z, w: 110, h: 0.2, d: 110, color: PALETTE.pad });
  boxes.add({ x: c.x, z: c.z, w: 26, h: 0.3, d: 26, color: PALETTE.plaza });

  for (const s of STACKS) {
    for (let i = 0; i < s.coins; i++) {
      const jx = (random() - 0.5) * 0.8;
      const jz = (random() - 0.5) * 0.8;
      const top = i === s.coins - 1;
      cylinders.add({
        x: c.x + s.dx + jx,
        y: i * STOREY,
        z: c.z + s.dz + jz,
        w: s.diameter,
        h: STOREY * 0.82,
        d: s.diameter,
        rot: random() * Math.PI,
        color: top && s.accent ? s.accent : PALETTE.coin,
      });
    }
  }

  for (const b of SLABS) {
    boxes.add({ x: c.x + b.dx, z: c.z + b.dz, w: b.w, h: b.h, d: b.d });
    boxes.add({ x: c.x + b.dx + 1, y: b.h, z: c.z + b.dz - 1, w: 2, h: 0.8, d: 1.6, color: PALETTE.coinBlue });
  }

  // Plaza markers.
  for (const [px, pz] of [
    [-9, -9],
    [9, -9],
    [-9, 9],
    [9, 9],
  ]) {
    boxes.add({ x: c.x + px, y: 0.3, z: c.z + pz, w: 2.4, h: 0.8, d: 2.4, color: PALETTE.main });
  }

  // Vault: a 3×3 pile of cubes with a second layer, west of the plaza.
  const yardX = c.x - 82;
  const yardZ = c.z + 46;
  boxes.add({ x: yardX + 3, z: yardZ + 3, w: 22, h: 0.2, d: 22, color: PALETTE.pad });
  for (let i = 0; i < 9; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    boxes.add({ x: yardX + col * 3.4, z: yardZ + row * 3.4, w: 3, h: 3, d: 3 });
    if ((col + row) % 2 === 0) boxes.add({ x: yardX + col * 3.4, y: 3, z: yardZ + row * 3.4, w: 3, h: 3, d: 3 });
  }
  boxes.add({ x: yardX + 3.4, y: 6, z: yardZ + 3.4, w: 3, h: 3, d: 3, color: PALETTE.coinCyan });
}
