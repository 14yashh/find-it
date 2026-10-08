import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function PublicLayout() {
  const { currentUser, logout } = useAuth();

  const getVariant = () => {
    if (!currentUser) return 'public';
    if (currentUser.role === 'admin') return 'admin';
    if (currentUser.verificationStatus === 'approved') return 'student';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans justify-between">
      <Navbar variant={getVariant()} user={currentUser} onLogout={logout} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
