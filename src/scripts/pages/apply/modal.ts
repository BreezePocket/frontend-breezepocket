import { revealHeader } from '@/scripts/header';
import { lockScroll, unlockScroll } from '@/scripts/lenis';
import { qs, qsa } from '@/scripts/utils';
import { initFileUploads } from './file-upload';
import { type ApplyState, clearState, emptyState, loadState, saveState } from './state';

/**
 * Multi-step application dialog.
 * Steps: details → trades → experience → credentials → review. Progress is kept in
 * sessionStorage until the application is submitted. Body scroll is locked while open,
 * focus is trapped inside the dialog and restored to the opener on close.
 */
const TOTAL_STEPS = 5;
const CLOSE_MS = 300;
const CLOSE_INLINE_EXTRA = 190; // vertical padding around the card + the close button
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENDPOINT = '/api/apply';
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] ?? ch);

export function initApplyModal(): () => void {
  const modal = qs('.apply-modal');
  if (!modal) return () => {};

  const triggers = qsa<HTMLElement>('[data-apply-trigger]');
  const closeButtons = qsa<HTMLButtonElement>('[data-modal-close]', modal);
  const prevButtons = qsa<HTMLButtonElement>('[data-modal-prev]', modal);
  const nextButtons = qsa<HTMLButtonElement>('[data-modal-next]', modal);
  const counters = qsa<HTMLElement>('.modal-nav__counter', modal);
  const stepCards = qsa<HTMLElement>('[data-modal-step]', modal);
  const successCard = qs('[data-modal-success]', modal);
  const submitButton = qs<HTMLButtonElement>('[data-modal-submit]', modal);
  const submitError = qs('[data-modal-error]', modal);
  const container = qs('.apply-modal__container', modal);

  const fullNameInput = qs<HTMLInputElement>('[name="fullName"]', modal);
  const emailInput = qs<HTMLInputElement>('[name="email"]', modal);
  const phoneInput = qs<HTMLInputElement>('[name="phone"]', modal);
  const certificationsInput = qs<HTMLTextAreaElement>('[name="certifications"]', modal);
  const resumeInput = qs<HTMLInputElement>('[name="resume"]', modal);
  const tradeInputs = qsa<HTMLInputElement>('[name="trade"]', modal);
  const experienceInputs = qsa<HTMLInputElement>('[name="experience"]', modal);

  let state: ApplyState = emptyState();
  let currentStep = 1;
  let isOpen = false;
  let isSuccess = false;
  let opener: HTMLElement | null = null;
  let closeTimer: number | null = null;
  let layoutFrame: number | null = null;

  /* ---------- helpers ---------- */

  const stepCard = (n: number) => stepCards.find((card) => Number(card.dataset.modalStep) === n) ?? null;
  const optionLabel = (input: HTMLInputElement) =>
    input.closest('label')?.querySelector<HTMLElement>('.form__checkbox-label, span:last-child')?.textContent?.trim() || input.value;
  const tradeLabels = () => tradeInputs.filter((i) => state.trades.includes(i.value)).map(optionLabel);
  const experienceLabel = () => {
    const input = experienceInputs.find((i) => i.value === state.experience);
    return input ? optionLabel(input) : '';
  };

  /** Read the DOM into `state` (the file is never persisted). */
  const collect = () => {
    state.fullName = fullNameInput?.value ?? '';
    state.email = emailInput?.value ?? '';
    state.phone = phoneInput?.value ?? '';
    state.trades = tradeInputs.filter((i) => i.checked).map((i) => i.value);
    state.experience = experienceInputs.find((i) => i.checked)?.value ?? '';
    state.certifications = certificationsInput?.value ?? '';
    state.currentStep = currentStep;
  };
  const persist = () => {
    collect();
    saveState(state);
  };

  /** Write `state` back into the inputs. */
  const populate = () => {
    if (fullNameInput) fullNameInput.value = state.fullName;
    if (emailInput) emailInput.value = state.email;
    if (phoneInput) phoneInput.value = state.phone;
    if (certificationsInput) certificationsInput.value = state.certifications;
    tradeInputs.forEach((i) => (i.checked = state.trades.includes(i.value)));
    experienceInputs.forEach((i) => (i.checked = i.value === state.experience));
  };

  const resetForm = () => {
    state = emptyState();
    populate();
    if (resumeInput) {
      resumeInput.value = '';
      resumeInput.closest('[data-file-upload]')?.dispatchEvent(new CustomEvent('file-upload:sync'));
    }
    stepCards.forEach((card) => qsa<HTMLElement>('[data-step-error], [data-field-error]', card).forEach((el) => (el.textContent = '')));
    qsa<HTMLElement>('.form__input--error', modal).forEach((el) => el.classList.remove('form__input--error'));
  };

  /* ---------- validation ---------- */

  const setFieldError = (input: HTMLInputElement | null, hasError: boolean) => {
    if (!input) return;
    const slot = input.closest('.form__field')?.querySelector<HTMLElement>('[data-field-error]');
    const message = input.dataset.errorMessage || 'This field is required';
    input.classList.toggle('form__input--error', hasError);
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    if (slot) slot.textContent = hasError ? message : '';
  };
  const setStepError = (n: number, message: string) => {
    const slot = stepCard(n)?.querySelector<HTMLElement>('[data-step-error]');
    if (slot) slot.textContent = message;
  };

  const validateStep = (n: number): boolean => {
    collect();
    if (n === 1) {
      const nameOk = state.fullName.trim().length > 0;
      const emailOk = EMAIL_RE.test(state.email.trim());
      setFieldError(fullNameInput, !nameOk);
      setFieldError(emailInput, !emailOk);
      if (!nameOk || !emailOk) {
        qs<HTMLInputElement>('.form__input--error', modal)?.focus();
        return false;
      }
      return true;
    }
    if (n === 2) {
      const ok = state.trades.length > 0;
      setStepError(2, ok ? '' : 'Please select at least one trade');
      if (!ok) tradeInputs[0]?.focus();
      return ok;
    }
    if (n === 3) {
      const ok = state.experience !== '';
      setStepError(3, ok ? '' : 'Please select your experience level');
      if (!ok) experienceInputs[0]?.focus();
      return ok;
    }
    return true;
  };

  /* ---------- review summary ---------- */

  const renderReview = () => {
    const fill = (section: string, contentSelector: string, html: string) => {
      const item = qs(`[data-review-section="${section}"]`, modal);
      const content = qs(contentSelector, modal);
      if (!item || !content) return;
      content.innerHTML = html;
      item.classList.toggle('review-summary__item--hidden', html === '');
    };
    const contact: string[] = [];
    if (state.fullName) contact.push(`<p>${escapeHtml(state.fullName)}</p>`);
    if (state.email) contact.push(`<p>${escapeHtml(state.email)}</p>`);
    if (state.phone) contact.push(`<p>${escapeHtml(state.phone)}</p>`);
    fill('contact', '[data-review-contact]', contact.join(''));

    const trades = tradeLabels();
    fill('trade', '[data-review-trade]', trades.length ? `<p>${escapeHtml(trades.join(', '))}</p>` : '');

    const experience = experienceLabel();
    fill('experience', '[data-review-experience]', experience ? `<p>${escapeHtml(experience)}</p>` : '');

    const credentials: string[] = [];
    const file = resumeInput?.files?.[0];
    if (file) credentials.push(`<p>${escapeHtml(file.name)}</p>`);
    if (state.certifications.trim()) credentials.push(`<p>${escapeHtml(state.certifications.trim())}</p>`);
    fill('credentials', '[data-review-credentials]', credentials.join(''));
  };

  /* ---------- layout ---------- */

  const updateCloseInline = () => {
    const active = isSuccess ? successCard : stepCard(currentStep);
    if (!active) return;
    modal.classList.toggle('apply-modal--close-inline', active.offsetHeight + CLOSE_INLINE_EXTRA > window.innerHeight);
  };
  const scheduleLayout = () => {
    if (layoutFrame) cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = null;
      updateCloseInline();
    });
  };

  /* ---------- steps ---------- */

  const renderSteps = () => {
    stepCards.forEach((card) => {
      const n = Number(card.dataset.modalStep);
      const active = !isSuccess && n === currentStep;
      card.classList.toggle('modal-step--active', active);
      card.classList.toggle('modal-step--complete', !isSuccess && n < currentStep);
      card.toggleAttribute('inert', !active);
      card.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    if (successCard) {
      successCard.classList.toggle('modal-success--active', isSuccess);
      successCard.toggleAttribute('inert', !isSuccess);
      successCard.setAttribute('aria-hidden', isSuccess ? 'false' : 'true');
    }
    prevButtons.forEach((b) => (b.disabled = currentStep <= 1));
    nextButtons.forEach((b) => (b.disabled = currentStep >= TOTAL_STEPS));
    counters.forEach((c) => (c.textContent = `${currentStep} of ${TOTAL_STEPS}`));
    modal.setAttribute('aria-labelledby', isSuccess ? 'apply-modal-title-success' : `apply-modal-title-${currentStep}`);
    scheduleLayout();
  };

  const goTo = (n: number, focusTitle = true) => {
    if (n < 1 || n > TOTAL_STEPS) return;
    currentStep = n;
    if (n === TOTAL_STEPS) {
      collect();
      renderReview();
    }
    renderSteps();
    persist();
    if (focusTitle) {
      const card = stepCard(n);
      const focusTarget = card?.querySelector<HTMLElement>('.modal-nav__arrow:not(:disabled)') ?? card?.querySelector<HTMLElement>(FOCUSABLE);
      focusTarget?.focus();
    }
  };
  const goPrev = () => goTo(currentStep - 1);
  const goNext = () => {
    if (!validateStep(currentStep)) return;
    goTo(currentStep + 1);
  };

  /* ---------- open / close ---------- */

  const showSuccess = () => {
    isSuccess = true;
    const title = successCard ? qs('[data-success-title]', successCard) : null;
    if (title) {
      const template = title.dataset.successTemplate || title.textContent || '';
      const firstName = state.fullName.trim().split(/\s+/)[0] || state.fullName.trim();
      title.textContent = template.replace('{name}', firstName);
    }
    closeButtons.forEach((b) => b.classList.add('apply-modal__close--hidden'));
    // As in the original bundle, the header slides away behind the success card.
    qs('header')?.classList.remove('show');
    renderSteps();
    successCard?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  };
  const hideSuccess = () => {
    isSuccess = false;
    closeButtons.forEach((b) => b.classList.remove('apply-modal__close--hidden'));
  };

  const open = (trigger?: HTMLElement) => {
    if (isOpen) return;
    isOpen = true;
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
    opener = trigger ?? (document.activeElement as HTMLElement | null);
    state = loadState();
    populate();
    currentStep = state.currentStep;
    // Restoring straight onto the review step: the summary is only built in goTo(), so render it here.
    if (currentStep === TOTAL_STEPS) {
      collect();
      renderReview();
    }
    hideSuccess();
    setFieldError(fullNameInput, false);
    setFieldError(emailInput, false);
    if (submitError) submitError.textContent = '';
    modal.classList.remove('is-closing');
    modal.classList.add('is-open');
    lockScroll();
    renderSteps();
    // The dialog is `visibility: hidden` until the browser has painted the `.is-open` state,
    // so a synchronous focus() would be ignored — wait a frame before moving focus inside.
    requestAnimationFrame(() => requestAnimationFrame(() => isOpen && modal.focus()));
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    if (!isSuccess) persist();
    else revealHeader(0);
    modal.classList.add('is-closing');
    unlockScroll();
    closeTimer = window.setTimeout(() => {
      modal.classList.remove('is-open', 'is-closing');
      closeTimer = null;
      if (isSuccess) {
        hideSuccess();
        currentStep = 1;
        renderSteps();
      }
    }, CLOSE_MS);
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
  };

  /* ---------- submit ---------- */

  const submit = async (e: Event) => {
    e.preventDefault();
    if (!submitButton || submitButton.disabled) return;
    collect();
    if (submitError) submitError.textContent = '';
    const label = submitButton.querySelector<HTMLElement>('.pill-btn-span') ?? submitButton;
    const originalLabel = label.textContent ?? 'Submit';
    label.textContent = 'Submitting…';
    submitButton.disabled = true;

    try {
      const data = new FormData();
      data.append('fullName', state.fullName.trim());
      data.append('email', state.email.trim());
      data.append('phone', state.phone.trim());
      data.append('trades', JSON.stringify(tradeLabels()));
      data.append('experience', experienceLabel());
      data.append('certifications', state.certifications.trim());
      const file = resumeInput?.files?.[0];
      if (file) data.append('resume', file);

      const res = await fetch(ENDPOINT, { method: 'POST', body: data });
      // No backend in this static build: a missing route answers 404/405 (or 501 on bare static servers).
      if (res.status === 404 || res.status === 405 || res.status === 501) {
        console.warn(`[apply] ${ENDPOINT} is not configured in this static build (HTTP ${res.status}); showing the success state anyway.`);
      } else if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      clearState();
      showSuccess();
      resetForm();
    } catch (err) {
      console.error('[apply] submit failed', err);
      if (submitError) submitError.textContent = 'Something went wrong. Please try again.';
    } finally {
      label.textContent = originalLabel;
      submitButton.disabled = false;
    }
  };

  /* ---------- keyboard ---------- */

  const trapFocus = (e: KeyboardEvent) => {
    // getClientRects() (not offsetParent) so the fixed-position Close button counts as visible.
    const focusables = qsa<HTMLElement>(FOCUSABLE, modal).filter((el) => !el.closest('[inert]') && el.getClientRects().length > 0);
    if (!focusables.length) {
      e.preventDefault();
      modal.focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const inside = active ? modal.contains(active) : false;
    if (e.shiftKey && (active === first || !inside)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !inside)) {
      e.preventDefault();
      first.focus();
    }
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'Tab') trapFocus(e);
  };

  const onFieldInput = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    setFieldError(input, false);
    persist();
  };
  const onChoiceChange = () => {
    collect();
    if (currentStep === 2 && state.trades.length) setStepError(2, '');
    if (currentStep === 3 && state.experience) setStepError(3, '');
    persist();
  };

  /* ---------- wiring ---------- */

  initFileUploads(modal);

  const onTrigger = (e: Event) => {
    e.preventDefault();
    open(e.currentTarget as HTMLElement);
  };
  const onCloseClick = (e: Event) => {
    e.preventDefault();
    close();
  };
  const onPrevClick = (e: Event) => {
    e.preventDefault();
    goPrev();
  };
  const onNextClick = (e: Event) => {
    e.preventDefault();
    goNext();
  };
  // `.apply-modal__overlay` has pointer-events: none (as in the original stylesheet), so
  // "click outside" is detected on the modal root: anything that is not the card container
  // or the Close button counts as the backdrop.
  const isBackdrop = (target: EventTarget | null) => {
    const node = target as Node | null;
    if (!node) return false;
    if (container?.contains(node)) return false;
    if (closeButtons.some((b) => b.contains(node))) return false;
    return true;
  };
  // A drag that starts inside the card and ends on the backdrop targets the root too, so
  // require the press to have started on the backdrop as well.
  let pressOnBackdrop = false;
  const onBackdropPointerDown = (e: PointerEvent) => {
    pressOnBackdrop = isBackdrop(e.target);
  };
  const onBackdropClick = (e: MouseEvent) => {
    const started = pressOnBackdrop;
    pressOnBackdrop = false;
    if (!isOpen || !started || !isBackdrop(e.target)) return;
    close();
  };
  const onEnterInField = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep === 1) {
      e.preventDefault();
      goNext();
    }
  };

  triggers.forEach((t) => t.addEventListener('click', onTrigger));
  closeButtons.forEach((b) => b.addEventListener('click', onCloseClick));
  prevButtons.forEach((b) => b.addEventListener('click', onPrevClick));
  nextButtons.forEach((b) => b.addEventListener('click', onNextClick));
  modal.addEventListener('pointerdown', onBackdropPointerDown);
  modal.addEventListener('click', onBackdropClick);
  submitButton?.addEventListener('click', submit);
  [fullNameInput, emailInput, phoneInput].forEach((input) => {
    input?.addEventListener('input', onFieldInput);
    input?.addEventListener('keydown', onEnterInField);
  });
  certificationsInput?.addEventListener('input', persist);
  [...tradeInputs, ...experienceInputs].forEach((input) => input.addEventListener('change', onChoiceChange));
  document.addEventListener('keydown', onKeydown);
  window.addEventListener('resize', scheduleLayout);

  renderSteps();

  return () => {
    triggers.forEach((t) => t.removeEventListener('click', onTrigger));
    closeButtons.forEach((b) => b.removeEventListener('click', onCloseClick));
    prevButtons.forEach((b) => b.removeEventListener('click', onPrevClick));
    nextButtons.forEach((b) => b.removeEventListener('click', onNextClick));
    modal.removeEventListener('pointerdown', onBackdropPointerDown);
    modal.removeEventListener('click', onBackdropClick);
    submitButton?.removeEventListener('click', submit);
    [fullNameInput, emailInput, phoneInput].forEach((input) => {
      input?.removeEventListener('input', onFieldInput);
      input?.removeEventListener('keydown', onEnterInField);
    });
    certificationsInput?.removeEventListener('input', persist);
    [...tradeInputs, ...experienceInputs].forEach((input) => input.removeEventListener('change', onChoiceChange));
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', scheduleLayout);
    if (closeTimer) window.clearTimeout(closeTimer);
    if (layoutFrame) cancelAnimationFrame(layoutFrame);
    if (isOpen) unlockScroll();
  };
}
