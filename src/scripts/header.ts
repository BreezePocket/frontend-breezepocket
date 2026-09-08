import { lockScroll, unlockScroll } from './lenis';
import { qs, qsa } from './utils';

/** Header entrance + the mobile navigation drawer. */
const CLOSE_MS = 450;
let isOpen = false;
let closeTimer: number | null = null;

export function revealHeader(delay = 0) {
  window.setTimeout(() => qs('header')?.classList.add('show'), delay);
}

export function initHeader() {
  const header = qs('header');
  const btn = qs<HTMLButtonElement>('.menu-btn', header ?? document);
  const nav = qs('.mobile-nav');
  const overlay = qs('.mobile-nav__overlay');
  const closeBtn = qs('.mobile-nav__close');
  if (!header || !btn || !nav) return;

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    if (closeTimer) window.clearTimeout(closeTimer);
    nav.classList.remove('is-closing');
    nav.classList.add('is-open');
    overlay?.classList.add('show');
    header.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
    lockScroll();
    document.body.style.touchAction = 'none';
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    nav.classList.add('is-closing');
    nav.classList.remove('is-open');
    overlay?.classList.remove('show');
    header.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.touchAction = '';
    unlockScroll();
    closeTimer = window.setTimeout(() => nav.classList.remove('is-closing'), CLOSE_MS);
  };

  btn.addEventListener('click', () => (isOpen ? close() : open()));
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  qsa('a', nav).forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
  window.addEventListener('resize', () => window.innerWidth > 820 && close());
}
