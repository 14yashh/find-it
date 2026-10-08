import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Small full-page loader shown while the session is being bootstrapped
 * (i.e. while GET /api/auth/me is in-flight on first load).
 */
function AuthLoader() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="font-meta text-xs uppercase tracking-widest text-ink-muted animate-pulse">
        Checking session…
      </div>
    </div>
  );
}

/**
 * PublicOnly: Restricts access to unauthenticated visitors.
 * If user is logged in, routes them to their appropriate workspace.
 */
export function PublicOnly({ children }) {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) return <AuthLoader />;

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
  const { currentUser, authLoading } = useAuth();

  if (authLoading) return <AuthLoader />;

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
  const { currentUser, authLoading } = useAuth();

  if (authLoading) return <AuthLoader />;

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
  const { currentUser, authLoading } = useAuth();

  if (authLoading) return <AuthLoader />;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/browse" replace />;
  }

  return children ? children : <Outlet />;
}
