import { revealHeader } from '../header';
import { initSubHeroScrollHide } from '../sub-hero';
import { show } from '../utils';

/** Submit a Privacy Request: header + hero reveal and the sub-hero scroll hide. */
export function init() {
  revealHeader(0);
  show('.sub-hero, .privacy-request__layout', 100);
  initSubHeroScrollHide();
}
