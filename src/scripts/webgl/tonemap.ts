/**
 * CPU copy of three's ACESFilmic tone mapper (tonemapping_pars_fragment.glsl) and a numeric
 * inverse. Used once at start-up so the fog colour, after tone mapping, lands exactly on the
 * page background and the horizon dissolves into the page.
 */
export type Vec3 = [number, number, number];

// Row-major copies of the shader's ACESInputMat / ACESOutputMat.
const INPUT = [0.59719, 0.35458, 0.04823, 0.076, 0.90834, 0.01566, 0.0284, 0.13383, 0.83777];
const OUTPUT = [1.60475, -0.53108, -0.07367, -0.10208, 1.10813, -0.00605, -0.00327, -0.07276, 1.07602];

const mul = (m: readonly number[], v: Vec3): Vec3 => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];

const fit = (x: number): number => (x * (x + 0.0245786) - 0.000090537) / (x * (0.983729 * x + 0.432951) + 0.238081);
const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));

/** Linear-light colour → tone-mapped linear colour (before the sRGB transfer). */
export function acesFilmic(color: Vec3, exposure = 1): Vec3 {
  const k = exposure / 0.6;
  const a = mul(INPUT, [color[0] * k, color[1] * k, color[2] * k]);
  const b = mul(OUTPUT, [fit(a[0]), fit(a[1]), fit(a[2])]);
  return [clamp01(b[0]), clamp01(b[1]), clamp01(b[2])];
}

/** Finds the linear colour that tone-maps to `target` (fixed-point iteration; converges in a few steps). */
export function acesInverse(target: Vec3, exposure = 1): Vec3 {
  const x: Vec3 = [target[0], target[1], target[2]];
  for (let i = 0; i < 64; i++) {
    const y = acesFilmic(x, exposure);
    let done = true;
    for (let c = 0; c < 3; c++) {
      const err = target[c] - y[c];
      if (Math.abs(err) > 1e-5) done = false;
      x[c] = Math.max(0, x[c] + err);
    }
    if (done) break;
  }
  return x;
}
