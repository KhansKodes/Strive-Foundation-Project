import api from './api';
import { ROLES } from '../utils/constants';

const STORAGE_KEY = 'app_user';

/** LOGIN
 * POST /api/auth/login/   -> { access, refresh }
 * GET  /api/auth/profile/ -> { phone, full_name, role } (or first/last depending on backend)
 */
export async function login(phone, password) {
  // 1) get tokens
  const { data: tokens } = await api.post('/auth/login/', { phone, password });
  localStorage.setItem('access', tokens.access);
  localStorage.setItem('refresh', tokens.refresh);

  // 2) fetch profile (Authorization attached by api.js)
  const { data: profile } = await api.get('/auth/profile/');

  // Prefer full_name; fallback to first/last if backend returns that
  const fullName =
    (profile.full_name || '').trim() ||
    [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() ||
    'User';

  const user = {
    phone: profile.phone,
    role: profile.role,
    profile: { fullName },
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

/** REGISTER
 * Backend expects **top-level**: phone, full_name, role, password, confirm_password
 * (NOT profile: { full_name })
 */
export async function register(phone, password, role = ROLES.DONOR, profile = {}) {
  const fullName = (profile.fullName || '').trim() || 'User';

  const payload = {
    phone,
    full_name: fullName,       // <-- important: top-level full_name
    role,
    password,
    confirm_password: password,
  };

  await api.post('/auth/register/', payload);
  // Do not auto-login; your UI navigates to /login on success
  return true;
}

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser() {
  const userStr = localStorage.getItem(STORAGE_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing stored user:', error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

// Check if user is authenticated (has valid tokens)
export function isAuthenticated() {
  const accessToken = localStorage.getItem('access');
  const refreshToken = localStorage.getItem('refresh');
  return !!(accessToken && refreshToken);
}

// Refresh access token using refresh token
export async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const { data: tokens } = await api.post('/auth/token/refresh/', {
      refresh: refreshToken
    });

    localStorage.setItem('access', tokens.access);
    return tokens.access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    throw error;
  }
}

// Validate current token and refresh if needed
export async function validateAndRefreshToken() {
  try {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Try to make a request to validate the token
    await api.get('/auth/profile/');
    return true;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token is invalid, try to refresh
      try {
        await refreshAccessToken();
        return true;
      } catch (refreshError) {
        // Refresh failed, user needs to login again
        logout();
        return false;
      }
    }
    throw error;
  }
}
