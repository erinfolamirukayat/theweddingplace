import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, saveToken, getToken, clearToken } from '../utils/authApi';
import { getMyRegistries, getMe } from '../utils/api';

interface User {
  id: number;
  email: string;
  is_verified?: boolean;
  first_name?: string;
  last_name?: string;
  notification_preference?: 'every_contribution' | 'daily_summary' | 'none';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  registries: any[]; // Expose registries
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, first_name: string, last_name: string, how_heard: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const [registries, setRegistries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getMe();
          if (isMounted) {
            setUser(userData);
          }
        } catch {
          if (isMounted) {
            setUser(null);
            setRegistries([]);
            clearToken();
            setToken(null);
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          setRegistries([]);
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };
    fetchUser();
    return () => { isMounted = false; };
  }, [token]);

  // Fetch registries when the user logs in
  useEffect(() => {
    if (user && token) {
      console.log('Token:', token)
      getMyRegistries()
        .then(data => {
          setRegistries(data || []);
          if (data && data.length > 0) {
            localStorage.setItem('afriwed_registry_id', data[0].uuid);
          } else {
            localStorage.removeItem('afriwed_registry_id');
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
    localStorage.removeItem('afriwed_registry_id');
  };

  return (
    <AuthContext.Provider value={{ user, token, registries, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 