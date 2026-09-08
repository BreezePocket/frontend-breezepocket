import * as THREE from 'three';
import { GRID_SIZE, LAYER, PALETTE } from '../constants';

/**
 * Flat ribbon lines laid just above the floor (routes, signal lines) and the search-grid pad.
 * Both use small ShaderMaterials that take part in the scene fog and tone mapping.
 */
const VERTEX = /* glsl */ `
#include <common>
#include <fog_pars_vertex>
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`;

/** uv.x runs 0..1 along the line; uRatio draws it in, uTail..uHead is the bright travelling window. */
const LINE_FRAGMENT = /* glsl */ `
#include <common>
#include <fog_pars_fragment>
uniform vec3 uColor;
uniform vec3 uPulseColor;
uniform float uRatio;
uniform float uHead;
uniform float uTail;
uniform float uOpacity;
uniform float uGlow;
varying vec2 vUv;
void main() {
  if (vUv.x > uRatio) discard;
  float edge = 1.0 - smoothstep(0.3, 0.5, abs(vUv.y - 0.5));
  float tip = 1.0 - smoothstep(uRatio - 0.02, uRatio, vUv.x);
  float inside = step(uTail, vUv.x) * (1.0 - step(uHead, vUv.x));
  float ramp = uHead > uTail ? smoothstep(uTail, uHead, vUv.x) : 0.0;
  float glow = inside * ramp;
  vec3 color = mix(uColor, uPulseColor * uGlow, glow);
  gl_FragColor = vec4(color, uOpacity * edge * tip);
  #include <fog_fragment>
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/** Cell grid with an expanding ring from the centre cell (port of the original's floor grid node). */
const GRID_FRAGMENT = /* glsl */ `
#include <common>
#include <fog_pars_fragment>
uniform float uRatio;
uniform float uTime;
uniform float uCells;
uniform vec3 uColor;
uniform vec3 uPulse;
varying vec2 vUv;
void main() {
  vec2 g = vUv * uCells;
  vec2 f = abs(fract(g) - 0.5);
  float lines = smoothstep(0.43, 0.47, max(f.x, f.y));
  vec2 cell = floor(g) - floor(uCells * 0.5);
  float dist = length(cell);
  float ring = clamp(1.0 - abs(dist - mod(uTime * 2.0, 7.07)) / 1.2, 0.0, 1.0);
  float centre = 1.0 - min(1.0, abs(cell.x) + abs(cell.y));
  float fill = ring * (1.0 - centre) * 0.28 + centre * 0.55;
  vec3 color = mix(uColor, uPulse, ring);
  gl_FragColor = vec4(color, (lines * 0.5 + fill) * uRatio);
  #include <fog_fragment>
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/** Two-vertex-per-sample strip following `curve`, offset sideways by `offset`, lying at height `y`. */
export function ribbonGeometry(
  curve: THREE.Curve<THREE.Vector3>,
  width: number,
  offset: number,
  y: number,
  samples: number,
): THREE.BufferGeometry {
  const positions = new Float32Array(samples * 6);
  const uvs = new Float32Array(samples * 4);
  const index: number[] = [];
  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const inner = offset - width / 2;
  const outer = offset + width / 2;
  for (let i = 0; i < samples; i++) {
    const u = i / (samples - 1);
    curve.getPointAt(u, point);
    curve.getTangentAt(u, tangent);
    side.set(tangent.z, 0, -tangent.x).normalize();
    positions[i * 6] = point.x + side.x * inner;
    positions[i * 6 + 1] = y;
    positions[i * 6 + 2] = point.z + side.z * inner;
    positions[i * 6 + 3] = point.x + side.x * outer;
    positions[i * 6 + 4] = y;
    positions[i * 6 + 5] = point.z + side.z * outer;
    uvs[i * 4] = u;
    uvs[i * 4 + 1] = 0;
    uvs[i * 4 + 2] = u;
    uvs[i * 4 + 3] = 1;
    if (i < samples - 1) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  geometry.computeBoundingSphere();
  return geometry;
}

export interface RouteLineOptions {
  color: number;
  pulseColor?: number;
  width?: number;
  /** Sideways offset from the curve (lets a signal line run beside a route). */
  offset?: number;
  opacity?: number;
  /** HDR multiplier for the travelling pulse (bloom picks it up on desktop). */
  glow?: number;
  y?: number;
}

export class RouteLine {
  readonly mesh: THREE.Mesh;
  readonly material: THREE.ShaderMaterial;
  private readonly ratio: THREE.IUniform<number>;
  private readonly head: THREE.IUniform<number>;
  private readonly tail: THREE.IUniform<number>;

  constructor(
    readonly curve: THREE.CatmullRomCurve3,
    options: RouteLineOptions,
  ) {
    const { color, pulseColor = PALETTE.pulse, width = 0.7, offset = 0, opacity = 1, glow = 4, y = LAYER.line } = options;
    const length = curve.getLength();
    const samples = Math.min(400, Math.max(32, Math.round(length / 1.2)));
    const uniforms = {
      ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
      uColor: { value: new THREE.Color(color) },
      uPulseColor: { value: new THREE.Color(pulseColor) },
      uRatio: { value: 1 },
      uHead: { value: 0 },
      uTail: { value: 0 },
      uOpacity: { value: opacity },
      uGlow: { value: glow },
    };
    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: LINE_FRAGMENT,
      fog: true,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(ribbonGeometry(curve, width, offset, y, samples), this.material);
    this.mesh.renderOrder = 2;
    this.ratio = uniforms.uRatio;
    this.head = uniforms.uHead;
    this.tail = uniforms.uTail;
  }

  /** 0..1 fraction of the line that is drawn. */
  setRatio(value: number): void {
    this.ratio.value = value;
    this.mesh.visible = value > 0;
  }

  /** Bright window between `tail` and `head` (both 0..1 along the line). */
  setPulse(head: number, tail: number): void {
    this.head.value = head;
    this.tail.value = tail;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

export class GridPad {
  readonly mesh: THREE.Mesh;
  readonly material: THREE.ShaderMaterial;
  private readonly ratio: THREE.IUniform<number>;
  private readonly time: THREE.IUniform<number>;

  constructor(centre: THREE.Vector3, size: number = GRID_SIZE) {
    const uniforms = {
      ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
      uRatio: { value: 0 },
      uTime: { value: 0 },
      uCells: { value: 11 },
      uColor: { value: new THREE.Color(PALETTE.primary) },
      uPulse: { value: new THREE.Color(PALETTE.pulse) },
    };
    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: GRID_FRAGMENT,
      fog: true,
      transparent: true,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.set(centre.x, LAYER.grid, centre.z);
    this.mesh.renderOrder = 3;
    this.mesh.visible = false;
    this.ratio = uniforms.uRatio;
    this.time = uniforms.uTime;
  }

  update(ratio: number, time: number): void {
    this.ratio.value = ratio;
    this.time.value = time;
    this.mesh.visible = ratio > 0;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

/** Soft radial tint on the floor used to highlight the active district. */
export function createSpot(
  texture: THREE.Texture,
  centre: THREE.Vector3,
  size: number,
): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: PALETTE.blueLines,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(centre.x, LAYER.spot, centre.z);
  mesh.renderOrder = 1;
  mesh.visible = false;
  return mesh;
}
