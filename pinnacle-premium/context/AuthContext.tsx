import React, { createContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // This function runs only on initial mount to determine the initial state.
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      // Bypass: Default to a logged-in user to view the user section immediately.
      const defaultUser: User = { name: 'Demo User', email: 'demo@pinnaclepremiumexchange.com', role: 'user' };
      localStorage.setItem('currentUser', JSON.stringify(defaultUser));
      return defaultUser;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('currentUser');
      return null;
    }
  });

  const login = (email: string, name: string, role: 'user' | 'admin') => {
    const user: User = { email, name, role };
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
