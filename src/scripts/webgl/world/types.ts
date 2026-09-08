import type * as THREE from 'three';
import type { InstanceBatch } from '../batch';
import type { PersonSpot } from './people';

/** Shared sinks the district builders write into (one draw call per batch). */
export interface BuildContext {
  group: THREE.Group;
  /** Unit box (1×1×1, centred). */
  boxes: InstanceBatch;
  /** Unit cylinder (diameter 1, height 1, centred). */
  cylinders: InstanceBatch;
  people: PersonSpot[];
  random: () => number;
  surface: THREE.MeshStandardMaterial;
}
