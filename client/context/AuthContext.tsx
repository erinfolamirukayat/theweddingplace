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
  registries: any[]; // Expose registries
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string, how_heard: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const [registries, setRegistries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId, email: payload.email });
      } catch {
        setUser(null);
        setRegistries([]);
        clearToken();
      }
    } else {
      setUser(null);
      setRegistries([]);
    }
    setLoading(false);
  }, [token]);

  // Fetch registries when the user logs in
  useEffect(() => {
    if (user && token) {
      console.log('Token:', token)
      getMyRegistries()
        .then(data => {
          setRegistries(data || []);
          if (data && data.length > 0) {
            localStorage.setItem('afriwed_registry_id', data[0].id);
          }
        })
        .catch(() => setRegistries([]));
    }
  }, [user, token]);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    console.log('API call successful. Token received:', res.token);
    saveToken(res.token);
    // Verify if the token was actually saved to localStorage
    console.log('Verifying token from localStorage immediately after save:', localStorage.getItem('token'));
    setToken(res.token);
    setUser(res.user); // This will trigger the useEffect above to fetch registries.
  };

  const register = async (email: string, password: string, first_name: string, last_name: string, how_heard: string) => {
    await apiRegister(email, password, first_name, last_name, how_heard);
    await login(email, password);
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
    setRegistries([]);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, registries }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 