import gsap from 'gsap';
import { qs } from '@/scripts/utils';

/**
 * Hero title/subtitle: after the CSS `.show` entrance, both fold away in 3D as the user
 * scrolls the first 40% of the viewport (port of `ji` in the original bundle).
 * `.hide` on the hero drops the scroll hint.
 */
const VISIBLE = { opacity: 1, xPercent: 0, x: 0, y: 0, rotateY: 0, rotateX: 0, transformPerspective: 1000 };
const HIDDEN = {
  opacity: 0,
  xPercent: -50,
  x: 222.2,
  y: -120,
  rotateY: -60,
  rotateX: -35,
  transformPerspective: 1000,
  ease: 'sine.in',
  immediateRender: false,
};

const tabletBreakpoint = (): number =>
  parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bp-tablet'), 10) || 820;

export function initHero(): () => void {
  const hero = qs('.hero');
  const title = hero ? qs('.hero__title', hero) : null;
  const subtitle = hero ? qs('.hero__subtitle', hero) : null;
  if (!hero || !title || !subtitle) return () => {};

  const tl = gsap.timeline({ paused: true });
  tl.fromTo(title, { ...VISIBLE }, { ...HIDDEN, duration: 0.7 }, 0);
  tl.fromTo(subtitle, { ...VISIBLE }, { ...HIDDEN, y: -200, duration: 0.7 }, 0.15);

  let ticking = false;
  let transitionDisabled = false;
  let vh = window.innerHeight;
  const tabletQuery = window.matchMedia(`(max-width: ${tabletBreakpoint()}px)`);

  const update = () => {
    ticking = false;
    if (!hero.classList.contains('show')) return;
    if (!transitionDisabled) {
      title.style.transition = 'none';
      subtitle.style.transition = 'none';
      transitionDisabled = true;
    }
    const end = vh * 0.4;
    const y = window.scrollY;
    const progress = y <= 0 ? 0 : y >= end ? 1 : y / end;
    tl.progress(progress);
    const hide = tabletQuery.matches ? y > 0 : progress > 0.15;
    hero.classList.toggle('hide', hide);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  const onOrientation = () => {
    vh = window.innerHeight;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('orientationchange', onOrientation);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('orientationchange', onOrientation);
    tl.kill();
  };
}
