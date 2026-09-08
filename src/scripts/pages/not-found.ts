import { revealHeader } from '../header';

/** 404 page: the mission bridge is rendered with `.show` already, so only the header needs revealing. */
export function init() {
  revealHeader(0);
}
