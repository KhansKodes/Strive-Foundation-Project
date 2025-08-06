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

  const login = async (u, p) => {
    const found = await authService.login(u, p);
    setUser(found);
    return found;
  };

  const register = async (u, p, role) => {
    const created = await authService.register(u, p, role);
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
