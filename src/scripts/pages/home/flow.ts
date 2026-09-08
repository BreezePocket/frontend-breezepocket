import { scrollTo } from '@/scripts/lenis';
import { clamp, qs, qsa } from '@/scripts/utils';
import { getViewport, measureViewport, resetViewport } from './viewport';

/**
 * Scroll-driven "flow" steps (port of `Gi` in the original bundle).
 * Progress through the tall `.flow` section selects the active step, fills each step's
 * track bar and feeds the WebGL camera progress/section back through the callbacks.
 */
const T1 = 0.191;
const T2 = 0.697;
const T3 = 0.876;
const SECTION_STARTS = [0, T1, T2, T3] as const;
const CLICK_OFFSETS = [0.11, 0.01, 0.1, 0.13] as const;
const TRACK_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0, T1],
  [T1, T2],
  [T2, T3],
  [T3, 1],
];
/** The camera range extends past the flow section by 400/356 of its scroll range. */
const CAMERA_EXTENT = 400 / 356;

export interface FlowCallbacks {
  onProgress?: (progress: number) => void;
  onSection?: (index: number) => void;
}

export function initFlow(callbacks: FlowCallbacks = {}): () => void {
  const flow = qs('.flow');
  const wrapper = flow ? qs('.flow__wrapper', flow) : null;
  if (!flow || !wrapper) return () => {};
  const steps = qsa('.flow__step', flow);
  const fills = steps.map((step) => qs('.flow__track-fill', step));

  let ticking = false;
  let lastProgress: number | null = null;
  let lastSection: number | null = null;

  // Click override: the clicked step stays active until the smooth scroll lands there
  // (or the user scrolls away from the target).
  let clickIndex: number | null = null;
  let clickTarget: number | null = null;
  let clickLastY: number | null = null;
  const clearClick = () => {
    clickIndex = null;
    clickTarget = null;
    clickLastY = null;
  };

  const scrollRange = () => Math.max(flow.offsetHeight - wrapper.offsetHeight, 1);

  const onHeaderClick = (event: Event) => {
    const step = (event.currentTarget as HTMLElement).closest<HTMLElement>('.flow__step');
    if (!step || step.classList.contains('flow__step--active')) return;
    const index = step.dataset.step ? parseInt(step.dataset.step, 10) - 1 : -1;
    if (index < 0 || index >= SECTION_STARTS.length) return;
    const range = scrollRange();
    const target = measureViewport() * 0.4 + (SECTION_STARTS[index] + CLICK_OFFSETS[index]) * range;
    clickIndex = index;
    clickTarget = target;
    clickLastY = window.scrollY;
    scrollTo(target, { duration: 1.2 });
  };

  const onHeaderKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onHeaderClick(event);
  };

  const headers = steps.map((step) => qs('.flow__header', step));
  headers.forEach((header) => {
    header?.addEventListener('click', onHeaderClick);
    header?.addEventListener('keydown', onHeaderKeydown);
  });

  function frame() {
    ticking = false;
    const range = scrollRange();
    const start = getViewport() * 0.4;
    const y = window.scrollY;
    const progress = clamp((y - start) / range, 0, 1);

    // Camera progress (only forwarded when it actually changed).
    const cameraRange = Math.max(start + range * CAMERA_EXTENT, 1);
    const camera = clamp(y / cameraRange, 0, 1);
    if (lastProgress === null || Math.abs(lastProgress - camera) >= 1e-4) {
      lastProgress = camera;
      callbacks.onProgress?.(camera);
    }

    if (clickIndex !== null && clickTarget !== null) {
      const distance = Math.abs(y - clickTarget);
      if (distance < 8) clearClick();
      else if (clickLastY !== null) {
        const previous = Math.abs(clickLastY - clickTarget);
        if (distance > previous + 20) clearClick();
        else clickLastY = y;
      }
    }

    let active: number;
    if (clickIndex !== null) active = clickIndex;
    else if (progress < T1) active = 0;
    else if (progress < T2) active = 1;
    else if (progress < T3) active = 2;
    else active = 3;

    steps.forEach((step, i) => {
      const wasActive = step.classList.contains('flow__step--active');
      const isActive = i === active;
      step.classList.toggle('flow__step--active', isActive);
      if (clickIndex === null && wasActive && !isActive) step.classList.add('flow__step--visited');

      const fill = fills[i];
      if (!fill) return;
      const [from, to] = TRACK_RANGES[i];
      let amount = 0;
      if (progress >= to) amount = 1;
      else if (progress > from) amount = (progress - from) / (to - from);
      fill.style.transform = `scaleY(${amount})`;
    });

    if (active !== lastSection) {
      lastSection = active;
      callbacks.onSection?.(active);
    }
  }

  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  };
  const onScroll = () => request();
  const onResize = () => {
    measureViewport();
    request();
  };
  const onOrientation = () => {
    resetViewport();
    request();
  };

  measureViewport();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onOrientation);
  frame();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onOrientation);
    headers.forEach((header) => {
      header?.removeEventListener('click', onHeaderClick);
      header?.removeEventListener('keydown', onHeaderKeydown);
    });
    clearClick();
  };
}
