/** Small DOM/maths helpers shared by page modules. */

export const qs = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
export const qsa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/** Add the `.show` class to every match after `delay` ms. Returns a cancel function. */
export function show(selector: string, delay = 0): () => void {
  const id = window.setTimeout(() => {
    qsa(selector).forEach((el) => el.classList.add('show'));
  }, delay);
  return () => window.clearTimeout(id);
}

/** Run `cb` once when `el` enters the viewport. */
export function onceInView(el: Element, cb: () => void, options: IntersectionObserverInit = { threshold: 0.15 }): () => void {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      cb();
      io.disconnect();
    }
  }, options);
  io.observe(el);
  return () => io.disconnect();
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Map `v` from [inMin, inMax] to [outMin, outMax], clamped. */
export const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  lerp(outMin, outMax, clamp((v - inMin) / (inMax - inMin || 1), 0, 1));

export const isMobileViewport = () => window.innerWidth <= 820;
export const isTouch = () => window.matchMedia('(pointer: coarse)').matches;
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Animate an accordion body with the max-height technique used across the site. */
export function expand(content: HTMLElement) {
  content.style.maxHeight = '0px';
  void content.offsetHeight;
  content.style.maxHeight = `${content.scrollHeight}px`;
}
export function collapse(content: HTMLElement) {
  content.style.maxHeight = `${content.scrollHeight}px`;
  void content.offsetHeight;
  content.style.maxHeight = '0px';
}
