/**
 * Resume upload widget (port of the original `zi`/`co` helpers).
 * A `[data-file-upload]` wrapper switches between three views — empty / loading / filled —
 * and enforces `data-max-size`. Dispatch `file-upload:sync` on the wrapper after clearing the
 * input programmatically to bring the view back to the empty state.
 */
const LOADING_MS = 500;
type FileState = 'empty' | 'loading' | 'filled';

function setState(root: HTMLElement, state: FileState) {
  const empty = root.querySelector<HTMLElement>('[data-file-empty]');
  const loading = root.querySelector<HTMLElement>('[data-file-loading]');
  const filled = root.querySelector<HTMLElement>('[data-file-filled]');
  if (!empty || !loading || !filled) return;
  empty.hidden = state !== 'empty';
  loading.hidden = state !== 'loading';
  filled.hidden = state !== 'filled';
}

export function initFileUpload(root: HTMLElement) {
  if (root.dataset.fileUploadReady === '1') return;
  root.dataset.fileUploadReady = '1';

  const input = root.querySelector<HTMLInputElement>('.form__file-input');
  const nameEl = root.querySelector<HTMLElement>('[data-file-name]');
  const removeBtn = root.querySelector<HTMLButtonElement>('[data-file-remove]');
  const errorEl = root.querySelector<HTMLElement>('[data-file-error]');
  if (!input || !nameEl || !removeBtn) return;

  const maxSize = Number(root.dataset.maxSize) || 0;
  const tooLarge = root.dataset.tooLargeMessage || 'File is too large';
  const setError = (msg: string) => {
    if (errorEl) errorEl.textContent = msg || '';
  };

  let timer: number | null = null;
  const reset = () => {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
    input.value = '';
    nameEl.textContent = '';
    setState(root, 'empty');
  };

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) {
      setError('');
      reset();
      return;
    }
    if (maxSize > 0 && file.size > maxSize) {
      setError(tooLarge);
      reset();
      return;
    }
    setError('');
    nameEl.textContent = file.name;
    setState(root, 'loading');
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      setState(root, 'filled');
      timer = null;
    }, LOADING_MS);
  });

  removeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setError('');
    reset();
    input.dispatchEvent(new Event('change', { bubbles: true }));
    // Keep keyboard users inside the widget after the remove button disappears: the
    // empty-state wrapper is a plain <label>, so focus the (tabbable) file input instead.
    input.focus();
  });

  root.addEventListener('file-upload:sync', () => {
    if (!input.files || input.files.length === 0) reset();
  });
}

export function initFileUploads(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>('[data-file-upload]').forEach(initFileUpload);
}
