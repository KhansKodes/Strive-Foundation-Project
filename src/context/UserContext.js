import React, { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const { user } = useContext(AuthContext);
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}
