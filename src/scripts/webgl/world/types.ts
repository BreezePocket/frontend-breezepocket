import type * as THREE from 'three';
import type { InstanceBatch } from '../batch';

/** Shared sinks the district builders write into (one draw call per batch). */
export interface BuildContext {
  group: THREE.Group;
  /** Unit box (1×1×1, centred). */
  boxes: InstanceBatch;
  /** Unit cylinder (diameter 1, height 1, centred). */
  cylinders: InstanceBatch;
  random: () => number;
  surface: THREE.MeshStandardMaterial;
}

export interface WorldState {
  /** Smoothed camera progress. */
  progress: number;
  /** Raw scroll target (0 while the page rests on the hero). */
  targetProgress: number;
  /** Seconds since the scene started (pauses with the loop). */
  time: number;
  /** Active flow step 0..3. */
  section: number;
}
