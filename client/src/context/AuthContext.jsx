import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';
import { clearSession, getStoredUser, saveSession } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.token, res.user);
    setUser(res.user);
    return res.user;
  }

  async function register(payload) {
    const res = await api.post('/auth/register', payload);
    saveSession(res.token, res.user);
    setUser(res.user);
    return res.user;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  function applyUser(next) {
    setUser(next);
    saveSession(localStorage.getItem('focc.token'), next);
  }

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      applyUser,
      isAdmin: !!user && (user.role === 'admin' || user.role === 'lead'),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
