import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService, getStoredAuthToken, setStoredAuthToken } from '../services/api';

const AUTH_USER_STORAGE_KEY = 'birashoboka_admin_user';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredAuthToken() || '');
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = Boolean(currentUser || token);

  // Validate and restore session from API on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = getStoredAuthToken();
      if (!storedToken) return;

      const result = await ApiService.getCurrentUser();
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setToken(storedToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(result.user));
        }
      }
    };
    restoreSession();
  }, []);

  const login = async (emailOrUser, passwordOrToken) => {
    if (typeof emailOrUser === 'string') {
      const res = await ApiService.login(emailOrUser, passwordOrToken);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        if (res.token) {
          setToken(res.token);
          setStoredAuthToken(res.token);
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(res.user));
        }
        return res;
      }
      return res;
    }

    // Direct object login call from components
    const user = emailOrUser;
    const authToken = passwordOrToken;
    setCurrentUser(user);
    if (authToken) {
      setToken(authToken);
      setStoredAuthToken(authToken);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    }
    return { success: true, user };
  };

  const logout = async () => {
    await ApiService.logout();
    setCurrentUser(null);
    setToken('');
    setStoredAuthToken('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    token,
    setToken,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const useAuth = useAuthContext;
