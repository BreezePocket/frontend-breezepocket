import { revealHeader } from '../header';
import { qs, qsa, show } from '../utils';

/**
 * Request Crews page: entrance reveal + the request form (validation, localStorage draft,
 * JSON POST to /api/request-crew, success state).
 */
const STORAGE_KEY = 'vectr-request-crew-form';
const ENDPOINT = '/api/request-crew';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES: Record<string, string> = {
  firstName: 'Please enter your first name',
  lastName: 'Please enter your last name',
  companyName: 'Please enter your company name',
  workEmail: 'Please enter a valid work email',
  industry: 'Please select an industry',
};

type FormValues = Record<string, string>;

/* ---------- localStorage persistence (To / gl / wl in the original bundle) ---------- */

function serialize(form: HTMLFormElement): FormValues {
  const out: FormValues = {};
  for (const [key, value] of new FormData(form).entries()) {
    if (typeof value === 'string') out[key] = value;
  }
  return out;
}

function saveForm(form: HTMLFormElement) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(form)));
  } catch {
    /* storage unavailable (private mode, quota) — ignore */
  }
}

function restoreForm(form: HTMLFormElement) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== 'object') return;
    Object.entries(data as Record<string, unknown>).forEach(([name, value]) => {
      const field = form.querySelector<HTMLInputElement>(`[name="${CSS.escape(name)}"]`);
      if (!field) return;
      if (field.type === 'radio') {
        qsa<HTMLInputElement>(`[name="${CSS.escape(name)}"]`, form).forEach((r) => (r.checked = r.value === value));
      } else if (field.type === 'checkbox') {
        field.checked = value === 'on' || value === true;
      } else {
        field.value = typeof value === 'string' ? value : '';
      }
    });
  } catch (err) {
    console.warn('Failed to load form data from localStorage:', err);
  }
}

function clearSaved() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/* ---------- validation ---------- */

function errorSlot(input: HTMLElement): HTMLElement | null {
  return input.closest('.form__field')?.querySelector<HTMLElement>('[data-field-error]') ?? null;
}

function setError(input: HTMLInputElement, message: string) {
  input.classList.add('form__input--error');
  input.setAttribute('aria-invalid', 'true');
  const slot = errorSlot(input);
  if (slot) slot.textContent = message;
}

function clearError(input: HTMLInputElement) {
  input.classList.remove('form__input--error');
  input.removeAttribute('aria-invalid');
  const slot = errorSlot(input);
  if (slot) slot.textContent = '';
}

function validateInput(input: HTMLInputElement): boolean {
  const value = input.value.trim();
  const required = input.hasAttribute('required');
  if (required && !value) {
    setError(input, MESSAGES[input.name] ?? 'This field is required');
    return false;
  }
  if (input.type === 'email' && (required || value) && !EMAIL_RE.test(value)) {
    setError(input, MESSAGES.workEmail);
    return false;
  }
  clearError(input);
  return true;
}

function validateRadios(form: HTMLFormElement, name: string): HTMLInputElement | null {
  const radios = qsa<HTMLInputElement>(`input[type="radio"][name="${name}"]`, form);
  if (!radios.length) return null;
  const group = radios[0].closest('.form__field') as HTMLElement | null;
  const slot = group?.querySelector<HTMLElement>('[data-field-error]') ?? null;
  const valid = radios.some((r) => r.checked);
  radios.forEach((r) => (valid ? r.removeAttribute('aria-invalid') : r.setAttribute('aria-invalid', 'true')));
  if (slot) slot.textContent = valid ? '' : MESSAGES[name] ?? 'Please make a selection';
  return valid ? null : radios[0];
}

/* ---------- submission ---------- */

function renderSuccess(form: HTMLFormElement, firstName: string) {
  const wrap = document.createElement('div');
  wrap.className = 'form__success';
  const h3 = document.createElement('h3');
  h3.textContent = `Thanks, ${firstName}.`;
  const p = document.createElement('p');
  p.textContent = "We've received your request and will be in touch shortly.";
  wrap.append(h3, p);
  form.replaceChildren(wrap);
  wrap.setAttribute('tabindex', '-1');
  wrap.focus({ preventScroll: true });
}

function initForm() {
  const form = qs<HTMLFormElement>('#request-crew-form');
  if (!form) return;

  const inputs = qsa<HTMLInputElement>('.form__input', form);
  const radios = qsa<HTMLInputElement>('input[type="radio"]', form);
  const submitBtn = qs<HTMLButtonElement>('button[type="submit"]', form);
  const submitLabel = submitBtn?.querySelector<HTMLElement>('.pill-btn-span') ?? null;
  const formError = qs<HTMLElement>('[data-form-error]', form);
  const idleLabel = submitLabel?.textContent ?? 'Submit';

  restoreForm(form);

  const setFormError = (msg: string) => {
    if (formError) formError.textContent = msg;
  };

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      clearError(input);
      setFormError('');
      saveForm(form);
    });
    input.addEventListener('change', () => saveForm(form));
    input.addEventListener('blur', () => {
      // Only surface an error on blur once the user typed something (avoid nagging on tab-through).
      if (input.value.trim()) validateInput(input);
    });
  });

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      validateRadios(form, radio.name);
      setFormError('');
      saveForm(form);
    });
  });

  const setBusy = (busy: boolean) => {
    if (!submitBtn) return;
    submitBtn.disabled = busy;
    submitBtn.setAttribute('aria-busy', String(busy));
    if (submitLabel) submitLabel.textContent = busy ? 'Submitting…' : idleLabel;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormError('');

    let firstInvalid: HTMLInputElement | null = null;
    inputs.forEach((input) => {
      if (!validateInput(input) && !firstInvalid) firstInvalid = input;
    });
    const invalidRadio = validateRadios(form, 'industry');
    if (!firstInvalid && invalidRadio) firstInvalid = invalidRadio;

    if (firstInvalid) {
      (firstInvalid as HTMLInputElement).focus();
      return;
    }

    const values = serialize(form);
    setBusy(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.status === 404 || res.status === 405) {
        console.warn(`[request-crew] ${ENDPOINT} returned ${res.status}: no backend configured; showing success state.`);
      } else if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      clearSaved();
      renderSuccess(form, values.firstName?.trim() || 'there');
    } catch (err) {
      console.error('[request-crew] submission failed', err);
      setBusy(false);
      setFormError('Something went wrong while sending your request. Please try again in a moment.');
    }
  });
}

export function init() {
  revealHeader(0);
  show('.request-crew', 100);
  initForm();
}
