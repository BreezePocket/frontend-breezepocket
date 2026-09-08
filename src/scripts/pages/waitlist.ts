import { revealHeader } from '@/scripts/header';
import { initStickyStack } from '@/scripts/sticky-stack';
import { initSubHeroScrollHide } from '@/scripts/sub-hero';
import { onceInView, qsa, show } from '@/scripts/utils';
import { initApplyModal } from './waitlist/modal';

/** Waitlist page: hero reveal, stacked sections, and the waitlist modal. */
export function init() {
  revealHeader(0);
  show('.sub-hero', 100);
  qsa('.apply-section').forEach((section) => onceInView(section, () => section.classList.add('show')));

  initSubHeroScrollHide();
  initStickyStack('.apply-sections', {
    rowSelector: '.apply-section',
    cardSelector: '.apply-section__content',
    overlaySelector: '.apply-section__overlay',
  });
  initApplyModal();
}
