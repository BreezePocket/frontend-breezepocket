import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export interface PersonSpot {
  x: number;
  /** Floor height under the person (top of the pad they stand on). */
  y: number;
  z: number;
  rot: number;
}

/** Capsule body + sphere head, ~1.8 units tall (storeys are 4 units). */
function personGeometry(): THREE.BufferGeometry {
  const body = new THREE.CapsuleGeometry(0.3, 0.8, 2, 8);
  body.translate(0, 0.7, 0);
  const head = new THREE.SphereGeometry(0.27, 8, 6);
  head.translate(0, 1.58, 0);
  const merged = mergeGeometries([body, head]) as THREE.BufferGeometry | null;
  if (!merged) {
    head.dispose();
    return body;
  }
  body.dispose();
  head.dispose();
  return merged;
}

/** All figures in one InstancedMesh; only the Y translation changes per frame (idle bob). */
export class People {
  readonly mesh: THREE.InstancedMesh;
  private readonly base: THREE.Matrix4[] = [];
  private readonly baseY: Float32Array;
  private readonly phase: Float32Array;
  private readonly tmp = new THREE.Matrix4();

  constructor(spots: PersonSpot[], material: THREE.Material, random: () => number) {
    const count = Math.max(1, spots.length);
    this.mesh = new THREE.InstancedMesh(personGeometry(), material, count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.castShadow = true;
    this.mesh.name = 'people';
    this.baseY = new Float32Array(count);
    this.phase = new Float32Array(count);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const spot = spots[i] ?? { x: 0, y: -10, z: 0, rot: 0 };
      dummy.position.set(spot.x, spot.y, spot.z);
      dummy.rotation.set(0, spot.rot, 0);
      dummy.updateMatrix();
      this.base.push(dummy.matrix.clone());
      this.baseY[i] = spot.y;
      this.phase[i] = random() * Math.PI * 2;
      this.mesh.setMatrixAt(i, dummy.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  update(time: number): void {
    const matrices = this.base;
    for (let i = 0; i < matrices.length; i++) {
      this.tmp.copy(matrices[i]);
      this.tmp.elements[13] = this.baseY[i] + 0.06 + 0.06 * Math.sin(time * 2.2 + this.phase[i]);
      this.mesh.setMatrixAt(i, this.tmp);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
  }
}
