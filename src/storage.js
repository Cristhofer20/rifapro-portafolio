import { STORAGE_KEYS } from './config.js';

export function loadJson(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

export function saveJson(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadAppState(state) {
  state.users = loadJson(STORAGE_KEYS.users);
  state.events = loadJson(STORAGE_KEYS.events);
  state.payments = loadJson(STORAGE_KEYS.payments);

  const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || 'null');
  state.currentUser = session ? state.users.find(user => user.id === session.userId) : null;
}

export function saveUsers(state) {
  saveJson(STORAGE_KEYS.users, state.users);
}

export function saveEvents(state) {
  saveJson(STORAGE_KEYS.events, state.events);
}

export function savePayments(state) {
  saveJson(STORAGE_KEYS.payments, state.payments);
}

export function saveSession(state) {
  if (state.currentUser) {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ userId: state.currentUser.id }));
  } else {
    localStorage.removeItem(STORAGE_KEYS.session);
  }
}
