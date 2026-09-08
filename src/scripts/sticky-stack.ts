import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * "Sticky stack" used on the Industries and Apply pages.
 * Each `.sticky-stack__item` is `position: sticky; top: 0` (CSS). While the next item slides
 * over the current one, the current overlay darkens, and rows taller than the viewport scroll
 * their card content up so nothing is unreachable. Desktop only (>= 821px), matching the CSS.
 * Returns a cleanup function.
 */
export interface StickyStackOptions {
  itemSelector?: string;
  rowSelector?: string;
  cardSelector?: string;
  overlaySelector?: string;
}

export function initStickyStack(containerSelector: string, options: StickyStackOptions = {}): () => void {
  gsap.registerPlugin(ScrollTrigger);
  const {
    itemSelector = '.sticky-stack__item',
    rowSelector = '.industry-row',
    cardSelector = '.industry-row__card',
    overlaySelector = '.industry-row__overlay',
  } = options;
  const container = document.querySelector<HTMLElement>(containerSelector);
  if (!container) return () => {};
  const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
  if (!items.length) return () => {};

  const mm = gsap.matchMedia();
  mm.add('(min-width: 821px)', () => {
    const triggers: ScrollTrigger[] = [];

    const setup = () => {
      triggers.forEach((t) => t.kill());
      triggers.length = 0;
      items.forEach((item, index) => {
        const row = item.querySelector<HTMLElement>(rowSelector);
        const card = item.querySelector<HTMLElement>(cardSelector);
        const overlay = item.querySelector<HTMLElement>(overlaySelector);
        if (!row) return;
        const vh = window.innerHeight;
        const rowHeight = row.offsetHeight;
        const overflow = Math.max(0, rowHeight - vh);
        const isLast = index === items.length - 1;
        item.style.height = isLast ? '' : `${Math.max(vh, rowHeight)}px`;

        if (overflow > 0 && card && !isLast) {
          card.style.willChange = 'transform';
          const tween = gsap.to(card, {
            y: -overflow,
            ease: 'none',
            scrollTrigger: { trigger: item, start: 'top top', end: () => `+=${overflow}`, scrub: true },
          });
          triggers.push(tween.scrollTrigger!);
        }
        if (overlay && !isLast) {
          const next = items[index + 1];
          const tween = gsap.to(overlay, {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true },
          });
          triggers.push(tween.scrollTrigger!);
        }
      });
    };

    setup();
    ScrollTrigger.refresh();
    let timer: number | undefined;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setup();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      triggers.forEach((t) => t.kill());
      items.forEach((item) => {
        item.style.height = '';
        const card = item.querySelector<HTMLElement>(cardSelector);
        if (card) card.style.willChange = '';
      });
    };
  });

  return () => mm.revert();
}
