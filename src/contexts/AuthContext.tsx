'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccountResponseDTO } from '@/services/v1/accountService';

interface AuthContextType {
  user: AccountResponseDTO | null;
  setUser: (user: AccountResponseDTO | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AccountResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('askia-user');
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('askia-user');
      }
    }
    setIsLoading(false);
  }, []);

  const setUser = (user: AccountResponseDTO | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('askia-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('askia-user');
    }
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('askia-user');
  };

  const value = {
    user,
    setUser,
    logout,
    isAuthenticated: !!user,
  };

  if (isLoading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
