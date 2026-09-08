import * as THREE from 'three';
import { InstanceBatch } from '../batch';
import { PALETTE } from '../constants';

export interface TurbineSpec {
  x: number;
  z: number;
  height: number;
  /** Direction the nacelle faces (radians around Y). */
  yaw: number;
  /** Rotor angular speed in rad/s. */
  speed: number;
  phase: number;
}

const BLADE_LENGTH = 12.5;
const NACELLE = { w: 2.2, h: 2.2, d: 4.4 };

/**
 * Tapered poles + nacelles go into the static batches; the 3 blades of every rotor are instances
 * of one flat box whose matrices are recomputed each frame (hub matrix × spin), so 14 rotors cost
 * one draw call and no allocations.
 */
export class Turbines {
  readonly group = new THREE.Group();
  private readonly blades: THREE.InstancedMesh;
  private readonly hubs: THREE.Matrix4[] = [];
  private readonly angles: Float32Array;
  private readonly speeds: Float32Array;
  private readonly spin = new THREE.Matrix4();
  private readonly out = new THREE.Matrix4();

  constructor(specs: TurbineSpec[], boxes: InstanceBatch, material: THREE.Material) {
    this.group.name = 'turbines';
    const poleGeometry = new THREE.CylinderGeometry(0.5, 1.05, 1, 10);
    const poles = new InstanceBatch(poleGeometry, material);
    const bladeGeometry = new THREE.BoxGeometry(0.7, BLADE_LENGTH, 0.16);
    bladeGeometry.translate(0, BLADE_LENGTH / 2 + 0.5, 0);
    this.blades = new THREE.InstancedMesh(bladeGeometry, material, specs.length * 3);
    this.blades.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.blades.castShadow = true;
    this.blades.name = 'blades';
    this.angles = new Float32Array(specs.length);
    this.speeds = new Float32Array(specs.length);

    const forward = new THREE.Vector3();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    const tint = new THREE.Color(PALETTE.building);
    specs.forEach((spec, i) => {
      forward.set(Math.sin(spec.yaw), 0, Math.cos(spec.yaw));
      poles.add({ x: spec.x, z: spec.z, w: 1, h: spec.height, d: 1 });
      boxes.add({ x: spec.x, z: spec.z, w: 4, h: 0.3, d: 4, color: PALETTE.plaza });
      boxes.add({
        x: spec.x + forward.x * 0.6,
        y: spec.height - NACELLE.h / 2,
        z: spec.z + forward.z * 0.6,
        w: NACELLE.w,
        h: NACELLE.h,
        d: NACELLE.d,
        rot: spec.yaw,
      });
      boxes.add({
        x: spec.x + forward.x * 3,
        y: spec.height - 0.65,
        z: spec.z + forward.z * 3,
        w: 1.3,
        h: 1.3,
        d: 1.2,
        rot: spec.yaw,
      });
      position.set(spec.x + forward.x * 3.7, spec.height, spec.z + forward.z * 3.7);
      quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, spec.yaw);
      this.hubs.push(new THREE.Matrix4().compose(position, quaternion, scale));
      this.angles[i] = spec.phase;
      this.speeds[i] = spec.speed;
      for (let k = 0; k < 3; k++) this.blades.setColorAt(i * 3 + k, tint);
    });
    if (this.blades.instanceColor) this.blades.instanceColor.needsUpdate = true;
    this.group.add(poles.build('turbine-poles'), this.blades);
    this.update(0);
  }

  update(dt: number): void {
    const hubs = this.hubs;
    for (let i = 0; i < hubs.length; i++) {
      let angle = this.angles[i] + this.speeds[i] * dt;
      if (angle > Math.PI * 2) angle -= Math.PI * 2;
      this.angles[i] = angle;
      for (let k = 0; k < 3; k++) {
        this.spin.makeRotationZ(angle + (k * Math.PI * 2) / 3);
        this.out.multiplyMatrices(hubs[i], this.spin);
        this.blades.setMatrixAt(i * 3 + k, this.out);
      }
    }
    this.blades.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    this.blades.geometry.dispose();
    this.group.traverse((object) => {
      if (object instanceof THREE.InstancedMesh && object !== this.blades) object.geometry.dispose();
    });
  }
}
