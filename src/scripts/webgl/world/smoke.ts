import * as THREE from 'three';

/** Soft white disc (radial gradient) used for smoke puffs and district highlight spots. */
export function createRadialTexture(size = 64): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

interface Puff {
  sprite: THREE.Sprite;
  material: THREE.SpriteMaterial;
  origin: THREE.Vector3;
  /** 0..1 through the puff's life. */
  t: number;
  life: number;
  size: number;
  sway: number;
  drift: number;
}

const RISE = 30;

/** Sprite puffs that rise, drift and dissolve from each emitter; the pool is recycled forever. */
export class Smoke {
  readonly group = new THREE.Group();
  private readonly puffs: Puff[] = [];
  private readonly random: () => number;

  constructor(texture: THREE.Texture, emitters: THREE.Vector3[], random: () => number, perEmitter = 9) {
    this.random = random;
    this.group.name = 'smoke';
    for (const origin of emitters) {
      for (let i = 0; i < perEmitter; i++) {
        const material = new THREE.SpriteMaterial({
          map: texture,
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(material);
        const puff: Puff = {
          sprite,
          material,
          origin,
          t: i / perEmitter,
          life: 0,
          size: 0,
          sway: 0,
          drift: 0,
        };
        this.reseed(puff, random);
        this.puffs.push(puff);
        this.group.add(sprite);
      }
    }
    this.update(0);
  }

  private reseed(puff: Puff, random: () => number): void {
    puff.life = 5 + random() * 3;
    puff.size = 6 + random() * 4;
    puff.sway = random() * Math.PI * 2;
    puff.drift = 0.6 + random() * 0.6;
  }

  update(dt: number): void {
    const puffs = this.puffs;
    for (let i = 0; i < puffs.length; i++) {
      const puff = puffs[i];
      puff.t += dt / puff.life;
      if (puff.t >= 1) {
        puff.t -= 1;
        this.reseed(puff, this.random);
      }
      const t = puff.t;
      const x = puff.origin.x + t * t * 9 * puff.drift + Math.sin(t * 4 + puff.sway) * 1.2;
      const z = puff.origin.z + t * 4 * puff.drift;
      puff.sprite.position.set(x, puff.origin.y + t * RISE, z);
      const scale = puff.size * (0.5 + t * 1.4);
      puff.sprite.scale.set(scale, scale, 1);
      puff.material.opacity = Math.sin(Math.PI * t) * 0.5 * (1 - t * 0.35);
    }
  }

  dispose(): void {
    for (const puff of this.puffs) puff.material.dispose();
  }
}
