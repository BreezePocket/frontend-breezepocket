import gsap from 'gsap';
import { qs } from './utils';

/**
 * Sub-page hero: after the `.show` entrance, the title folds away in 3D as the user scrolls
 * through the first 40% of the viewport height (scrubbed, not time based).
 * Returns a cleanup function.
 */
const VISIBLE = { opacity: 1, xPercent: 0, x: 0, y: 0, rotateY: 0, rotateX: 0, transformPerspective: 1000 };
const HIDDEN = {
  opacity: 0,
  xPercent: -50,
  x: 222.2,
  y: -88,
  rotateY: -60,
  rotateX: -35,
  transformPerspective: 1000,
  ease: 'sine.in',
  immediateRender: false,
};

export function initSubHeroScrollHide(): () => void {
  const hero = qs('.sub-hero');
  const title = hero ? qs('.sub-hero__title', hero) : null;
  if (!hero || !title) return () => {};

  const tl = gsap.timeline({ paused: true });
  tl.fromTo(title, { ...VISIBLE }, { ...HIDDEN, duration: 0.7 }, 0);

  let ticking = false;
  let transitionDisabled = false;
  const update = () => {
    ticking = false;
    if (!hero.classList.contains('show')) return;
    if (!transitionDisabled) {
      title.style.transition = 'none';
      transitionDisabled = true;
    }
    const range = window.innerHeight * 0.4;
    const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    tl.progress(progress);
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
    tl.kill();
  };
}
