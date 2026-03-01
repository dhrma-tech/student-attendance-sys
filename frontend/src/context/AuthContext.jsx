import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const storageKey = 'attendance_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {
      localStorage.removeItem(storageKey);
      localStorage.removeItem('attendance_token');
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('attendance_token', token);
    localStorage.setItem(storageKey, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('attendance_token');
    localStorage.removeItem(storageKey);
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
