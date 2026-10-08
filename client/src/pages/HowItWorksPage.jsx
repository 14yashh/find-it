import React from 'react';
import { Link } from 'react-router-dom';
import TicketStub from '../components/ui/TicketStub.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import Tape from '../components/ui/Tape.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  UserCheck,
  Shield,
  FileQuestion,
  Search,
  CheckCircle,
  Handshake,
  Users,
  Eye,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export default function HowItWorksPage() {
  const { isAuthenticated } = useAuth();

  const journeySteps = [
    {
      num: '01',
      title: 'Sign Up',
      phase: 'ENTRY',
      desc: 'Sign up with your roll number and an ID photo.',
      icon: UserCheck,
    },
    {
      num: '02',
      title: 'Admin Verification',
      phase: 'AUDIT',
      desc: 'An admin checks your ID against enrollment records.',
      icon: Shield,
    },
    {
      num: '03',
      title: 'Report Property',
      phase: 'LOGGING',
      desc: 'Report what you lost or found (found items need a question only the real owner can answer).',
      icon: FileQuestion,
    },
    {
      num: '04',
      title: 'Browse & Matches',
      phase: 'DISCOVERY',
      desc: 'Browse the central archive and get automatic match suggestions for opposite records.',
      icon: Search,
    },
    {
      num: '05',
      title: 'Submit Claim',
      phase: 'CHALLENGE',
      desc: 'Claim an item: answer the verification question, the finder approves, and only then are contact details shared.',
      icon: CheckCircle,
    },
    {
      num: '06',
      title: 'Safe Handover',
      phase: 'DISPOSITION',
      desc: 'Meet in person, inspect the item, hand it over, and mark the ledger record returned.',
      icon: Handshake,
    },
  ];

  const faqs = [
    {
      q: 'Why are a roll number and ID photo required?',
      a: 'To guarantee that only active, verified students access item details and filing logs. This eliminates outside scrapers, bots, and fraudulent claims.',
    },
    {
      q: 'How long does a post stay active?',
      a: 'All reported items stay open in the archive for 60 days. After 60 days, items automatically transition to expired status.',
    },
    {
      q: 'What do the pending and rejected states mean?',
      a: 'Pending means your ID document is in the administrative review queue. Rejected means the document was blurred, expired, or invalid. Rejected accounts can resubmit a clear photo from the verification docket.',
    },
    {
      q: 'What should I do if I disagree with a claim on my item?',
      a: 'If a claimant answers the verification question incorrectly or you doubt ownership, reject the claim with an optional note. The item remains open for others to claim.',
    },
  ];

  return (
    <div className="font-sans">
      {/* 1. HEADER */}
      <section className="bg-manila border-b-2 border-ink px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="inline-block px-2.5 py-0.5 bg-ink text-paper font-meta text-xs font-bold uppercase tracking-widest mb-3">
            PROTOCOL DIRECTIVE // PROCEDURE GUIDE
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase text-ink tracking-tight">
            How it Works
          </h1>
          <p className="font-sans text-base sm:text-lg text-ink-muted mt-2 max-w-2xl leading-relaxed">
            The physical ledger protocol for campus lost and found property.
          </p>
        </div>
      </section>

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-10 space-y-16">
        {/* 2. THE JOURNEY AS SIX NUMBERED TICKET STUBS */}
        <section className="space-y-6">
          <div className="border-b-2 border-ink pb-3 flex items-center justify-between">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-ink tracking-tight">
              The Six-Step Journey
            </h2>
            <span className="font-meta text-xs text-ink-muted font-bold">STUBS 01–06</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeySteps.map((step) => {
              const Icon = step.icon;
              return (
                <TicketStub
                  key={step.num}
                  className="bg-paper flex flex-col justify-between"
                  header={
                    <div className="flex items-center justify-between">
                      <span className="font-meta text-xs font-bold tracking-wider text-ink">
                        STUB {step.num} // {step.title.toUpperCase()}
                      </span>
                      <span className="font-meta text-[10px] bg-ink text-paper px-2 py-0.5 font-bold uppercase">
                        {step.phase}
                      </span>
                    </div>
                  }
                  footer={
                    <div className="font-meta text-xs text-ink-muted flex justify-between">
                      <span>STEP REFERENCE</span>
                      <span className="font-bold text-ink">#{step.num} OF 06</span>
                    </div>
                  }
                >
                  <div className="w-10 h-10 bg-manila border-2 border-ink flex items-center justify-center mb-3 hard-shadow-2">
                    <Icon className="w-5 h-5 text-ink" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-ink mb-1.5">
                    {step.num}. {step.title}
                  </h3>
                  <p className="font-sans text-sm text-ink leading-relaxed">
                    {step.desc}
                  </p>
                </TicketStub>
              );
            })}
          </div>
        </section>

        {/* 3. WHO DOES WHAT (THREE COLUMNS) */}
        <section className="space-y-6">
          <div className="border-b-2 border-ink pb-3 flex items-center justify-between">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-ink tracking-tight">
              Who Does What
            </h2>
            <span className="font-meta text-xs text-ink-muted font-bold">ROLES & RESPONSIBILITIES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: You */}
            <div className="bg-paper border-2 border-ink p-6 hard-shadow-4 relative">
              <Tape position="top-right" />
              <div className="border-b-2 border-ink pb-3 mb-4">
                <span className="font-meta text-xs font-bold uppercase text-ink-muted block">
                  PARTICIPANT I
                </span>
                <h3 className="font-heading text-xl font-bold uppercase text-ink">You</h3>
              </div>
              <ul className="space-y-2.5 font-sans text-sm text-ink list-disc list-inside">
                <li>Register with your accurate name, roll number, and student ID photo.</li>
                <li>File accurate loss or found slips with true descriptions and dates.</li>
                <li>Answer verification challenge questions when claiming property.</li>
                <li>Attend the agreed physical handover on campus and inspect items.</li>
              </ul>
            </div>

            {/* Column 2: The Finder or Owner */}
            <div className="bg-manila border-2 border-ink p-6 hard-shadow-4 relative">
              <Tape position="top-left" />
              <div className="border-b-2 border-ink pb-3 mb-4">
                <span className="font-meta text-xs font-bold uppercase text-ink-muted block">
                  PARTICIPANT II
                </span>
                <h3 className="font-heading text-xl font-bold uppercase text-ink">
                  The Finder or Owner
                </h3>
              </div>
              <ul className="space-y-2.5 font-sans text-sm text-ink list-disc list-inside">
                <li>Sets the verification question when reporting a found item.</li>
                <li>Reviews incoming claim testimonies and secret answers.</li>
                <li>Approves valid claims (or rejects incorrect answers).</li>
                <li>Coordinates retrieval directly once contact info is released.</li>
                <li>Marks the item status as returned once safely handed over.</li>
              </ul>
            </div>

            {/* Column 3: The Admin */}
            <div className="bg-paper border-2 border-ink p-6 hard-shadow-4 relative">
              <Tape position="top-right" />
              <div className="border-b-2 border-ink pb-3 mb-4">
                <span className="font-meta text-xs font-bold uppercase text-ink-muted block">
                  CUSTODIAL OVERSIGHT
                </span>
                <h3 className="font-heading text-xl font-bold uppercase text-ink">The Admin</h3>
              </div>
              <div className="space-y-3 font-sans text-sm text-ink">
                <p className="font-semibold text-primary">
                  The admin verifies IDs, removes spam and abuse, and can confirm handovers and look into disputes.
                </p>
                <div className="bg-paper-light border border-ink p-3 font-meta text-xs font-bold text-ink-muted">
                  NOTICE: The admin does NOT approve every post or claim. Direct matching and claim resolution happen student-to-student.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. WHO SEES WHAT */}
        <section className="space-y-6">
          <div className="border-b-2 border-ink pb-3 flex items-center justify-between">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-ink tracking-tight">
              Who Sees What
            </h2>
            <span className="font-meta text-xs text-ink-muted font-bold">PRIVACY MATRIX</span>
          </div>

          <div className="bg-paper border-2 border-ink hard-shadow-4 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-paper-light border-2 border-ink hard-shadow-2">
                <div className="font-meta text-xs font-bold uppercase text-stamp-rejected mb-1">
                  ADMINS ONLY
                </div>
                <h3 className="font-heading text-base font-bold text-ink mb-2">
                  ID Photo & Roll Number
                </h3>
                <p className="font-sans text-xs text-ink-muted leading-relaxed">
                  Your uploaded ID card and 7-digit roll number are strictly restricted to admin verification screens. Never shown to other students.
                </p>
              </div>

              <div className="p-4 bg-paper-light border-2 border-ink hard-shadow-2">
                <div className="font-meta text-xs font-bold uppercase text-primary mb-1">
                  APPROVED CLAIM ONLY
                </div>
                <h3 className="font-heading text-base font-bold text-ink mb-2">
                  Contact Details
                </h3>
                <p className="font-sans text-xs text-ink-muted leading-relaxed">
                  Phone and email remain completely hidden until a claim is officially approved. Only the two involved students receive contact information.
                </p>
              </div>

              <div className="p-4 bg-paper-light border-2 border-ink hard-shadow-2">
                <div className="font-meta text-xs font-bold uppercase text-stamp-found mb-1">
                  LOGGED-IN STUDENTS
                </div>
                <h3 className="font-heading text-base font-bold text-ink mb-2">
                  Item Photos
                </h3>
                <p className="font-sans text-xs text-ink-muted leading-relaxed">
                  Visible to verified, logged-in students only. All image metadata and EXIF location data are stripped upon upload.
                </p>
              </div>

              <div className="p-4 bg-paper-light border-2 border-ink hard-shadow-2">
                <div className="font-meta text-xs font-bold uppercase text-ink-muted mb-1">
                  PUBLIC VISITORS
                </div>
                <h3 className="font-heading text-base font-bold text-ink mb-2">
                  No Item Access
                </h3>
                <p className="font-sans text-xs text-ink-muted leading-relaxed">
                  Unauthenticated visitors cannot browse items, inspect photos, or view details. Full ledger entries require campus authentication.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. MEETING SAFELY */}
        <section className="bg-manila border-2 border-ink hard-shadow-6 p-6 sm:p-8 relative">
          <Tape position="top-left" />
          <div className="flex items-center gap-2 mb-2 font-meta text-xs font-bold text-stamp-lost uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>CAMPUS SAFETY ADVISORY</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-ink">
            Meeting Safely
          </h2>
          <p className="font-sans text-base text-ink mt-3 max-w-3xl leading-relaxed">
            When meeting to return or claim property, choose busy, open campus locations such as the <strong>Student Lounge</strong> or <strong>OB Canteen</strong>. Inspect the item thoroughly before completing the handover, and record the return in the system immediately.
          </p>
        </section>

        {/* 6. SHORT FAQ */}
        <section className="space-y-6">
          <div className="border-b-2 border-ink pb-3 flex items-center justify-between">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-ink tracking-tight">
              Frequently Asked Questions
            </h2>
            <span className="font-meta text-xs text-ink-muted font-bold">FACT SHEET</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-paper border-2 border-ink p-5 hard-shadow-2">
                <h3 className="font-heading text-base font-bold text-ink mb-2">
                  {faq.q}
                </h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. CLOSING BUTTONS (HIDDEN FOR LOGGED-IN USERS) */}
        {!isAuthenticated && (
          <section className="border-2 border-ink bg-paper hard-shadow-6 p-8 text-center space-y-4">
            <h2 className="font-heading text-2xl font-bold uppercase text-ink">
              Ready to Join the Campus Archive?
            </h2>
            <p className="font-sans text-sm text-ink-muted max-w-md mx-auto">
              Create an account with your college roll number and student ID photo to begin reporting or claiming lost property.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button variant="primary" size="lg" to="/signup">
                Sign up
              </Button>
              <Button variant="secondary" size="lg" to="/login" className="bg-manila">
                Log in
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
