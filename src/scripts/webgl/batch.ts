import * as THREE from 'three';
import { PALETTE } from './constants';

/** Deterministic PRNG (mulberry32) so the procedural layout is identical on every load. */
export function createRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface InstanceSpec {
  /** Footprint centre. */
  x: number;
  z: number;
  /** Bottom of the instance (defaults to the floor). */
  y?: number;
  /** Size along X / Y / Z. */
  w: number;
  h: number;
  d: number;
  /** Yaw in radians. */
  rot?: number;
  color?: number;
}

/** Shared matte material for every white/grey surface; tints come from per-instance colours. */
export function createSurfaceMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 });
}

/**
 * Collects transforms for one unit geometry and bakes them into a single InstancedMesh.
 * Instances are described by footprint centre + bottom + size so builders read like a plan.
 */
export class InstanceBatch {
  private readonly matrices: THREE.Matrix4[] = [];
  private readonly colors: THREE.Color[] = [];
  private readonly dummy = new THREE.Object3D();

  constructor(
    private readonly geometry: THREE.BufferGeometry,
    private readonly material: THREE.Material,
    private readonly defaultColor: number = PALETTE.building,
  ) {}

  get count(): number {
    return this.matrices.length;
  }

  add(spec: InstanceSpec): number {
    const { x, z, y = 0, w, h, d, rot = 0, color = this.defaultColor } = spec;
    this.dummy.position.set(x, y + h / 2, z);
    this.dummy.rotation.set(0, rot, 0);
    this.dummy.scale.set(w, h, d);
    this.dummy.updateMatrix();
    this.matrices.push(this.dummy.matrix.clone());
    this.colors.push(new THREE.Color(color));
    return this.matrices.length - 1;
  }

  build(name: string): THREE.InstancedMesh {
    const mesh = new THREE.InstancedMesh(this.geometry, this.material, this.matrices.length);
    for (let i = 0; i < this.matrices.length; i++) {
      mesh.setMatrixAt(i, this.matrices[i]);
      mesh.setColorAt(i, this.colors[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = name;
    return mesh;
  }
}
