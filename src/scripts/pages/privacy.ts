import { revealHeader } from '../header';
import { scrollTo } from '../lenis';
import { initSubHeroScrollHide } from '../sub-hero';
import { prefersReducedMotion, qsa, show } from '../utils';

/**
 * Privacy Policy + Terms of Service: entrance reveal, sub-hero scroll hide and the
 * sticky section nav (click → smooth scroll, IntersectionObserver scroll-spy).
 */
const NAV_OFFSET = -96;

function initSectionNav() {
  const items = qsa<HTMLAnchorElement>('.privacy-nav__item');
  const sections = qsa<HTMLElement>('.privacy-section');
  if (!items.length || !sections.length) return;

  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.dataset.target;
      const section = target ? document.getElementById(target) : null;
      if (section) scrollTo(section, { offset: NAV_OFFSET, immediate: prefersReducedMotion() });
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        items.forEach((item) => item.classList.toggle('is-active', item.dataset.target === id));
      });
    },
    { rootMargin: '-20% 0px -70% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
}

export function init() {
  revealHeader(0);
  show('.sub-hero, .privacy-layout', 100);
  initSubHeroScrollHide();
  initSectionNav();
}
