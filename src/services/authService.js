import { ROLES } from '../utils/constants';

const STORAGE_KEY = 'app_user';

export async function login(username, password) {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (stored && stored.username === username && stored.password === password) {
    return stored;
  }
  return Promise.reject('Invalid credentials');
}

export async function register(username, password, role) {
  const newUser = { username, password, role };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}
