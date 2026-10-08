import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * PublicOnly: Restricts access to unauthenticated visitors.
 * If user is logged in, routes them to their appropriate workspace.
 */
export function PublicOnly({ children }) {
  const { currentUser } = useAuth();

  if (currentUser) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (currentUser.verificationStatus !== 'approved') {
      return <Navigate to="/verification" replace />;
    }
    return <Navigate to="/browse" replace />;
  }

  return children ? children : <Outlet />;
}

/**
 * RequireAuth: Restricts access to logged-in users regardless of verification status.
 * (e.g. /verification requires authentication but allows pending/rejected users).
 */
export function RequireAuth({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

/**
 * RequireApproved: Requires authenticated student with approved verification status.
 * Pending and rejected students are redirected to /verification.
 */
export function RequireApproved({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin' && currentUser.verificationStatus !== 'approved') {
    return <Navigate to="/verification" replace />;
  }

  return children ? children : <Outlet />;
}

/**
 * RequireAdmin: Requires authenticated administrator.
 * Non-admins are redirected to student browse.
 */
export function RequireAdmin({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/browse" replace />;
  }

  return children ? children : <Outlet />;
}
