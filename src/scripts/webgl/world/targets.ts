import * as THREE from 'three';
import { AREAS, GRID_CENTRE, GRID_SIZE, PALETTE, STOREY } from '../constants';
import type { BuildContext, WorldState } from './types';

/**
 * Sections B and C — price-target charts. A row of bars traces a price series; a glowing
 * target line sits above it (sell target) or below it (buy target) with a fill marker
 * where the price would meet it. The buy chart also carries a stablecoin "cash" pad.
 */
export interface TargetHandle {
  update(dt: number, state: WorldState): void;
}

interface ChartOptions {
  centre: THREE.Vector3;
  rising: boolean;
  accent: number;
  bars: number;
  /** Height of the target line in world units. */
  target: number;
  /** Which section index (0..3) pulses this chart's target line. */
  section: number;
}

const BAR_STEP = 6.2;
const BAR_W = 4.4;

function buildChart(ctx: BuildContext, o: ChartOptions): TargetHandle {
  const { boxes, cylinders, group, random } = ctx;
  const c = o.centre;
  const width = o.bars * BAR_STEP;
  boxes.add({ x: c.x, z: c.z, w: width + 40, h: 0.2, d: 70, color: PALETTE.pad });

  // Bars: a smooth trend plus a little noise so the series reads like a chart.
  const x0 = c.x - width / 2 + BAR_STEP / 2;
  let lastTop = 0;
  for (let i = 0; i < o.bars; i++) {
    const t = i / (o.bars - 1);
    const trend = o.rising ? 0.18 + 0.72 * t * t : 0.9 - 0.68 * Math.sqrt(t);
    const wave = 0.06 * Math.sin(t * 9 + (o.rising ? 0 : 1.7));
    const h = Math.max(STOREY, (trend + wave + (random() - 0.5) * 0.05) * o.target * 1.02);
    const near = Math.abs(h - o.target) < STOREY;
    boxes.add({ x: x0 + i * BAR_STEP, z: c.z, w: BAR_W, h, d: BAR_W, color: near ? o.accent : PALETTE.building });
    boxes.add({ x: x0 + i * BAR_STEP, y: h, z: c.z, w: BAR_W, h: 0.5, d: BAR_W, color: PALETTE.coinCyan });
    lastTop = h;
  }

  // Dashed target line (static) + a glowing core that pulses (animated, emissive for bloom).
  const dashes = Math.floor((width + 24) / 4);
  for (let i = 0; i < dashes; i++) {
    boxes.add({ x: c.x - (width + 24) / 2 + i * 4 + 1.2, y: o.target - 0.3, z: c.z + 5, w: 2.4, h: 0.6, d: 0.6, color: o.accent });
  }
  const glowMaterial = new THREE.MeshStandardMaterial({ color: o.accent, emissive: o.accent, emissiveIntensity: 1.2, roughness: 0.4 });
  const glow = new THREE.Mesh(new THREE.BoxGeometry(width + 26, 0.35, 0.35), glowMaterial);
  glow.position.set(c.x, o.target, c.z + 5);
  glow.name = 'target-line';
  group.add(glow);

  // Fill marker: a coin-coloured sphere where the price would meet the target.
  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 16, 12),
    new THREE.MeshStandardMaterial({ color: PALETTE.coinCyan, emissive: PALETTE.pulse, emissiveIntensity: 0.9, roughness: 0.3 }),
  );
  marker.position.set(x0 + o.bars * BAR_STEP + 2, o.target, c.z + 5);
  marker.castShadow = true;
  marker.name = 'fill-marker';
  group.add(marker);
  const baseY = marker.position.y;
  void lastTop;

  // Small stablecoin pad (green-cyan discs) beside the chart.
  const padX = c.x + width / 2 + 26;
  boxes.add({ x: padX, z: c.z - 18, w: 22, h: 0.3, d: 22, color: PALETTE.plaza });
  for (let s = 0; s < 4; s++) {
    const n = 2 + ((s * 3) % 4);
    for (let i = 0; i < n; i++) {
      cylinders.add({ x: padX - 6 + (s % 2) * 12, y: i * STOREY * 0.6, z: c.z - 24 + Math.floor(s / 2) * 12, w: 7, h: STOREY * 0.5, d: 7, color: i === n - 1 ? PALETTE.stable : PALETTE.coin });
    }
  }

  let phase = random() * Math.PI * 2;
  return {
    update(dt, state) {
      phase += dt * 2.2;
      const active = state.section === o.section ? 1 : 0.35;
      glowMaterial.emissiveIntensity = (1.1 + 0.9 * (0.5 + 0.5 * Math.sin(phase))) * active;
      marker.position.y = baseY + Math.sin(phase * 0.7) * 0.6;
    },
  };
}

export function buildSellTarget(ctx: BuildContext): TargetHandle {
  return buildChart(ctx, { centre: AREAS.sell, rising: true, accent: PALETTE.sell, bars: 16, target: STOREY * 9, section: 1 });
}

export function buildBuyTarget(ctx: BuildContext): TargetHandle {
  const handle = buildChart(ctx, { centre: AREAS.buy, rising: false, accent: PALETTE.buy, bars: 14, target: STOREY * 2.5, section: 2 });
  // Price grid pad (the reveal target of TIMING.grid) with a small terminal block on it.
  const { boxes } = ctx;
  const g = GRID_CENTRE;
  boxes.add({ x: g.x, z: g.z, w: GRID_SIZE + 4, h: 0.2, d: GRID_SIZE + 4, color: PALETTE.pad });
  boxes.add({ x: g.x - 6, z: g.z + 5, w: 8, h: 5, d: 6 });
  boxes.add({ x: g.x - 6, y: 5, z: g.z + 5, w: 2, h: 1, d: 2, color: PALETTE.coinBlue });
  for (let i = 0; i < 4; i++) boxes.add({ x: g.x + 3 + i * 3, z: g.z - 5, w: 2.2, h: 3, d: 2, color: PALETTE.main });
  return handle;
}
