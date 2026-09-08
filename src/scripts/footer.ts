import { qs } from './utils';

/** Reveals the big footer wordmark when the footer scrolls into view. */
export function initFooter() {
  const bottom = qs('.footer__bottom');
  if (!bottom) return;
  new IntersectionObserver(
    ([entry]) => bottom.classList.toggle('is-visible', entry.isIntersecting),
    { threshold: 0.2 },
  ).observe(bottom);
}
