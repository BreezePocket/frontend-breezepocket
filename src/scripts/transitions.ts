import { qs } from './utils';

/**
 * Page transition: a wipe overlay sweeps in on internal navigation, then the browser
 * loads the next page whose own entrance animations complete the effect.
 */
let navigating = false;

const isInternalLink = (a: HTMLAnchorElement, url: URL) =>
  url.origin === location.origin &&
  a.target !== '_blank' &&
  !a.hasAttribute('download') &&
  !(a.getAttribute('rel') || '').includes('external');

export function initTransitions() {
  const overlay = qs('.transition-pages');
  if (!overlay) return;

  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    let url: URL;
    try {
      url = new URL(a.href, location.href);
    } catch {
      return;
    }
    if (!isInternalLink(a, url)) return;
    const samePage = url.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '');
    if (samePage && url.hash) return; // in-page anchor, let page scripts handle it
    if (samePage && !url.hash) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    if (navigating) return;
    navigating = true;

    const toHome = url.pathname === '/' || url.pathname === '';
    overlay.classList.remove('hide');
    overlay.classList.toggle('to-home', toHome);
    void overlay.offsetWidth;
    overlay.classList.add('show');
    const duration = window.innerWidth <= 980 ? 450 : 720;
    window.setTimeout(() => {
      location.href = url.href;
    }, duration + 40);
  });

  // Back/forward cache restores the old DOM with the overlay still shown.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      overlay.classList.remove('show', 'to-home');
      navigating = false;
    }
  });
}
