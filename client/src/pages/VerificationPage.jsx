import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import Button from '../components/ui/Button.jsx';
import FileDrop from '../components/ui/FileDrop.jsx';
import Tape from '../components/ui/Tape.jsx';
import {
  RotateCcw,
  LogOut,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  Clock,
  CheckCircle,
  FileText,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext.jsx';

export default function VerificationPage({
  user,
  onStatusChange,
  onLogout,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, logout, updateVerificationStatus } = useAuth();

  const effectiveUser = user || currentUser || {
    name: 'Alex Chen',
    rollNumber: '2210018',
    email: 'alex.chen@gmail.com',
    department: 'Information Technology',
    year: '2nd Year',
    verificationStatus: 'pending',
    rejectionReason: 'Attached student ID was expired or blurred. Roll number could not be verified.',
  };

  // Allow query param override for instant dev testing: /verification?status=approved|rejected|pending
  const queryStatus = searchParams.get('status');
  const [currentStatus, setCurrentStatus] = useState(
    queryStatus || effectiveUser?.verificationStatus || 'pending'
  );

  const [resubmitFile, setResubmitFile] = useState([]);
  const [resubmitted, setResubmitted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleResubmit = (e) => {
    e.preventDefault();
    if (resubmitFile.length === 0) return;

    setCurrentStatus('pending');
    setResubmitted(true);
    if (onStatusChange) {
      onStatusChange('pending');
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans justify-between">
      <Navbar
        variant={currentStatus === 'approved' ? 'student' : 'pending'}
        user={effectiveUser}
        onLogout={onLogout || logout}
      />

      {/* Top Banner Notice */}
      <aside className="w-full bg-ink text-paper py-2 px-4 md:px-6 border-b-2 border-ink">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-meta gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                currentStatus === 'approved'
                  ? 'bg-stamp-found'
                  : currentStatus === 'rejected'
                  ? 'bg-stamp-rejected'
                  : 'bg-stamp-pending animate-pulse'
              }`}
            />
            <span className="font-bold uppercase tracking-wider">
              {currentStatus === 'approved'
                ? 'CREDENTIAL VERIFIED: FULL ARCHIVE ACCESS GRANTED'
                : currentStatus === 'rejected'
                ? 'CREDENTIAL REJECTED: RESUBMISSION REQUIRED'
                : 'TERMINAL RESTRICTED: IDENTIFICATION IN VERIFICATION QUEUE'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Slip Canvas */}
      <main className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12 flex-1 flex items-center justify-center">
        <article className="relative w-full max-w-2xl bg-manila border-2 border-ink hard-shadow-6 p-6 sm:p-10">
          <Tape position="top-left" />
          <div className="absolute top-4 right-4 eyelet" />

          {/* Header Bar */}
          <div className="border-b-2 border-ink pb-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-meta text-xs uppercase bg-ink text-paper px-1.5 py-0.5 font-bold tracking-wider">
                    FORM DP-402
                  </span>
                  <span className="font-meta text-xs uppercase tracking-widest text-ink-muted font-bold">
                    CAMPUS CENTRAL LEDGER
                  </span>
                </div>
                <h1 className="font-heading text-2xl sm:text-3xl uppercase font-extrabold text-ink mt-2 tracking-tight">
                  Verification Filing Docket
                </h1>
              </div>
              <div className="text-left sm:text-right font-meta text-xs">
                <span className="text-ink-muted block uppercase text-[10px]">Reference No.</span>
                <span className="font-bold text-ink tracking-wider bg-paper border border-ink px-2 py-0.5 inline-block">
                  #VRF-88219-P
                </span>
              </div>
            </div>
          </div>

          {/* STATUS BANNER BASED ON CURRENT STATUS */}
          {currentStatus === 'pending' && (
            <div className="my-6 py-4 px-5 bg-paper border-2 border-ink relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 hard-shadow-2">
              <div className="flex items-start gap-3 z-10">
                <Clock className="w-7 h-7 text-stamp-pending shrink-0 mt-0.5" />
                <div>
                  <span className="font-meta text-xs text-ink-muted uppercase tracking-wider block font-bold">
                    Registry Verification Queue
                  </span>
                  <span className="font-heading text-lg sm:text-xl font-bold text-ink">
                    Your ID is being reviewed
                  </span>
                </div>
              </div>
              <div className="z-10">
                <Stamp type="pending" size="md" rotate={true} />
              </div>
            </div>
          )}

          {currentStatus === 'approved' && (
            <div className="my-6 py-4 px-5 bg-paper border-2 border-stamp-found relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 hard-shadow-2">
              <div className="flex items-start gap-3 z-10">
                <CheckCircle className="w-7 h-7 text-stamp-found shrink-0 mt-0.5" />
                <div>
                  <span className="font-meta text-xs text-stamp-found uppercase tracking-wider block font-bold">
                    Administrative Clearance Granted
                  </span>
                  <span className="font-heading text-lg sm:text-xl font-bold text-ink">
                    Student identity confirmed
                  </span>
                </div>
              </div>
              <div className="z-10">
                <Stamp type="approved" size="md" rotate={true} />
              </div>
            </div>
          )}

          {currentStatus === 'rejected' && (
            <div className="my-6 py-4 px-5 bg-paper border-2 border-stamp-rejected relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 hard-shadow-2">
              <div className="flex items-start gap-3 z-10">
                <AlertOctagon className="w-7 h-7 text-stamp-rejected shrink-0 mt-0.5" />
                <div>
                  <span className="font-meta text-xs text-stamp-rejected uppercase tracking-wider block font-bold">
                    Action Required // Verification Deficient
                  </span>
                  <span className="font-heading text-lg sm:text-xl font-bold text-stamp-rejected">
                    Document was not approved
                  </span>
                </div>
              </div>
              <div className="z-10">
                <Stamp type="rejected" size="md" rotate={true} />
              </div>
            </div>
          )}

          {/* Directives & Rejection Reason Box */}
          {currentStatus === 'pending' && (
            <div className="bg-paper border-2 border-ink p-4 mb-6">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="font-sans text-sm text-ink leading-relaxed">
                  An administrative officer must inspect student credentials before full archival ledger access is granted.
                  You can browse public listings once your docket is marked approved.
                </p>
              </div>
            </div>
          )}

          {currentStatus === 'approved' && (
            <div className="bg-paper border-2 border-stamp-found p-4 mb-6">
              <p className="font-sans text-sm text-ink leading-relaxed">
                Your credentials match institutional enrollment rosters. You may now post lost & found belongings, claim open items, and exchange handover contact information.
              </p>
            </div>
          )}

          {currentStatus === 'rejected' && (
            <div className="space-y-4 mb-6">
              <div className="bg-stamp-rejected/10 border-2 border-stamp-rejected p-4 text-ink">
                <div className="font-meta text-xs font-bold uppercase tracking-wider text-stamp-rejected mb-1">
                  Rejection Reason from Admin Desk:
                </div>
                <p className="font-sans text-sm font-semibold">
                  "{user?.rejectionReason || 'Uploaded document expired or illegible. Matriculation seal was not visible.'}"
                </p>
              </div>

              {/* Resubmission Section */}
              <div className="bg-paper border-2 border-ink p-5 space-y-4">
                <div className="border-b border-ink/20 pb-2">
                  <h3 className="font-heading font-bold text-base uppercase text-ink">
                    Resubmit Verification Document
                  </h3>
                  <p className="font-meta text-xs text-ink-muted">
                    Attach a clearer photo of your current student ID card or tuition fee receipt.
                  </p>
                </div>

                <form onSubmit={handleResubmit} className="space-y-4">
                  <FileDrop
                    label="New Enrolment Proof Document"
                    hint="JPG, PNG, or WebP up to 5 MB"
                    required
                    files={resubmitFile}
                    onChange={(files) => setResubmitFile(files)}
                    onRemove={() => setResubmitFile([])}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={resubmitFile.length === 0}
                    className="w-full"
                  >
                    Resubmit for Admin Review
                  </Button>
                </form>

                {resubmitted && (
                  <p className="font-meta text-xs font-bold text-stamp-found">
                    Document resubmitted! Docket reset to pending review.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Applicant Info Table Manifest */}
          <div className="bg-paper border-2 border-ink mb-6">
            <div className="border-b border-ink bg-manila/50 px-4 py-2 flex items-center justify-between">
              <span className="font-meta text-xs uppercase tracking-wider font-bold text-ink">
                Applicant Identification Manifest
              </span>
              <span className="font-meta text-[11px] text-ink-muted">
                REC: ARCH-2026-ENG
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-ink font-meta text-xs">
              <div className="divide-y divide-ink">
                <div className="p-3">
                  <span className="text-ink-muted block text-[10px] uppercase">Full Legal Name</span>
                  <span className="font-bold text-ink text-sm">{user?.name || effectiveUser.name}</span>
                </div>
                <div className="p-3">
                  <span className="text-ink-muted block text-[10px] uppercase">Roll Number</span>
                  <span className="font-mono font-bold text-ink text-sm">{user?.rollNumber || effectiveUser.rollNumber}</span>
                </div>
                <div className="p-3">
                  <span className="text-ink-muted block text-[10px] uppercase">Email</span>
                  <span className="font-bold text-ink">{user?.email || effectiveUser.email}</span>
                </div>
              </div>
              <div className="divide-y divide-ink">
                <div className="p-3">
                  <span className="text-ink-muted block text-[10px] uppercase">Department & Year</span>
                  <span className="font-bold text-ink">{user?.department || effectiveUser.department} // {user?.year || effectiveUser.year}</span>
                </div>
                <div className="p-3">
                  <span className="text-ink-muted block text-[10px] uppercase">Filing Document</span>
                  <div className="flex items-center gap-1 font-bold text-ink">
                    <FileText className="w-3.5 h-3.5" />
                    <span>student_id_card_scan.webp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t-2 border-dashed border-ink" />
            <span className="absolute bg-manila px-3 font-meta text-[11px] text-ink-muted uppercase tracking-widest font-bold">
              OFFICIAL DISPOSITION DOCKET
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            {currentStatus === 'approved' ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/browse')}
                  className="flex items-center justify-center gap-2 flex-1"
                >
                  <span>Enter Central Ledger</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/items/new')}
                  className="bg-paper"
                >
                  Report Item
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center justify-center gap-2"
                >
                  <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Checking...' : 'Refresh status'}</span>
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onLogout || (() => navigate('/login'))}
                  className="flex items-center justify-center gap-2 bg-paper"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </Button>
              </>
            )}
          </div>

          {/* Slip Bottom Barcode */}
          <div className="mt-8 pt-4 border-t border-ink/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-ink-muted font-meta text-[11px]">
            <span className="font-mono tracking-widest uppercase">||| | ||||| || |||| ||||| |||</span>
            <span className="uppercase tracking-wider">
              REGISTERED CODES: SEC-CLASS-B // AUTH-REQ
            </span>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
