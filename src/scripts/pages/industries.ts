import { revealHeader } from '../header';
import { onScroll, scrollTo } from '../lenis';
import { initStickyStack } from '../sticky-stack';
import { initSubHeroScrollHide } from '../sub-hero';
import { prefersReducedMotion, qs, qsa, show } from '../utils';

/**
 * Industries page: hero reveal, sticky stacked industry rows, and the per-row industry nav
 * (smooth-scroll on click, scroll-spy `is-active` while scrolling).
 */
const REVEAL_DELAY = 100;
/** Fraction of the viewport height at which a row counts as the active (pinned) one. */
const SPY_LINE = 0.4;

const cleanups: Array<() => void> = [];

/**
 * Layout top of `el` in document coordinates. Unlike getBoundingClientRect this ignores CSS
 * transforms, so it stays correct while the section's entrance transition is still running.
 */
function layoutTop(el: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/** Document offset at which each wrapper becomes the pinned row (section top + preceding wrappers). */
function rowOffsets(section: HTMLElement, wrappers: HTMLElement[]): number[] {
  let offset = layoutTop(section);
  return wrappers.map((wrapper) => {
    const top = offset;
    offset += wrapper.offsetHeight;
    return top;
  });
}

function initIndustryNav(section: HTMLElement, wrappers: HTMLElement[]) {
  const navItems = qsa<HTMLAnchorElement>('.industry-nav__item', section);
  if (!navItems.length) return null;

  const ids = wrappers.map((wrapper) => wrapper.querySelector<HTMLElement>('.industry-row')?.id ?? '');
  let activeId: string | null = null;
  const setActive = (id: string) => {
    if (!id || id === activeId) return;
    activeId = id;
    navItems.forEach((item) => item.classList.toggle('is-active', item.dataset.target === id));
  };

  /**
   * Scroll-spy. Pinned wrappers overlap (they all sit at top: 0 once pinned), so the active row is
   * the LAST wrapper whose pin offset has crossed the spy line, not the first one covering it.
   * Above the section nothing is chosen (the server-rendered default stays); past it the last row wins.
   */
  const syncActive = (scrollY = window.scrollY) => {
    const line = scrollY + window.innerHeight * SPY_LINE;
    const offsets = rowOffsets(section, wrappers);
    let index = -1;
    offsets.forEach((offset, k) => {
      if (offset <= line) index = k;
    });
    if (index >= 0) setActive(ids[index]);
  };

  const scrollToRow = (id: string, duration = 2) => {
    const index = ids.indexOf(id);
    if (index === -1) return;
    const top = rowOffsets(section, wrappers)[index];
    scrollTo(top, { duration, immediate: prefersReducedMotion() });
  };

  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    const target = (event.currentTarget as HTMLAnchorElement).dataset.target;
    if (target) scrollToRow(target);
  };
  navItems.forEach((item) => item.addEventListener('click', onClick));

  const onResize = () => syncActive();
  const unsubscribe = onScroll(({ scroll }) => syncActive(scroll));
  window.addEventListener('resize', onResize, { passive: true });

  const destroy = () => {
    unsubscribe();
    window.removeEventListener('resize', onResize);
    navItems.forEach((item) => item.removeEventListener('click', onClick));
  };

  return { scrollToRow, syncActive, destroy };
}

/** Tear down listeners and scroll triggers (for a future client-side router; unused on full navigations). */
export function destroy() {
  cleanups.splice(0).forEach((fn) => fn());
}

export function init() {
  revealHeader(0);
  cleanups.push(show('.sub-hero, .sub-hero-image, .industries-title, .industry-section', REVEAL_DELAY));
  cleanups.push(initSubHeroScrollHide());
  cleanups.push(initStickyStack('.industry-section'));

  const section = qs('.industry-section');
  if (!section) return;
  const wrappers = qsa('.industry-row-wrapper', section);
  const nav = initIndustryNav(section, wrappers);
  if (!nav) return;
  cleanups.push(nav.destroy);

  const timers: number[] = [];
  cleanups.push(() => timers.forEach((id) => window.clearTimeout(id)));
  timers.push(window.setTimeout(() => nav.syncActive(), REVEAL_DELAY));

  // Deep link (/industries#gas): jump to that row once the hero has revealed. Offsets come from
  // layout (not transformed rects), so this is safe even while the section is still animating in.
  const hash = window.location.hash.replace(/^#/, '');
  if (hash && document.getElementById(hash)?.classList.contains('industry-row')) {
    timers.push(window.setTimeout(() => nav.scrollToRow(hash, 1.2), REVEAL_DELAY + 700));
  }
}
