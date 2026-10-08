import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  FolderOpen,
  FileCheck,
  Bell,
  User,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar({
  variant = 'public', // 'public' | 'student' | 'pending' | 'admin'
  user = null,
  unreadNotifications = 2,
  onLogout,
}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="w-full bg-paper border-b-2 border-ink hard-shadow-4 sticky top-0 z-40 select-none">
        <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link
              to={variant === 'public' ? '/' : '/browse'}
              className="font-heading font-extrabold text-base md:text-lg tracking-wider text-ink uppercase border-2 border-ink px-2.5 py-1 bg-paper-light hard-shadow-2 -rotate-1 interactive-hard inline-flex items-center gap-1.5"
            >
              <span>FINDIT</span>
              <span className="text-primary-container font-mono">//</span>
              <span className="font-meta text-xs">ARCHIVE</span>
            </Link>

            {/* Desktop Navigation for Student / General */}
            {variant === 'student' && (
              <nav className="hidden md:flex items-center gap-4 font-meta text-xs md:text-sm font-bold uppercase tracking-wider">
                <Link
                  to="/browse"
                  className={`px-2 py-1 transition-colors ${
                    isActive('/browse')
                      ? 'bg-ink text-paper hard-shadow-2'
                      : 'text-ink hover:bg-manila'
                  }`}
                >
                  Browse
                </Link>
                <Link
                  to="/items/new"
                  className={`px-2 py-1 transition-colors ${
                    isActive('/items/new')
                      ? 'bg-ink text-paper hard-shadow-2'
                      : 'text-ink hover:bg-manila'
                  }`}
                >
                  Report Item
                </Link>
                <Link
                  to="/my-items"
                  className={`px-2 py-1 transition-colors ${
                    isActive('/my-items')
                      ? 'bg-ink text-paper hard-shadow-2'
                      : 'text-ink hover:bg-manila'
                  }`}
                >
                  My Items
                </Link>
                <Link
                  to="/claims"
                  className={`px-2 py-1 transition-colors ${
                    isActive('/claims')
                      ? 'bg-ink text-paper hard-shadow-2'
                      : 'text-ink hover:bg-manila'
                  }`}
                >
                  Claims
                </Link>
              </nav>
            )}

            {/* Desktop Navigation for Public */}
            {variant === 'public' && (
              <nav className="hidden md:flex items-center gap-6 font-meta text-xs md:text-sm text-ink-muted">
                <Link to="/browse" className="hover:text-ink hover:underline">
                  Browse Ledger
                </Link>
                <Link to="/how-it-works" className="hover:text-ink hover:underline">
                  How it Works
                </Link>
                <Link to="/claims" className="hover:text-ink hover:underline">
                  Claims Desk
                </Link>
              </nav>
            )}

            {/* Pending State Notice */}
            {variant === 'pending' && (
              <div className="hidden md:flex items-center gap-2 font-meta text-xs bg-manila border border-ink px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-stamp-pending animate-pulse" />
                <span className="font-bold uppercase tracking-wider">
                  Verification Pending Admin Review
                </span>
              </div>
            )}
          </div>

          {/* Right Action Icons / Auth Buttons */}
          <div className="flex items-center gap-3">
            {variant === 'public' && (
              <div className="flex items-center gap-2 md:gap-3">
                <Link
                  to="/login"
                  className="font-meta text-xs md:text-sm font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-ink bg-paper-light hard-shadow-2 hover:bg-manila interactive-hard"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="font-meta text-xs md:text-sm font-bold uppercase tracking-wider px-3.5 py-1.5 border-2 border-ink bg-primary-container text-ink hard-shadow-2 hover:bg-orange-action interactive-hard"
                >
                  Sign up
                </Link>
              </div>
            )}

            {variant === 'pending' && (
              <div className="flex items-center gap-2">
                <Link
                  to="/verification"
                  className="font-meta text-xs font-bold uppercase px-3 py-1.5 border-2 border-ink bg-manila hard-shadow-2 hover:bg-manila-dark interactive-hard"
                >
                  Status Docket
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 border-2 border-ink bg-paper-light text-ink hard-shadow-2 hover:bg-stamp-rejected hover:text-white interactive-hard"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {variant === 'student' && (
              <div className="flex items-center gap-2 md:gap-3">
                {/* Admin Link if role is admin */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/verifications"
                    className="hidden sm:inline-flex items-center gap-1.5 font-meta text-xs font-bold uppercase px-2.5 py-1.5 border-2 border-ink bg-manila hard-shadow-2 hover:bg-manila-dark interactive-hard"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Desk</span>
                  </Link>
                )}

                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 border-2 border-ink bg-paper-light hard-shadow-2 hover:bg-manila interactive-hard"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-ink" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-stamp-lost text-white font-meta text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-ink">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  className={`hidden sm:flex items-center gap-2 font-meta text-xs font-bold uppercase px-3 py-1.5 border-2 border-ink bg-paper-light hard-shadow-2 hover:bg-manila interactive-hard ${
                    isActive('/profile') ? 'bg-manila' : ''
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-ink" />
                  <span className="truncate max-w-[120px]">
                    {user?.name ? user.name.split(' ')[0] : 'Profile'}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 border-2 border-ink bg-paper-light hard-shadow-2 hover:bg-stamp-rejected hover:text-white interactive-hard"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* Mobile Menu Hamburger */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 border-2 border-ink bg-paper-light hard-shadow-2 hover:bg-manila interactive-hard"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-4 h-4 text-ink" />
                  ) : (
                    <Menu className="w-4 h-4 text-ink" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile dropdown drawer for desktop nav items */}
        {mobileMenuOpen && variant === 'student' && (
          <div className="md:hidden border-t-2 border-ink bg-paper px-4 py-4 space-y-2 font-meta text-xs font-bold uppercase tracking-wider">
            <Link
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 border border-ink bg-paper-light hard-shadow-2"
            >
              Browse Ledger
            </Link>
            <Link
              to="/items/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 border border-ink bg-primary-container hard-shadow-2"
            >
              Report New Item
            </Link>
            <Link
              to="/my-items"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 border border-ink bg-paper-light hard-shadow-2"
            >
              My Reported Items
            </Link>
            <Link
              to="/claims"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 border border-ink bg-paper-light hard-shadow-2"
            >
              Claims Register
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 border border-ink bg-paper-light hard-shadow-2"
            >
              My Profile
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin/verifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-2 border border-ink bg-manila hard-shadow-2"
              >
                Admin Desk
              </Link>
            )}
          </div>
        )}
      </header>

      {/* MOBILE BOTTOM TAB BAR (390px degradation required by Rule 1) */}
      {/* "degrade to a single column at 390 (bottom tab bar with Browse, My items, Report, Claims, Profile)" */}
      {variant === 'student' && (
        <nav
          aria-label="Mobile Bottom Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper border-t-2 border-ink hard-shadow-6 flex items-center justify-around py-1.5 px-2 select-none"
        >
          <Link
            to="/browse"
            className={`flex flex-col items-center p-1 font-meta text-[10px] font-bold uppercase ${
              isActive('/browse') ? 'text-primary' : 'text-ink'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span>Browse</span>
          </Link>

          <Link
            to="/my-items"
            className={`flex flex-col items-center p-1 font-meta text-[10px] font-bold uppercase ${
              isActive('/my-items') ? 'text-primary' : 'text-ink'
            }`}
          >
            <FolderOpen className="w-5 h-5 mb-0.5" />
            <span>My Items</span>
          </Link>

          <Link
            to="/items/new"
            className="flex flex-col items-center p-1 font-meta text-[10px] font-bold uppercase text-ink -mt-4"
          >
            <div className="p-2 bg-primary-container border-2 border-ink hard-shadow-2 rounded-full">
              <PlusCircle className="w-6 h-6 text-ink" />
            </div>
            <span className="mt-0.5">Report</span>
          </Link>

          <Link
            to="/claims"
            className={`flex flex-col items-center p-1 font-meta text-[10px] font-bold uppercase ${
              isActive('/claims') ? 'text-primary' : 'text-ink'
            }`}
          >
            <FileCheck className="w-5 h-5 mb-0.5" />
            <span>Claims</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center p-1 font-meta text-[10px] font-bold uppercase ${
              isActive('/profile') ? 'text-primary' : 'text-ink'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </Link>
        </nav>
      )}
    </>
  );
}
