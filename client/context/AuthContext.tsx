import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, saveToken, getToken, clearToken } from '../utils/authApi';
import { getMyRegistries } from '../utils/api';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string, how_heard: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId, email: payload.email });
      } catch {
        setUser(null);
        clearToken();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    saveToken(res.token);
    setToken(res.token);
    setUser(res.user);
    // Fetch user's registries and save the first one to localStorage
    try {
      const registries = await getMyRegistries();
      if (registries && registries.length > 0) {
        localStorage.setItem('afriwed_registry_id', registries[0].id);
      } else {
        localStorage.removeItem('afriwed_registry_id');
      }
    } catch (e) {
      localStorage.removeItem('afriwed_registry_id');
    }
  };

  const register = async (email: string, password: string, first_name: string, last_name: string, how_heard: string) => {
    await apiRegister(email, password, first_name, last_name, how_heard);
    await login(email, password);
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 