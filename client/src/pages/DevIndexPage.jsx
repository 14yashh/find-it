import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import TicketStub from '../components/ui/TicketStub.jsx';
import Button from '../components/ui/Button.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import Tape from '../components/ui/Tape.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  AlertTriangle,
  ExternalLink,
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  Package,
  FileCheck2,
  Bell,
  User,
  Search,
  PlusCircle,
  HelpCircle,
  RotateCcw,
  Layers,
} from 'lucide-react';

export default function DevIndexPage() {
  const {
    currentUser,
    sessionType,
    switchSession,
    devState,
    setDevState,
  } = useAuth();

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans justify-between">
      <Navbar variant="student" user={currentUser} />

      <main className="flex-1 max-w-screen-xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* TEMPORARY WARNING NOTICE */}
        <div className="bg-red-50 border-4 border-stamp-rejected p-5 hard-shadow-6 relative">
          <Tape text="STAGE C3 REVIEW ONLY // REMOVE BEFORE PRODUCTION" position="top-right" />
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-stamp-rejected shrink-0 mt-0.5" />
            <div>
              <h1 className="font-heading font-black text-xl md:text-2xl text-stamp-rejected uppercase tracking-wider">
                Temporary Dev Review Index (/dev)
              </h1>
              <p className="font-meta text-xs md:text-sm text-ink mt-1">
                This diagnostic dashboard allows testing every route, route guard, mock session, and state variant without touching real backend services.
              </p>
            </div>
          </div>
        </div>

        {/* 1. MOCK SESSION SWITCHER */}
        <section className="bg-paper border-2 border-ink hard-shadow-4 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-lg text-ink uppercase tracking-wide flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-ink" />
                1. Mock Session Switcher
              </h2>
              <p className="font-meta text-xs text-ink-muted">
                Switch active auth context to test route guards (RequireAuth, RequireApproved, RequireAdmin, PublicOnly).
              </p>
            </div>
            <div className="flex items-center gap-2 font-meta text-xs">
              <span className="font-bold">Active User:</span>
              <span className="bg-ink text-paper px-2 py-0.5 font-bold uppercase">
                {currentUser ? `${currentUser.name} (${currentUser.role})` : 'LOGGED OUT'}
              </span>
              {currentUser && (
                <Stamp status={currentUser.verificationStatus} size="sm" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Button
              variant={sessionType === 'logged_out' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => switchSession('logged_out')}
              className="justify-center text-xs"
            >
              Logged Out (Guest)
            </Button>
            <Button
              variant={sessionType === 'pending' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => switchSession('pending')}
              className="justify-center text-xs"
            >
              Pending Student (Alex)
            </Button>
            <Button
              variant={sessionType === 'rejected' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => switchSession('rejected')}
              className="justify-center text-xs"
            >
              Rejected Student (Sam)
            </Button>
            <Button
              variant={sessionType === 'approved' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => switchSession('approved')}
              className="justify-center text-xs"
            >
              Approved Student (Jordan)
            </Button>
            <Button
              variant={sessionType === 'admin' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => switchSession('admin')}
              className="justify-center text-xs"
            >
              Admin Officer (Security)
            </Button>
          </div>
        </section>

        {/* 2. HOOK STATE SIMULATOR (Loading / Empty / Error / Normal) */}
        <section className="bg-manila border-2 border-ink hard-shadow-4 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-lg text-ink uppercase tracking-wide flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-ink" />
                2. Hook Simulation State (devState)
              </h2>
              <p className="font-meta text-xs text-ink-muted">
                Forces loading skeletons, empty lists, or API errors across all custom data hooks.
              </p>
            </div>
            <div className="font-meta text-xs">
              <span className="font-bold">Active Simulation: </span>
              <span className="uppercase font-bold underline text-stamp-rejected">
                {devState}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant={devState === 'normal' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setDevState('normal')}
              className="text-xs"
            >
              Normal (Mock Records)
            </Button>
            <Button
              variant={devState === 'loading' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setDevState('loading')}
              className="text-xs"
            >
              Force Loading (Skeletons)
            </Button>
            <Button
              variant={devState === 'empty' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setDevState('empty')}
              className="text-xs"
            >
              Force Empty (Zero State)
            </Button>
            <Button
              variant={devState === 'error' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setDevState('error')}
              className="text-xs"
            >
              Force Error (Failure State)
            </Button>
          </div>
        </section>

        {/* 3. VERIFICATION STATE VARIANTS */}
        <section className="bg-paper border-2 border-ink hard-shadow-4 p-5 space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-ink uppercase tracking-wide flex items-center gap-2 border-b-2 border-ink pb-2">
            <ShieldCheck className="w-5 h-5 text-ink" />
            3. Verification Page State Variants (/verification)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TicketStub className="bg-manila border border-ink p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-meta text-xs font-bold uppercase">Pending Audit</span>
                <Stamp status="pending" size="sm" />
              </div>
              <p className="font-meta text-xs text-ink-muted">
                Waiting room state with refresh button and institutional advice.
              </p>
              <Link to="/verification?status=pending">
                <Button size="sm" variant="secondary" className="w-full justify-center text-xs mt-2">
                  View Pending State <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </TicketStub>

            <TicketStub className="bg-green-50 border border-ink p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-meta text-xs font-bold uppercase">Approved Clearance</span>
                <Stamp status="approved" size="sm" />
              </div>
              <p className="font-meta text-xs text-ink-muted">
                Success clearance docket with direct link to campus registry.
              </p>
              <Link to="/verification?status=approved">
                <Button size="sm" variant="secondary" className="w-full justify-center text-xs mt-2">
                  View Approved State <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </TicketStub>

            <TicketStub className="bg-red-50 border border-ink p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-meta text-xs font-bold uppercase">Rejected Clearance</span>
                <Stamp status="rejected" size="sm" />
              </div>
              <p className="font-meta text-xs text-ink-muted">
                Displays specific rejection reason and document re-upload dropzone.
              </p>
              <Link to="/verification?status=rejected">
                <Button size="sm" variant="secondary" className="w-full justify-center text-xs mt-2">
                  View Rejected State <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </TicketStub>
          </div>
        </section>

        {/* 4. ITEM DETAIL STATE VARIANTS */}
        <section className="bg-paper border-2 border-ink hard-shadow-4 p-5 space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-ink uppercase tracking-wide flex items-center gap-2 border-b-2 border-ink pb-2">
            <Package className="w-5 h-5 text-ink" />
            4. Item Detail State Variants (/items/:id)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-meta text-xs">
            <Link to="/items/item-001" className="p-3 border-2 border-ink bg-paper-light hover:bg-manila space-y-1 block">
              <span className="font-bold text-ink block">Found Item (Open)</span>
              <p className="text-ink-muted text-[11px]">Claimant view with verification challenge modal.</p>
              <Stamp status="open" size="sm" />
            </Link>

            <Link to="/items/item-002" className="p-3 border-2 border-ink bg-paper-light hover:bg-manila space-y-1 block">
              <span className="font-bold text-ink block">Lost Item (Owner View)</span>
              <p className="text-ink-muted text-[11px]">Owned by current student with edit record button.</p>
              <Stamp status="open" size="sm" />
            </Link>

            <Link to="/items/item-003" className="p-3 border-2 border-ink bg-paper-light hover:bg-manila space-y-1 block">
              <span className="font-bold text-ink block">Claim Pending</span>
              <p className="text-ink-muted text-[11px]">Item currently locked under claimant review.</p>
              <Stamp status="claim_pending" size="sm" />
            </Link>

            <Link to="/items/item-005" className="p-3 border-2 border-ink bg-paper-light hover:bg-manila space-y-1 block">
              <span className="font-bold text-ink block">Returned Property</span>
              <p className="text-ink-muted text-[11px]">Successfully handed over to verified owner.</p>
              <Stamp status="returned" size="sm" />
            </Link>

            <Link to="/items/item-007" className="p-3 border-2 border-ink bg-paper-light hover:bg-manila space-y-1 block">
              <span className="font-bold text-ink block">Expired Listing</span>
              <p className="text-ink-muted text-[11px]">60-day custodial window lapsed.</p>
              <Stamp status="expired" size="sm" />
            </Link>
          </div>
        </section>

        {/* 5. STUDENT APPLICATION ROUTES */}
        <section className="bg-paper border-2 border-ink hard-shadow-4 p-5 space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-ink uppercase tracking-wide flex items-center gap-2 border-b-2 border-ink pb-2">
            <Layers className="w-5 h-5 text-ink" />
            5. Student Application Routes (RequireApproved Guard)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-meta text-xs">
            <div className="p-3 border border-ink bg-paper space-y-2">
              <span className="font-bold text-ink block">Browse Archive</span>
              <div className="space-y-1">
                <Link to="/browse" className="text-primary hover:underline block">Normal (/browse)</Link>
                <Link to="/browse?devState=loading" className="text-ink-muted hover:underline block">Loading state (?devState=loading)</Link>
                <Link to="/browse?devState=empty" className="text-ink-muted hover:underline block">Empty state (?devState=empty)</Link>
                <Link to="/browse?devState=error" className="text-stamp-rejected hover:underline block">Error state (?devState=error)</Link>
              </div>
            </div>

            <div className="p-3 border border-ink bg-paper space-y-2">
              <span className="font-bold text-ink block">Reporting Property</span>
              <div className="space-y-1">
                <Link to="/items/new" className="text-primary hover:underline block">Report Item (/items/new)</Link>
                <Link to="/items/item-002/edit" className="text-primary hover:underline block">Edit Item (/items/item-002/edit)</Link>
                <Link to="/my-items" className="text-primary hover:underline block">My Items (/my-items)</Link>
              </div>
            </div>

            <div className="p-3 border border-ink bg-paper space-y-2">
              <span className="font-bold text-ink block">Claims Desk</span>
              <div className="space-y-1">
                <Link to="/claims" className="text-primary hover:underline block">All Claims (/claims)</Link>
                <Link to="/claims?tab=made" className="text-primary hover:underline block">Claims Made (/claims?tab=made)</Link>
                <Link to="/claims?tab=received" className="text-primary hover:underline block">Claims Received + Handover (/claims?tab=received)</Link>
              </div>
            </div>

            <div className="p-3 border border-ink bg-paper space-y-2">
              <span className="font-bold text-ink block">Account & Alerts</span>
              <div className="space-y-1">
                <Link to="/notifications" className="text-primary hover:underline block">Notifications (/notifications)</Link>
                <Link to="/profile" className="text-primary hover:underline block">Profile Dossier (/profile)</Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6. ADMIN SUITE ROUTES */}
        <section className="bg-paper border-2 border-ink hard-shadow-4 p-5 space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-ink uppercase tracking-wide flex items-center gap-2 border-b-2 border-ink pb-2">
            <ShieldCheck className="w-5 h-5 text-ink" />
            6. Admin Suite Routes (RequireAdmin Guard)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-meta text-xs">
            <Link to="/admin" className="p-3 border-2 border-ink bg-manila hover:bg-manila-dark block">
              <span className="font-bold text-ink block">Archive Overview</span>
              <span className="text-ink-muted text-[11px]">5 Stat Tickets (/admin)</span>
            </Link>

            <Link to="/admin/verifications" className="p-3 border-2 border-ink bg-manila hover:bg-manila-dark block">
              <span className="font-bold text-ink block">Verifications Queue</span>
              <span className="text-ink-muted text-[11px]">Student ID Audit (/admin/verifications)</span>
            </Link>

            <Link to="/admin/items" className="p-3 border-2 border-ink bg-manila hover:bg-manila-dark block">
              <span className="font-bold text-ink block">Items Ledger</span>
              <span className="text-ink-muted text-[11px]">Master Property Registry (/admin/items)</span>
            </Link>

            <Link to="/admin/claims" className="p-3 border-2 border-ink bg-manila hover:bg-manila-dark block">
              <span className="font-bold text-ink block">Claims Audit</span>
              <span className="text-ink-muted text-[11px]">Disputes & Handover (/admin/claims)</span>
            </Link>

            <Link to="/admin/users" className="p-3 border-2 border-ink bg-manila hover:bg-manila-dark block">
              <span className="font-bold text-ink block">User Accounts</span>
              <span className="text-ink-muted text-[11px]">Directory & Suspension (/admin/users)</span>
            </Link>
          </div>
        </section>

        {/* 7. PUBLIC & 404 ROUTES */}
        <section className="bg-paper border-2 border-ink hard-shadow-4 p-5 space-y-3">
          <h2 className="font-heading font-extrabold text-lg text-ink uppercase tracking-wide flex items-center gap-2 border-b-2 border-ink pb-2">
            <HelpCircle className="w-5 h-5 text-ink" />
            7. Public & 404 Routes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-meta text-xs">
            <Link to="/" className="p-3 border border-ink bg-paper hover:bg-manila block">
              <strong className="block text-ink">Landing Page (/)</strong>
              <span className="text-ink-muted text-[11px]">Hero, sample tags with blur barrier</span>
            </Link>
            <Link to="/how-it-works" className="p-3 border border-ink bg-manila hover:bg-manila-dark block">
              <strong className="block text-ink">How it Works (/how-it-works)</strong>
              <span className="text-ink-muted text-[11px]">Stubs, roles, privacy matrix, FAQ</span>
            </Link>
            <Link to="/login" className="p-3 border border-ink bg-paper hover:bg-manila block">
              <strong className="block text-ink">Login Docket (/login)</strong>
              <span className="text-ink-muted text-[11px]">PublicOnly guard test</span>
            </Link>
            <Link to="/signup" className="p-3 border border-ink bg-paper hover:bg-manila block">
              <strong className="block text-ink">Signup Multi-step (/signup)</strong>
              <span className="text-ink-muted text-[11px]">Roll number, Step 1, Step 2</span>
            </Link>
            <Link to="/not-found-preview" className="p-3 border border-ink bg-paper hover:bg-manila block">
              <strong className="block text-ink">404 Docket (*)</strong>
              <span className="text-ink-muted text-[11px]">Lost property voice</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
