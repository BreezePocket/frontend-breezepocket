import gsap from 'gsap';
import { clamp, qs, qsa } from '@/scripts/utils';

/**
 * Features grid (port of `Ui` in the original bundle). On wide screens the section is a
 * 400vh sticky block: each feature fades/slides in over an overlapping window of the
 * section's scroll progress. Below 1201px the items are simply left visible.
 */
export function initFeatures(): () => void {
  const section = qs('.features');
  const items = section ? qsa('.feature-item__content', section) : [];
  if (!section || !items.length) return () => {};

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1201px)', () => {
    gsap.set(items, { opacity: 0, y: 80 });
    const tweens = items.map((el) => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', paused: true }));
    const window_ = 1 / items.length;
    const overlap = window_ * 0.3;

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const rect = section.getBoundingClientRect();
      // Skip the tween updates while the section is entirely off-screen.
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const travel = section.offsetHeight - window.innerHeight;
      const progress = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 1;
      tweens.forEach((tween, i) => {
        const start = i * window_ - (i > 0 ? overlap : 0);
        const end = start + window_ + overlap;
        tween.progress(clamp((progress - start) / (end - start), 0, 1));
      });
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      tweens.forEach((tween) => tween.kill());
      gsap.set(items, { clearProps: 'opacity,y' });
    };
  });

  return () => mm.revert();
}
