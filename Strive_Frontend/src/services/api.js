import axios from 'axios';
import * as authService from './authService';

const api = axios.create({
  // change to your deployed API when needed
  baseURL: 'http://127.0.0.1:8000/api',
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await authService.refreshAccessToken();
        
        // Retry the original request with new token
        const newToken = localStorage.getItem('access');
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
