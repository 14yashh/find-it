import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as apiLogin, logout as apiLogout } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true while bootstrapping session

  // Bootstrap: call GET /api/auth/me on mount to restore session from httpOnly cookie
  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((user) => {
        if (!cancelled) setCurrentUser(user || null);
      })
      .catch(() => {
        if (!cancelled) setCurrentUser(null);
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await apiLogin({ email, password });
    // After login the cookie is set; fetch the full user object
    const user = await getMe();
    setCurrentUser(user || null);
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // ignore errors — clear client state regardless
    }
    setCurrentUser(null);
  }, []);

  const updateVerificationStatus = useCallback((status, reason) => {
    setCurrentUser((prev) =>
      prev ? { ...prev, verificationStatus: status, rejectionReason: reason ?? prev.rejectionReason } : prev
    );
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    authLoading,
    login,
    logout,
    updateVerificationStatus,
    isAuthenticated: !!currentUser,
    isApproved: currentUser?.verificationStatus === 'approved',
    isAdmin: currentUser?.role === 'admin',
    isPending: currentUser?.verificationStatus === 'pending',
    isRejected: currentUser?.verificationStatus === 'rejected',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
