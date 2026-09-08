import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { revealHeader } from '../header';
import { initSubHeroScrollHide } from '../sub-hero';
import { qs, qsa, show, onceInView, expand, collapse } from '../utils';

/**
 * Our Mission page: hero reveal, in-view reveals for the copy blocks, the accordion drawer
 * and the scroll-triggered "bridge" emblem/title reveal (ported from the original bundle).
 */

// Resting offsets of each cube relative to its final position (matches the loader CSS keyframes).
const CUBE_OFFSETS: Record<string, [number, number]> = {
  cube_01: [0, -20],
  cube_02: [14, -14],
  cube_03: [20, 0],
  cube_04: [14, 14],
  cube_05: [0, 20],
  cube_06: [-14, 14],
  cube_07: [-20, 0],
  cube_08: [-14, -14],
};

const OPEN = 'accordion-drawer-item--open';

/**
 * Reveal the given elements when they enter the viewport, or right away if already visible.
 * A scroll fallback also reveals anything that was jumped past (e.g. an instant programmatic
 * scroll) so no section stays hidden above the fold.
 */
function revealInView(selector: string) {
  const pending = new Set<HTMLElement>();
  const reveal = (el: HTMLElement) => {
    el.classList.add('show');
    pending.delete(el);
  };
  qsa(selector).forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('show');
      return;
    }
    pending.add(el);
    onceInView(el, () => reveal(el), { threshold: 0.15 });
  });
  if (!pending.size) return;
  const onScroll = () => {
    pending.forEach((el) => {
      if (el.getBoundingClientRect().bottom <= 0) reveal(el);
    });
    if (!pending.size) window.removeEventListener('scroll', onScroll);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

function openItem(item: HTMLElement) {
  const content = qs('.accordion-drawer-item__content', item);
  if (!content) return;
  item.classList.add(OPEN);
  qs('.accordion-drawer-item__header', item)?.setAttribute('aria-expanded', 'true');
  expand(content);
}

function closeItem(item: HTMLElement) {
  const content = qs('.accordion-drawer-item__content', item);
  if (!content) return;
  collapse(content);
  item.classList.remove(OPEN);
  qs('.accordion-drawer-item__header', item)?.setAttribute('aria-expanded', 'false');
}

function recomputeOpenItems() {
  qsa(`.${OPEN}`).forEach((item) => {
    const content = qs('.accordion-drawer-item__content', item);
    if (content) content.style.maxHeight = `${content.scrollHeight}px`;
  });
}

function initAccordionDrawer() {
  const headers = qsa<HTMLButtonElement>('.accordion-drawer-item__header');
  if (!headers.length) return;

  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.closest<HTMLElement>('.accordion-drawer-item');
      if (!item) return;
      const isOpen = item.classList.contains(OPEN);
      const drawer = item.closest('.accordion-drawer') ?? document;
      qsa<HTMLElement>(`.${OPEN}`, drawer).forEach((other) => {
        if (other !== item) closeItem(other);
      });
      if (isOpen) closeItem(item);
      else openItem(item);
    });
  });

  recomputeOpenItems();
  window.addEventListener('resize', recomputeOpenItems);
}

function initMissionBridge() {
  const bridge = qs('.mission-bridge');
  if (!bridge) return;

  const logoWrap = qs('.mission-bridge__logo', bridge);
  const logo = logoWrap ? qs<SVGSVGElement>('.loader__logo', logoWrap) : null;
  const title = qs('.mission-bridge__title', bridge);
  const lines = qsa('.mission-bridge__title-line', bridge);
  const text = qs('.mission-bridge__text', bridge);
  const cta = qs('.mission-bridge__cta', bridge);
  const cubes = logoWrap ? qsa<SVGElement>('[id^="cube_"]', logoWrap) : [];
  const maskLines = logoWrap ? qsa<SVGElement>('.arrow-mask-line', logoWrap) : [];

  const mm = gsap.matchMedia();

  mm.add('(min-width: 981px)', () => {
    if (logo) gsap.set(logo, { y: 40, opacity: 0, scale: 0.9, transformOrigin: '50% 50%' });
    cubes.forEach((cube) => {
      const [x, y] = CUBE_OFFSETS[cube.id] ?? [0, 0];
      gsap.set(cube, { opacity: 0, x, y });
    });
    gsap.set(maskLines, { strokeDasharray: 60, strokeDashoffset: 60 });
    gsap.set(lines, { opacity: 0, y: 88, rotationY: 60, rotationX: 35, transformPerspective: 1000 });
    if (text) gsap.set(text, { opacity: 0, y: 30 });
    if (cta) gsap.set(cta, { opacity: 0, y: 20 });

    const trigger = ScrollTrigger.create({
      trigger: bridge,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        bridge.classList.add('show');
        const tl = gsap.timeline();
        if (logo) tl.to(logo, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }, 0);
        if (cubes.length) tl.to(cubes, { opacity: 1, x: 0, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, 0);
        if (maskLines.length) tl.to(maskLines, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, 0.8);
        tl.to(lines, { opacity: 1, y: 0, x: '0%', rotationY: 0, rotationX: 0, duration: 1.5, stagger: 0.12, ease: 'power3.out' }, 0.3);
        if (text) tl.to(text, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.9);
        if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 1.1);
      },
    });

    return () => {
      trigger.kill();
      if (logo) gsap.set(logo, { clearProps: 'all' });
      gsap.set(cubes, { clearProps: 'all' });
      gsap.set(maskLines, { clearProps: 'all' });
      gsap.set(lines, { clearProps: 'opacity,y,x,rotationY,rotationX,transformPerspective' });
      if (text) gsap.set(text, { clearProps: 'all' });
      if (cta) gsap.set(cta, { clearProps: 'all' });
      bridge.classList.remove('show');
    };
  });

  mm.add('(max-width: 980px)', () => {
    if (logo) gsap.set(logo, { opacity: 0, y: 20 });
    if (title) gsap.set(title, { opacity: 0, y: 40 });
    if (text) gsap.set(text, { opacity: 0, y: 20 });
    if (cta) gsap.set(cta, { opacity: 0, y: 20 });

    const trigger = ScrollTrigger.create({
      trigger: bridge,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        bridge.classList.add('show');
        const tl = gsap.timeline();
        if (logo) tl.to(logo, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0);
        if (title) tl.to(title, { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }, 0.2);
        if (text) tl.to(text, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 0.6);
        if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 0.9);
      },
    });

    return () => {
      trigger.kill();
      if (logo) gsap.set(logo, { clearProps: 'all' });
      if (title) gsap.set(title, { clearProps: 'all' });
      if (text) gsap.set(text, { clearProps: 'all' });
      if (cta) gsap.set(cta, { clearProps: 'all' });
      bridge.classList.remove('show');
    };
  });
}

export function init() {
  gsap.registerPlugin(ScrollTrigger);
  revealHeader(0);
  show('.sub-hero, .sub-hero-image', 100);
  revealInView('.sub-section, .accordion-drawer');
  initSubHeroScrollHide();
  initAccordionDrawer();
  initMissionBridge();
  ScrollTrigger.refresh();
}
