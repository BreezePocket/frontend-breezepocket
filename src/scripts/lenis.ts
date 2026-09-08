import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './utils';

/**
 * Smooth scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync.
 * Falls back to native scrolling when the user prefers reduced motion.
 */
let lenis: Lenis | null = null;
type ScrollListener = (state: { scroll: number; limit: number; velocity: number; progress: number }) => void;
const listeners = new Set<ScrollListener>();

export function initLenis(): Lenis | null {
  gsap.registerPlugin(ScrollTrigger);
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ smoothWheel: true, syncTouch: true });
  lenis.on('scroll', (e: any) => {
    ScrollTrigger.update();
    listeners.forEach((fn) => fn({ scroll: e.scroll, limit: e.limit, velocity: e.velocity, progress: e.progress }));
  });
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

/** Subscribe to scroll updates (Lenis when active, otherwise native `scroll`). Returns an unsubscribe. */
export function onScroll(fn: ScrollListener): () => void {
  if (lenis) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
  const handler = () => {
    const limit = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    fn({ scroll: window.scrollY, limit, velocity: 0, progress: window.scrollY / limit });
  };
  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}

export function lockScroll() {
  document.body.style.overflow = 'hidden';
  lenis?.stop();
}
export function unlockScroll() {
  document.body.style.overflow = '';
  lenis?.start();
}

export function scrollTo(target: number | string | HTMLElement, options: { offset?: number; immediate?: boolean; duration?: number } = {}) {
  if (lenis) {
    lenis.scrollTo(target as any, options);
    return;
  }
  let top = 0;
  if (typeof target === 'number') top = target;
  else {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY;
  }
  window.scrollTo({ top: top + (options.offset ?? 0), behavior: options.immediate ? 'auto' : 'smooth' });
}
