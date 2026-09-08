import * as THREE from 'three';

/** Scene palette: BreezePocket blues plus the page background and surface tints. */
export const PALETTE = {
  main: 0xa7d0fb,
  floor: 0x94bbe5,
  primary: 0x027bf6,
  redLines: 0xff4d67,
  blueLines: 0x0e94fb,
  pulse: 0x57cdff,
  page: 0xd0e1eb,
  building: 0xf2f6fa,
  pad: 0xa2c3e6,
  plaza: 0xf7fafd,
  /** Token coins and accents. */
  coin: 0xf6f9fc,
  coinBlue: 0x027bf6,
  coinCyan: 0x13eafb,
  stable: 0x2fd6c9,
  sell: 0xff4d67,
  buy: 0x2fd6c9,
} as const;

/** One coin/storey in world units; stack heights are multiples of this. */
export const STOREY = 4;

/** District centres on the floor plane (Y is up): holdings → sell target → buy target → accumulate. */
export const AREAS = {
  holdings: new THREE.Vector3(0, 0, 0),
  sell: new THREE.Vector3(70, 0, -205),
  buy: new THREE.Vector3(118, 0, -84),
  accumulate: new THREE.Vector3(84, 0, 22),
} as const;

/** Price-grid pad beside the buy-target chart (fades in over TIMING.grid). */
export const GRID_CENTRE = new THREE.Vector3(160, 0, -118);
export const GRID_SIZE = 26;

/** Heights of the flat overlays above the floor so they never z-fight with the pads. */
export const LAYER = { spot: 0.42, line: 0.46, grid: 0.5 } as const;

/**
 * Camera-progress windows (0..1) that drive the reveals. Route lines draw themselves in over
 * their window, the grid fades in over `grid`, and the campus emblem fades in once progress
 * passes `emblem` (and back out when it drops below).
 */
export const TIMING = {
  routeAB: [0.02, 0.24],
  routeBC: [0.24, 0.6],
  routeCD: [0.6, 0.82],
  grid: [0.72, 0.75],
  emblem: 0.82,
} as const;

export type Window = readonly [number, number];

/** Clamped linear remap of `v` from `[from, to]` to 0..1 (index access: called every frame, must not allocate). */
export const ratio = (v: number, window: Window): number => {
  const from = window[0];
  const to = window[1];
  return THREE.MathUtils.clamp((v - from) / (to - from || 1), 0, 1);
};
