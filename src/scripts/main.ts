import { initLenis, scrollTo } from './lenis';
import { initHeader, revealHeader } from './header';
import { initTransitions } from './transitions';
import { initFooter } from './footer';
import { qs } from './utils';

/**
 * Entry point loaded on every page. Boots the shared behaviours, then lazy-loads the
 * module for the current page (selected by `data-page` on <body>).
 */
type PageModule = { init: () => void | Promise<void> };
const pages: Record<string, () => Promise<PageModule>> = {
  home: () => import('./pages/home'),
  strategies: () => import('./pages/strategies'),
  mission: () => import('./pages/mission'),
  waitlist: () => import('./pages/waitlist'),
  'early-access': () => import('./pages/early-access'),
  privacy: () => import('./pages/privacy'),
  terms: () => import('./pages/privacy'),
  'privacy-request': () => import('./pages/privacy-request'),
  'not-found': () => import('./pages/not-found'),
};

function removePreloadClass() {
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('preload')));
}

function initScrollDownButtons() {
  qs('.js-scroll-down')?.addEventListener('click', () => {
    const hero = qs('.sub-hero');
    const next = hero?.nextElementSibling as HTMLElement | null;
    if (next) scrollTo(next, { offset: -24 });
  });
}

function boot() {
  removePreloadClass();
  initLenis();
  initHeader();
  initTransitions();
  initFooter();
  initScrollDownButtons();

  const page = document.body.dataset.page ?? '';
  const load = pages[page];
  if (!load) {
    revealHeader(100);
    return;
  }
  load()
    .then((m) => m.init())
    .catch((err) => {
      console.error(`[main] failed to boot page module "${page}"`, err);
      revealHeader(100);
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
