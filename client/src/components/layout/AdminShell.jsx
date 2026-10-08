import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  ShieldCheck,
  Package,
  FileCheck2,
  Users,
  BarChart3,
  LogOut,
  ArrowLeft,
} from 'lucide-react';

export default function AdminShell({ children, title, subtitle, onLogout }) {
  const location = useLocation();

  const navLinks = [
    {
      name: 'Verifications',
      path: '/admin/verifications',
      icon: ShieldCheck,
      badge: 'Pending',
    },
    {
      name: 'Archive Stats',
      path: '/admin',
      icon: BarChart3,
    },
    {
      name: 'Items Ledger',
      path: '/admin/items',
      icon: Package,
    },
    {
      name: 'Claims Audit',
      path: '/admin/claims',
      icon: FileCheck2,
    },
    {
      name: 'User Accounts',
      path: '/admin/users',
      icon: Users,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const routeMeta = {
    '/admin': {
      title: 'Archive Overview // General Ledger',
      subtitle: 'SYSTEM-WIDE PROPERTY ARCHIVE METRICS & INVENTORY SUMMARY',
    },
    '/admin/verifications': {
      title: 'Verification Desk // Queue',
      subtitle: 'OFFICIAL STUDENT ENROLLMENT & CREDENTIAL AUDIT // QUEUE',
    },
    '/admin/items': {
      title: 'Items Ledger // Master Property Catalog',
      subtitle: 'REGISTRY AUDIT, EXPIRATION OVERVIEW & INVENTORY CONTROL',
    },
    '/admin/claims': {
      title: 'Claims Audit // Custody & Dispositions',
      subtitle: 'CROSS-CAMPUS DISPUTE RESOLUTION & PROPERTY HANDOVER AUDITING',
    },
    '/admin/users': {
      title: 'User Accounts // Enrollment Directory',
      subtitle: 'STUDENT DIRECTORY, INSTITUTIONAL ROLES & ACCESS CONTROL',
    },
  };

  const activeMeta = routeMeta[location.pathname] || {};
  const displayTitle = title || activeMeta.title;
  const displaySubtitle = subtitle || activeMeta.subtitle;

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      {/* Admin Top Header */}
      <header className="w-full bg-manila border-b-2 border-ink hard-shadow-2 sticky top-0 z-40 select-none">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/browse"
              className="p-1 border border-ink bg-paper text-ink hard-shadow-2 hover:bg-white interactive-hard"
              title="Return to Student View"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-sm md:text-base uppercase tracking-wider text-ink">
                ADMIN DESK //
              </span>
              <span className="font-meta text-xs bg-ink text-paper px-2 py-0.5 font-bold uppercase tracking-widest">
                CLEARANCE LEVEL 1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block font-meta text-xs text-ink font-bold">
              ADMINISTRATOR: MASTER DISPATCH
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 border border-ink bg-paper text-ink hard-shadow-2 hover:bg-stamp-rejected hover:text-white interactive-hard"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TOP TAB STRIP ON MOBILE (Rule 1 requirement: "admin sidebar becomes a top tab strip") */}
        <div className="md:hidden flex overflow-x-auto border-t border-ink bg-paper scrollbar-none font-meta text-xs font-bold uppercase tracking-wider">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 whitespace-nowrap border-r border-ink ${
                  active ? 'bg-ink text-paper' : 'text-ink hover:bg-manila'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="w-full max-w-screen-2xl mx-auto flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar on md+ screens */}
        <aside className="hidden md:flex w-64 flex-col border-r-2 border-ink bg-paper-light p-4 space-y-2 select-none shrink-0">
          <div className="font-meta text-xs font-bold uppercase text-ink-muted px-2 py-1 tracking-widest border-b border-ink/20">
            Control Registers
          </div>

          <nav className="space-y-1 font-meta text-xs font-bold uppercase tracking-wider pt-2">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 border-2 border-ink transition-all ${
                    active
                      ? 'bg-ink text-paper hard-shadow-4 translate-x-1'
                      : 'bg-paper hover:bg-manila text-ink hard-shadow-2'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-primary-container text-ink font-meta text-[10px] px-1.5 py-0.2 border border-ink">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Notice */}
          <div className="mt-auto p-3 border-2 border-dashed border-ink bg-manila/50 text-xs font-meta space-y-1">
            <span className="font-bold uppercase tracking-wider block text-ink">
              Institutional Rule
            </span>
            <p className="text-ink-muted text-[11px]">
              Verifications must match institutional ID. Handover status marks claim as returned.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {displayTitle && (
            <div className="border-b-2 border-ink pb-4 mb-6">
              <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-ink uppercase tracking-wide">
                {displayTitle}
              </h1>
              {displaySubtitle && (
                <p className="font-meta text-xs md:text-sm text-ink-muted mt-1 uppercase tracking-wider">
                  {displaySubtitle}
                </p>
              )}
            </div>
          )}
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
