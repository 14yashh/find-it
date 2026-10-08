import React from 'react';
import Stamp from '../components/ui/Stamp.jsx';
import Button from '../components/ui/Button.jsx';
import TicketStub from '../components/ui/TicketStub.jsx';
import Tape from '../components/ui/Tape.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User,
  Mail,
  Building,
  GraduationCap,
  Phone,
  Shield,
  Calendar,
  LogOut,
  FolderOpen,
  FileCheck2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage({ user, onLogout }) {
  const { currentUser, logout, authLoading } = useAuth();
  const profile = user || currentUser;
  const handleLogout = onLogout || logout;

  if (authLoading || !profile) {
    return (
      <div className="font-sans min-h-[50vh] flex items-center justify-center">
        <div className="bg-paper border-2 border-ink p-8 hard-shadow-4 text-center font-meta text-xs">
          <span className="animate-pulse block font-bold text-ink mb-2">LOADING PROFILE RECORD...</span>
          <span className="text-ink-muted">Querying Central Campus Archive</span>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">

      <section className="bg-manila border-b-2 border-ink px-4 md:px-6 py-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 font-meta text-xs">
              <span className="bg-ink text-paper px-2 py-0.5 uppercase font-bold">
                ROSTER IDENTIFICATION
              </span>
              <span className="text-ink-muted uppercase">STUDENT PROFILE RECORD</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase text-ink tracking-tight">
              Student Profile
            </h1>
            <p className="font-sans text-sm md:text-base text-ink-muted mt-0.5">
              Verified enrollment particulars registered with the Campus Central Archive.
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={handleLogout}
            className="flex items-center gap-2 self-start sm:self-auto bg-paper"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </Button>
        </div>
      </section>

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
          {/* Left Column: ID Card / Dossier (7 cols) */}
          <div className="lg:col-span-7 bg-paper border-2 border-ink hard-shadow-6 p-6 sm:p-8 relative space-y-6">
            <Tape position="top-right" />
            <div className="absolute top-4 left-4 eyelet" />

            <div className="flex items-start justify-between border-b-2 border-ink pb-4">
              <div>
                <span className="font-meta text-xs font-bold uppercase text-ink-muted">
                  REGISTRY IDENTITY DOSSIER
                </span>
                <h2 className="font-heading text-2xl font-bold uppercase text-ink mt-1">
                  {profile.name}
                </h2>
                <p className="font-meta text-xs text-ink-muted">{profile.email}</p>
              </div>
              <Stamp type={profile.verificationStatus} size="sm" rotate={true} />
            </div>

            <div className="space-y-4 font-meta text-xs md:text-sm">
              {profile.rollNumber && (
                <div className="flex items-center gap-3 p-3 bg-paper-light border border-ink">
                  <User className="w-4 h-4 text-ink shrink-0" />
                  <div>
                    <span className="text-ink-muted block text-[11px] uppercase">Roll Number</span>
                    <span className="font-mono font-bold text-ink text-sm">{profile.rollNumber}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-paper-light border border-ink">
                <Building className="w-4 h-4 text-ink shrink-0" />
                <div>
                  <span className="text-ink-muted block text-[11px] uppercase">Department</span>
                  <span className="font-bold text-ink">{profile.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-paper-light border border-ink">
                <GraduationCap className="w-4 h-4 text-ink shrink-0" />
                <div>
                  <span className="text-ink-muted block text-[11px] uppercase">Academic Year</span>
                  <span className="font-bold text-ink">{profile.year}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-paper-light border border-ink">
                <Phone className="w-4 h-4 text-ink shrink-0" />
                <div>
                  <span className="text-ink-muted block text-[11px] uppercase">Contact Phone</span>
                  <span className="font-bold text-ink">{profile.phone || 'None provided'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-paper-light border border-ink">
                <Shield className="w-4 h-4 text-ink shrink-0" />
                <div>
                  <span className="text-ink-muted block text-[11px] uppercase">Account Role</span>
                  <span className="font-bold text-ink uppercase">{profile.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-paper-light border border-ink">
                <Calendar className="w-4 h-4 text-ink shrink-0" />
                <div>
                  <span className="text-ink-muted block text-[11px] uppercase">Enrolled In Archive</span>
                  <span className="font-bold text-ink">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Links & Stat Stub (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <TicketStub
              className="bg-manila space-y-4"
              header={
                <div className="font-meta text-xs font-bold uppercase tracking-wider text-ink">
                  Personal Archive Actions
                </div>
              }
            >
              <div className="space-y-2">
                <Link
                  to="/my-items"
                  className="w-full flex items-center justify-between p-3 border-2 border-ink bg-paper font-meta text-xs font-bold uppercase hard-shadow-2 hover:bg-white interactive-hard"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-ink" />
                    <span>View My Items</span>
                  </div>
                  <span>→</span>
                </Link>

                <Link
                  to="/claims"
                  className="w-full flex items-center justify-between p-3 border-2 border-ink bg-paper font-meta text-xs font-bold uppercase hard-shadow-2 hover:bg-white interactive-hard"
                >
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-ink" />
                    <span>View Claims Registry</span>
                  </div>
                  <span>→</span>
                </Link>

                {profile.role === 'admin' && (
                  <Link
                    to="/admin/verifications"
                    className="w-full flex items-center justify-between p-3 border-2 border-ink bg-primary-container font-meta text-xs font-bold uppercase hard-shadow-2 hover:bg-orange-action interactive-hard"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-ink" />
                      <span>Admin Dispatch Desk</span>
                    </div>
                    <span>→</span>
                  </Link>
                )}
              </div>
            </TicketStub>

            <div className="p-4 border-2 border-dashed border-ink/40 bg-paper-light font-meta text-xs text-ink-muted space-y-1">
              <span className="font-bold uppercase text-ink block">
                Verification Protocol Note:
              </span>
              <p className="text-[11px]">
                Credentials verified by Campus Disposition Division. Contact changes require verification ticket resubmission.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
