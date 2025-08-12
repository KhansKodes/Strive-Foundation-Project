import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // on mount, restore from localStorage if present
  useEffect(() => {
    const stored = authService.getCurrentUser();
    if (stored) setUser(stored);
  }, []);

  const login = async (phone, password) => {
    const found = await authService.login(phone, password);
    setUser(found);
    return found;
  };

  const register = async (phone, password, role, profile) => {
    const created = await authService.register(phone, password, role, profile);
    setUser(created);
    return created;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
