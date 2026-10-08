import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminShell from './AdminShell.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <AdminShell onLogout={logout}>
      <Outlet />
    </AdminShell>
  );
}
