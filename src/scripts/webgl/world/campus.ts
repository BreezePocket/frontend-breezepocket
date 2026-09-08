import * as THREE from 'three';
import { AREAS, PALETTE } from '../constants';
import type { BuildContext } from './types';

/** Section D — data-centre campus: long halls with roof units, office, parking grid, plaza + emblem. */
const PLAZA = { dx: -40, dz: -6, size: 26 };

/** Cross with an arrow head on the far arm, extruded flat. Points along -Z (away from the camera). */
function emblemGeometry(): THREE.ExtrudeGeometry {
  const w = 1.5;
  const L = 7.5;
  const shape = new THREE.Shape();
  shape.moveTo(w, w);
  shape.lineTo(L, w);
  shape.lineTo(L, -w);
  shape.lineTo(w, -w);
  shape.lineTo(w, -L);
  shape.lineTo(-w, -L);
  shape.lineTo(-w, -w);
  shape.lineTo(-L, -w);
  shape.lineTo(-L, w);
  shape.lineTo(-w, w);
  shape.lineTo(-w, L - 3);
  shape.lineTo(-3.6, L - 3);
  shape.lineTo(0, L + 2.5);
  shape.lineTo(3.6, L - 3);
  shape.lineTo(w, L - 3);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.7, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

export interface CampusResult {
  emblem: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshStandardMaterial>;
}

export function buildCampus(ctx: BuildContext): CampusResult {
  const { boxes, cylinders, group, random, people } = ctx;
  const c = AREAS.campus;
  const at = (dx: number, dz: number) => ({ x: c.x + dx, z: c.z + dz });

  boxes.add({ ...at(4, -8), w: 116, h: 0.2, d: 84, color: PALETTE.pad });

  // Three long halls with two rows of roof units each.
  for (const dz of [-34, -10, 14]) {
    boxes.add({ ...at(4, dz), w: 52, h: 9, d: 20 });
    for (let i = 0; i < 6; i++) {
      for (const rz of [-5, 5]) boxes.add({ ...at(-17 + i * 8.4, dz + rz), y: 9, w: 3, h: 1.8, d: 3 });
    }
  }
  boxes.add({ ...at(44, -34), w: 22, h: 9, d: 20 });
  for (let i = 0; i < 3; i++) boxes.add({ ...at(37 + i * 7, -34), y: 9, w: 3, h: 1.8, d: 3 });

  // Office block with a stepped top.
  boxes.add({ ...at(44, -6), w: 20, h: 14, d: 14 });
  boxes.add({ ...at(42, -8), y: 14, w: 12, h: 4, d: 8 });
  for (let i = 0; i < 5; i++) boxes.add({ ...at(37 + i * 3.5, 1.12), w: 0.36, h: 14, d: 0.3 });

  // Parking grid.
  boxes.add({ ...at(44, 18), w: 30, h: 0.3, d: 22, color: PALETTE.plaza });
  const carColors = [PALETTE.building, PALETTE.main, PALETTE.pad];
  let k = 0;
  for (let r = 0; r < 4; r++) {
    for (let col = 0; col < 5; col++) {
      if (random() < 0.25) continue;
      boxes.add({
        ...at(44 + (col - 2) * 5.4, 18 + (r - 1.5) * 5.6),
        y: 0.3,
        w: 2,
        h: 1.2,
        d: 4.2,
        color: carColors[k++ % carColors.length],
      });
    }
  }

  // Chillers behind the first hall.
  for (let i = 0; i < 4; i++) cylinders.add({ ...at(-14 + i * 8, -47), w: 4.8, h: 4, d: 4.8 });

  // Plaza with the accent emblem (fades in with logoRatio) and lamp posts.
  boxes.add({ ...at(PLAZA.dx, PLAZA.dz), w: PLAZA.size, h: 0.35, d: PLAZA.size, color: PALETTE.plaza });
  const emblemMaterial = new THREE.MeshStandardMaterial({
    color: PALETTE.primary,
    emissive: PALETTE.primary,
    emissiveIntensity: 0.35,
    roughness: 0.5,
    transparent: true,
    opacity: 0,
  });
  const emblem = new THREE.Mesh(emblemGeometry(), emblemMaterial);
  emblem.position.set(c.x + PLAZA.dx, 0.36, c.z + PLAZA.dz);
  emblem.visible = false;
  emblem.name = 'emblem';
  group.add(emblem);

  for (const [px, pz] of [
    [-52, -18],
    [-28, -18],
    [-52, 6],
    [-28, 6],
  ]) {
    boxes.add({ ...at(px, pz), y: 0.35, w: 0.25, h: 5.5, d: 0.25 });
    boxes.add({ ...at(px, pz), y: 5.85, w: 0.9, h: 0.4, d: 0.9 });
  }

  for (let i = 0; i < 8; i++) {
    const angle = random() * Math.PI * 2;
    const radius = 10.5 + random() * 2;
    people.push({
      x: c.x + PLAZA.dx + Math.cos(angle) * radius,
      y: 0.35,
      z: c.z + PLAZA.dz + Math.sin(angle) * radius,
      rot: random() * Math.PI * 2,
    });
  }

  return { emblem };
}
