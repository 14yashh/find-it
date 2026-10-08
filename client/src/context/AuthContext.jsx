import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockStudentApproved,
  mockStudentPending,
  mockStudentRejected,
  mockAdminUser,
} from '../mocks/data.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Session type: 'approved' | 'pending' | 'rejected' | 'admin' | 'logged_out'
  const [sessionType, setSessionType] = useState(() => {
    return localStorage.getItem('findit_dev_session') || 'approved';
  });

  // Global dev state simulation: 'normal' | 'loading' | 'empty' | 'error'
  const [devState, setDevState] = useState(() => {
    const urlParam = new URLSearchParams(window.location.search).get('devState');
    return urlParam || localStorage.getItem('findit_dev_state') || 'normal';
  });

  const getUserForSession = (type) => {
    switch (type) {
      case 'approved':
        return mockStudentApproved;
      case 'pending':
        return mockStudentPending;
      case 'rejected':
        return mockStudentRejected;
      case 'admin':
        return mockAdminUser;
      case 'logged_out':
      default:
        return null;
    }
  };

  const [currentUser, setCurrentUser] = useState(() => getUserForSession(sessionType));

  useEffect(() => {
    const user = getUserForSession(sessionType);
    setCurrentUser(user);
    localStorage.setItem('findit_dev_session', sessionType);
  }, [sessionType]);

  useEffect(() => {
    localStorage.setItem('findit_dev_state', devState);
  }, [devState]);

  const switchSession = (type) => {
    setSessionType(type);
  };

  const login = (roleOrEmail = 'student') => {
    if (typeof roleOrEmail === 'string' && roleOrEmail.includes('admin')) {
      switchSession('admin');
    } else if (typeof roleOrEmail === 'string' && roleOrEmail.includes('pending')) {
      switchSession('pending');
    } else {
      switchSession('approved');
    }
  };

  const logout = () => {
    switchSession('logged_out');
  };

  const updateVerificationStatus = (status, reason) => {
    if (currentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        verificationStatus: status,
        rejectionReason: reason || prev.rejectionReason,
      }));
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    sessionType,
    switchSession,
    login,
    logout,
    updateVerificationStatus,
    devState,
    setDevState,
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
