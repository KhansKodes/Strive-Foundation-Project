import { ROLES } from '../utils/constants';

const STORAGE_KEY = 'app_user';

/**
 * Local demo auth using phone + password.
 * Stores profile with firstName/lastName AND a prebuilt fullName so existing UIs keep working.
 */

export async function login(phone, password) {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (stored && stored.phone === phone && stored.password === password) {
    return stored;
  }
  return Promise.reject(new Error('Invalid credentials'));
}

export async function register(phone, password, role = ROLES.DONOR, profile = {}) {
  const firstName = (profile.firstName || '').trim();
  const lastName  = (profile.lastName || '').trim();
  const fullName  = [firstName, lastName].filter(Boolean).join(' ') || firstName || 'User';

  const newUser = {
    phone,
    password,
    role,
    profile: {
      firstName,
      lastName,
      fullName,
    },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}
