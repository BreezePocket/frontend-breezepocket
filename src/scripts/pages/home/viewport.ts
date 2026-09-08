/**
 * Viewport height used by the home scroll maths (port of `Lt()` in the original bundle).
 * On touch devices the browser chrome collapses while scrolling, which changes `innerHeight`;
 * the original keeps the largest value seen so the scroll thresholds don't jump mid-scroll.
 */
let vh = 0;

export const isTouchDevice = (): boolean => {
  const ua = navigator.userAgent;
  const macTouch = /Macintosh/.test(ua) && 'ontouchend' in document;
  return (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) || /android/i.test(ua) || macTouch;
};

/** Refresh and return the tracked viewport height. */
export function measureViewport(): number {
  const h = window.innerHeight;
  vh = isTouchDevice() ? Math.max(vh, h) : h;
  return vh;
}

/** Forget the max-so-far value (orientation change) and re-measure. */
export function resetViewport(): number {
  vh = 0;
  return measureViewport();
}

export const getViewport = () => vh || measureViewport();
