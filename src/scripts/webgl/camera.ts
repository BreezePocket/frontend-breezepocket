import * as THREE from 'three';
import { AREAS } from './constants';

/**
 * Camera flight definition. Each keyframe pins the pose reached at a given camera progress; the
 * camera sits on a spherical offset from its look-at target (azimuth around Y, pitch below the
 * horizon, distance). Positions and targets are threaded through centripetal Catmull-Rom splines
 * and sampled by arc length so the flight has constant speed between keyframes.
 */
export interface CameraKeyframe {
  /** Camera progress (0..1) at which this pose is reached. Must be increasing. */
  progress: number;
  /** Point on the floor the camera looks at. */
  target: THREE.Vector3;
  /** Horizontal angle in degrees around the target (0 = camera due +Z of the target). */
  azimuth: number;
  /** Tilt below the horizon in degrees (90 = straight down). */
  pitch: number;
  /** Distance from the target to the camera. */
  distance: number;
}

export const BASE_FOV = 40;
/** Aspect below which the vertical fov widens so the same content fits (portrait phones). */
export const BASE_ASPECT = 1.5;
/** Extra height at the start of the entrance move and its duration in seconds. */
export const ENTRANCE_HEIGHT = 70;
export const ENTRANCE_DURATION = 2;

const offset = (area: THREE.Vector3, dx: number, dz: number) => new THREE.Vector3(area.x + dx, 0, area.z + dz);

export const KEYFRAMES: readonly CameraKeyframe[] = [
  { progress: 0, target: offset(AREAS.downtown, -12, -62), azimuth: 32, pitch: 56, distance: 250 },
  { progress: 0.2, target: offset(AREAS.downtown, 6, -6), azimuth: 32, pitch: 52, distance: 130 },
  { progress: 0.5, target: offset(AREAS.plant, 4, -6), azimuth: 28, pitch: 52, distance: 170 },
  { progress: 0.75, target: offset(AREAS.windFarm, 10, -14), azimuth: 24, pitch: 54, distance: 170 },
  { progress: 0.9, target: offset(AREAS.campus, 4, -8), azimuth: 34, pitch: 54, distance: 170 },
  { progress: 1, target: offset(AREAS.campus, 0, -20), azimuth: 40, pitch: 58, distance: 260 },
];

export function keyframePosition(key: CameraKeyframe, out: THREE.Vector3): THREE.Vector3 {
  const pitch = THREE.MathUtils.degToRad(key.pitch);
  const azimuth = THREE.MathUtils.degToRad(key.azimuth);
  const horizontal = key.distance * Math.cos(pitch);
  return out.set(
    key.target.x + Math.sin(azimuth) * horizontal,
    key.target.y + key.distance * Math.sin(pitch),
    key.target.z + Math.cos(azimuth) * horizontal,
  );
}

const DIVISIONS_PER_SEGMENT = 64;

/** Arc-length fraction (0..1) at which each control point sits on the curve. */
function arcFractions(curve: THREE.CatmullRomCurve3, count: number): number[] {
  const divisions = (count - 1) * DIVISIONS_PER_SEGMENT;
  curve.arcLengthDivisions = divisions;
  const lengths = curve.getLengths(divisions);
  const total = lengths[divisions] || 1;
  const fractions: number[] = [];
  for (let i = 0; i < count; i++) fractions.push(lengths[i * DIVISIONS_PER_SEGMENT] / total);
  return fractions;
}

export class CameraPath {
  private readonly positions: THREE.CatmullRomCurve3;
  private readonly targets: THREE.CatmullRomCurve3;
  private readonly progress: number[];
  private readonly positionU: number[];
  private readonly targetU: number[];

  constructor(keys: readonly CameraKeyframe[]) {
    if (keys.length < 2) throw new Error('CameraPath needs at least two keyframes');
    this.positions = new THREE.CatmullRomCurve3(
      keys.map((key) => keyframePosition(key, new THREE.Vector3())),
      false,
      'centripetal',
      0.5,
    );
    this.targets = new THREE.CatmullRomCurve3(
      keys.map((key) => key.target.clone()),
      false,
      'centripetal',
      0.5,
    );
    this.progress = keys.map((key) => key.progress);
    this.positionU = arcFractions(this.positions, keys.length);
    this.targetU = arcFractions(this.targets, keys.length);
  }

  /** Writes the camera position and look-at point for `progress` (clamped to the keyframe range). */
  poseAt(progress: number, outPosition: THREE.Vector3, outTarget: THREE.Vector3): void {
    const last = this.progress.length - 1;
    let i = 0;
    while (i < last - 1 && progress >= this.progress[i + 1]) i++;
    const span = this.progress[i + 1] - this.progress[i] || 1;
    const local = THREE.MathUtils.clamp((progress - this.progress[i]) / span, 0, 1);
    this.positions.getPointAt(THREE.MathUtils.lerp(this.positionU[i], this.positionU[i + 1], local), outPosition);
    this.targets.getPointAt(THREE.MathUtils.lerp(this.targetU[i], this.targetU[i + 1], local), outTarget);
  }
}

/** Widen the vertical fov on narrow viewports so the horizontal extent stays comparable. */
export function responsiveFov(aspect: number): number {
  if (aspect >= BASE_ASPECT) return BASE_FOV;
  const half = THREE.MathUtils.degToRad(BASE_FOV) / 2;
  const fov = THREE.MathUtils.radToDeg(2 * Math.atan((Math.tan(half) * BASE_ASPECT) / aspect));
  return Math.min(fov, BASE_FOV * 1.6);
}

export interface Spring {
  value: number;
  velocity: number;
}

/** Critically damped smooth-damp (Unity semantics): moves `spring.value` toward `target`. */
export function smoothDamp(spring: Spring, target: number, smoothTime: number, dt: number): void {
  if (dt <= 0) return;
  const omega = 2 / Math.max(smoothTime, 1e-4);
  const x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = spring.value - target;
  const temp = (spring.velocity + omega * change) * dt;
  spring.velocity = (spring.velocity - omega * temp) * decay;
  let output = target + (change + temp) * decay;
  if (target - spring.value > 0 === output > target) {
    output = target;
    spring.velocity = 0;
  }
  spring.value = output;
}
