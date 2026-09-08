/** In-progress application state, persisted to sessionStorage until the form is submitted. */
export const STORAGE_KEY = 'vectr-apply-form';

export interface ApplyState {
  fullName: string;
  email: string;
  phone: string;
  trades: string[]; // option values
  experience: string; // option value
  certifications: string;
  currentStep: number;
}

export const emptyState = (): ApplyState => ({
  fullName: '',
  email: '',
  phone: '',
  trades: [],
  experience: '',
  certifications: '',
  currentStep: 1,
});

export function saveState(state: ApplyState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[apply] could not persist form state', err);
  }
}

export function loadState(): ApplyState {
  const state = emptyState();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return state;
    const data = JSON.parse(raw) as Partial<ApplyState>;
    state.fullName = typeof data.fullName === 'string' ? data.fullName : '';
    state.email = typeof data.email === 'string' ? data.email : '';
    state.phone = typeof data.phone === 'string' ? data.phone : '';
    state.trades = Array.isArray(data.trades) ? data.trades.filter((t): t is string => typeof t === 'string') : [];
    state.experience = typeof data.experience === 'string' ? data.experience : '';
    state.certifications = typeof data.certifications === 'string' ? data.certifications : '';
    const step = Number(data.currentStep);
    state.currentStep = Number.isInteger(step) && step >= 1 && step <= 5 ? step : 1;
  } catch (err) {
    console.warn('[apply] could not restore form state', err);
  }
  return state;
}

export function clearState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}
