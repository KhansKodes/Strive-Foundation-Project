import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import api from '../services/api';
import LoadingSpinner from '../components/Layout/LoadingSpinner';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user has stored tokens
        if (authService.isAuthenticated()) {
          // Validate and refresh token if needed
          const isValid = await authService.validateAndRefreshToken();
          if (isValid) {
            // Get user data from localStorage
            const storedUser = authService.getCurrentUser();
            if (storedUser) {
              setUser(storedUser);
            } else {
                             // If no user data but valid tokens, fetch user profile
               try {
                 const { data: profile } = await api.get('/auth/profile/');
                const fullName =
                  (profile.full_name || '').trim() ||
                  [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() ||
                  'User';

                const user = {
                  phone: profile.phone,
                  role: profile.role,
                  profile: { fullName },
                };

                localStorage.setItem('app_user', JSON.stringify(user));
                setUser(user);
              } catch (error) {
                console.error('Failed to fetch user profile:', error);
                authService.logout();
              }
            }
          } else {
            // Token validation failed, clear everything
            authService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (phone, password) => {
    try {
      const found = await authService.login(phone, password);
      setUser(found);
      return found;
    } catch (error) {
      throw error;
    }
  };

  const register = async (phone, password, role, profile) => {
    try {
      const created = await authService.register(phone, password, role, profile);
      return created;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && authService.isAuthenticated();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
