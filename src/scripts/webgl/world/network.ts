import * as THREE from 'three';
import { AREAS, GRID_CENTRE, PALETTE, TIMING, ratio, type Window } from '../constants';
import { GridPad, RouteLine } from './lines';

/**
 * Ground network: red routes linking the districts with blue signal lines beside them (continuous
 * travelling pulse), two downtown streets with idle dashes while the camera rests on the hero,
 * and the search-grid pad at the substation.
 */
const P = (x: number, z: number) => new THREE.Vector3(x, 0, z);
const spline = (points: THREE.Vector3[]) => new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);

const STREETS = [
  [P(-54, 15), P(-18, 14.5), P(18, 15.5), P(54, 14)],
  [P(-14, -54), P(-14.5, -18), P(-13.5, 18), P(-14, 54)],
];

interface RouteSpec {
  points: THREE.Vector3[];
  window: Window;
  /** Pulse travel speed in line-lengths per second. */
  pulseSpeed: number;
}

const A = AREAS.holdings;
const B = AREAS.sell;
const C = AREAS.buy;
const D = AREAS.accumulate;
const at = (base: THREE.Vector3, dx: number, dz: number) => P(base.x + dx, base.z + dz);
const ROUTES: RouteSpec[] = [
  {
    // Downtown → plant: leaves the plaza northwards and bends around the tower blocks.
    points: [at(A, 16, 15), at(A, 30, -6), at(A, 22, -40), at(A, 30, -80), at(A, 44, -120), at(B, -14, 40), at(B, -4, 12)],
    window: TIMING.routeAB,
    pulseSpeed: 0.26,
  },
  {
    // Plant → wind farm: east along the plant apron, then south-east into the turbine rows.
    points: [at(B, -4, 12), at(B, 30, 22), at(B, 56, 40), at(C, -30, -60), at(C, -10, -30), at(C, 8, -4)],
    window: TIMING.routeBC,
    pulseSpeed: 0.16,
  },
  {
    // Wind farm → campus: past the substation pad and down to the data halls.
    points: [at(C, 8, -4), P(GRID_CENTRE.x - 6, GRID_CENTRE.z + 10), at(C, 30, 24), at(D, 40, -40), at(D, 30, -14), at(D, 4, -8)],
    window: TIMING.routeCD,
    pulseSpeed: 0.22,
  },
];

const DASH_HEAD_TIME = 1;
const DASH_TAIL_TIME = 0.8;
const DASH_SPAWN_MIN = 1.4;
const DASH_SPAWN_MAX = 3;
const PULSE_LENGTH = 0.1;

interface IdleDash {
  active: boolean;
  phase: number;
  spawn: number;
}

interface Route {
  red: RouteLine;
  blue: RouteLine;
  window: Window;
  speed: number;
  t: number;
}

export interface NetworkState {
  progress: number;
  targetProgress: number;
}

export class Network {
  readonly group = new THREE.Group();
  private readonly streets: RouteLine[] = [];
  private readonly dashes: IdleDash[] = [];
  private readonly routes: Route[] = [];
  private readonly grid: GridPad;
  private gridTime = 0;
  private readonly random: () => number;

  constructor(random: () => number) {
    this.random = random;
    this.group.name = 'network';

    STREETS.forEach((points, i) => {
      const line = new RouteLine(spline(points), { color: PALETTE.redLines, pulseColor: 0xffb3c2, glow: 1.6, width: 0.7 });
      this.streets.push(line);
      this.dashes.push({ active: false, phase: 0, spawn: 0.6 + i * 0.9 });
      this.group.add(line.mesh);
    });

    ROUTES.forEach((spec, i) => {
      const curve = spline(spec.points);
      const red = new RouteLine(curve, { color: PALETTE.redLines, width: 0.7, glow: 1 });
      const blue = new RouteLine(curve, { color: PALETTE.blueLines, width: 0.55, offset: 1.8, glow: 4.5 });
      red.setRatio(0);
      blue.setRatio(0);
      this.routes.push({ red, blue, window: spec.window, speed: spec.pulseSpeed, t: (i * 0.37) % 1 });
      this.group.add(red.mesh, blue.mesh);
    });

    this.grid = new GridPad(GRID_CENTRE);
    this.group.add(this.grid.mesh);
  }

  update(dt: number, state: NetworkState): void {
    const idle = state.targetProgress <= 0;
    for (let i = 0; i < this.streets.length; i++) {
      const dash = this.dashes[i];
      const line = this.streets[i];
      if (dash.active) {
        dash.phase += dt;
        if (dash.phase < DASH_HEAD_TIME) {
          line.setPulse(dash.phase / DASH_HEAD_TIME, 0);
        } else if (dash.phase < DASH_HEAD_TIME + DASH_TAIL_TIME) {
          line.setPulse(1, (dash.phase - DASH_HEAD_TIME) / DASH_TAIL_TIME);
        } else {
          dash.active = false;
          dash.phase = 0;
          dash.spawn = DASH_SPAWN_MIN + this.random() * (DASH_SPAWN_MAX - DASH_SPAWN_MIN);
          line.setPulse(0, 0);
        }
      } else if (idle) {
        dash.spawn -= dt;
        if (dash.spawn <= 0) {
          dash.active = true;
          dash.phase = 0;
        }
      }
    }

    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      const drawn = ratio(state.progress, route.window);
      route.red.setRatio(drawn);
      route.blue.setRatio(drawn);
      if (drawn <= 0) continue;
      route.t += dt * route.speed;
      if (route.t > 1 + PULSE_LENGTH) route.t -= 1 + PULSE_LENGTH;
      route.blue.setPulse(route.t, route.t - PULSE_LENGTH);
    }

    const gridRatio = ratio(state.progress, TIMING.grid);
    this.gridTime = gridRatio > 0 ? this.gridTime + dt : 0;
    this.grid.update(gridRatio, this.gridTime);
  }

  dispose(): void {
    for (const line of this.streets) line.dispose();
    for (const route of this.routes) {
      route.red.dispose();
      route.blue.dispose();
    }
    this.grid.dispose();
  }
}
