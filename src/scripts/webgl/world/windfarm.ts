import { AREAS, GRID_CENTRE, GRID_SIZE, PALETTE } from '../constants';
import { Turbines, type TurbineSpec } from './turbines';
import type { BuildContext } from './types';

/** Section C — wind farm: 14 turbines in staggered rows plus a substation on the search-grid pad. */
const ROWS: Array<{ z: number; xs: number[] }> = [
  { z: 20, xs: [-56, -34, -12, 10, 32] },
  { z: -10, xs: [-66, -44, -22, 0, 22] },
  { z: -40, xs: [-56, -34, -12, 10] },
];

export function buildWindFarm(ctx: BuildContext): Turbines {
  const { boxes, random, people, surface } = ctx;
  const c = AREAS.windFarm;

  const specs: TurbineSpec[] = [];
  const baseYaw = 0.55;
  for (const row of ROWS) {
    for (const x of row.xs) {
      specs.push({
        x: c.x + x + (random() - 0.5) * 4,
        z: c.z + row.z + (random() - 0.5) * 4,
        height: 26 + random() * 5,
        yaw: baseYaw + (random() - 0.5) * 0.3,
        speed: 2.5 * (0.85 + random() * 0.3),
        phase: random() * Math.PI * 2,
      });
    }
  }
  const turbines = new Turbines(specs, boxes, surface);

  // Substation inside the grid pad.
  const g = GRID_CENTRE;
  boxes.add({ x: g.x, z: g.z, w: GRID_SIZE + 4, h: 0.2, d: GRID_SIZE + 4, color: PALETTE.pad });
  boxes.add({ x: g.x - 6, z: g.z + 5, w: 8, h: 5, d: 6 });
  boxes.add({ x: g.x - 6, y: 5, z: g.z + 5, w: 2, h: 1, d: 2 });
  for (let i = 0; i < 4; i++) boxes.add({ x: g.x + 3 + i * 3, z: g.z - 5, w: 2.2, h: 3, d: 2, color: PALETTE.main });
  for (const [px, pz] of [
    [g.x + 8, g.z + 7],
    [g.x - 9, g.z - 8],
  ]) {
    boxes.add({ x: px, z: pz, w: 0.5, h: 14, d: 0.5 });
    boxes.add({ x: px, y: 11, z: pz, w: 6, h: 0.4, d: 0.4 });
    boxes.add({ x: px, y: 8, z: pz, w: 4.5, h: 0.4, d: 0.4 });
  }
  for (const [dx, dz, rot] of [
    [-1, 9, 0.3],
    [1, 10.5, 2.4],
    [-3, 11, 4.2],
  ]) {
    people.push({ x: g.x + dx, y: 0.2, z: g.z + dz, rot });
  }

  return turbines;
}
