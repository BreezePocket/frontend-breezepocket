import { collapse, expand, qs, qsa } from '@/scripts/utils';

/** FAQ accordion: one item open at a time, max-height animated, first item open by default. */
const OPEN = 'faq-item--open';

function setOpen(item: HTMLElement, open: boolean) {
  const content = qs('.faq-item__content', item);
  const header = qs('.faq-item__header', item);
  if (!content) return;
  item.classList.toggle(OPEN, open);
  header?.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) expand(content);
  else collapse(content);
}

export function initFaq(): () => void {
  const items = qsa('.faq-item');
  if (!items.length) return () => {};

  // Items marked open in the markup get their measured max-height without animating.
  items.forEach((item) => {
    const content = qs('.faq-item__content', item);
    if (content && item.classList.contains(OPEN)) content.style.maxHeight = `${content.scrollHeight}px`;
  });

  const handlers = items.map((item) => {
    const header = qs<HTMLButtonElement>('.faq-item__header', item);
    const handler = () => {
      const isOpen = item.classList.contains(OPEN);
      items.forEach((other) => other !== item && other.classList.contains(OPEN) && setOpen(other, false));
      setOpen(item, !isOpen);
    };
    header?.addEventListener('click', handler);
    return { header, handler };
  });

  const onResize = () => {
    items.forEach((item) => {
      const content = qs('.faq-item__content', item);
      if (content && item.classList.contains(OPEN)) content.style.maxHeight = `${content.scrollHeight}px`;
    });
  };
  window.addEventListener('resize', onResize);
  // Re-measure the open item once web fonts swap in (line wrapping may change).
  document.fonts?.ready.then(onResize).catch(() => {});

  return () => {
    window.removeEventListener('resize', onResize);
    handlers.forEach(({ header, handler }) => header?.removeEventListener('click', handler));
  };
}
