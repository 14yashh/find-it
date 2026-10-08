import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../hooks/useNotifications.js';

export default function StudentLayout() {
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans justify-between">
      <Navbar
        variant="student"
        user={currentUser}
        unreadNotifications={unreadCount || 0}
        onLogout={logout}
      />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
