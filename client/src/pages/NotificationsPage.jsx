import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Tape from '../components/ui/Tape.jsx';
import { useNotifications } from '../hooks/useNotifications.js';
import {
  Bell,
  CheckCheck,
  CheckCircle,
  FileCheck2,
  GitCompare,
  ShieldCheck,
  ArrowRight,
  Trash2,
} from 'lucide-react';

export default function NotificationsPage({ user }) {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'claim_approved':
        return <CheckCircle className="w-5 h-5 text-stamp-found" />;
      case 'claim_received':
        return <FileCheck2 className="w-5 h-5 text-primary" />;
      case 'item_matched':
        return <GitCompare className="w-5 h-5 text-stamp-pending" />;
      case 'user_verified':
        return <ShieldCheck className="w-5 h-5 text-stamp-found" />;
      default:
        return <Bell className="w-5 h-5 text-ink" />;
    }
  };

  const handleNotificationClick = (n) => {
    markAsRead(n._id);
    if (n.link) {
      navigate(n.link);
    }
  };

  return (
    <div className="font-sans">

      <section className="bg-manila border-b-2 border-ink px-4 md:px-6 py-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 font-meta text-xs">
              <span className="bg-ink text-paper px-2 py-0.5 uppercase font-bold">
                DISPATCH WIRE
              </span>
              <span className="text-ink-muted uppercase">SYSTEM ALERTS & NOTIFICATIONS</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase text-ink tracking-tight">
              Archive Notifications
            </h1>
            <p className="font-sans text-sm md:text-base text-ink-muted mt-0.5">
              Live updates on your reported property, submitted claims, and candidate ledger matches.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="md"
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 self-start sm:self-auto bg-paper"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </Button>
          )}
        </div>
      </section>

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        {notifications.length > 0 ? (
          <div className="max-w-2xl mx-auto space-y-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`border-2 border-ink p-4 hard-shadow-2 cursor-pointer transition-all flex items-start gap-4 ${
                  n.isRead
                    ? 'bg-paper opacity-80 hover:opacity-100'
                    : 'bg-paper-light border-ink hard-shadow-4 ring-1 ring-primary'
                }`}
              >
                <div className="p-2 border border-ink bg-manila/50 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-meta text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                      {n.type?.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-meta text-[11px] text-ink-faint">
                        {new Date(n.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <button
                        title="Remove notification"
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                        className="p-1 rounded text-ink-faint hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-sans text-sm md:text-base text-ink font-semibold leading-snug">
                    {n.message}
                  </p>

                  {n.link && (
                    <span className="inline-flex items-center gap-1 font-meta text-xs text-primary font-bold pt-1 hover:underline">
                      <span>Inspect related record</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="All Clear on the Wire"
            message="No system dispatches or claim updates recorded."
            icon={Bell}
          />
        )}
      </main>
    </div>
  );
}
