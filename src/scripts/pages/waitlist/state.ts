/** In-progress waitlist state, persisted to sessionStorage until the form is submitted. */
export const STORAGE_KEY = 'breezepocket-waitlist-form';

export interface WaitlistState {
  fullName: string;
  email: string;
  handle: string;
  assets: string[]; // option values
  experience: string; // option value
  wallet: string;
  interest: string;
  currentStep: number;
}

export const emptyState = (): WaitlistState => ({
  fullName: '',
  email: '',
  handle: '',
  assets: [],
  experience: '',
  wallet: '',
  interest: '',
  currentStep: 1,
});

export function saveState(state: WaitlistState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[waitlist] could not persist form state', err);
  }
}

export function loadState(): WaitlistState {
  const state = emptyState();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return state;
    const data = JSON.parse(raw) as Partial<WaitlistState>;
    state.fullName = typeof data.fullName === 'string' ? data.fullName : '';
    state.email = typeof data.email === 'string' ? data.email : '';
    state.handle = typeof data.handle === 'string' ? data.handle : '';
    state.assets = Array.isArray(data.assets) ? data.assets.filter((t): t is string => typeof t === 'string') : [];
    state.experience = typeof data.experience === 'string' ? data.experience : '';
    state.wallet = typeof data.wallet === 'string' ? data.wallet : '';
    state.interest = typeof data.interest === 'string' ? data.interest : '';
    const step = Number(data.currentStep);
    state.currentStep = Number.isInteger(step) && step >= 1 && step <= 5 ? step : 1;
  } catch (err) {
    console.warn('[waitlist] could not restore form state', err);
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
