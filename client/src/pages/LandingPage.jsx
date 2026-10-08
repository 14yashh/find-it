import React from 'react';
import { Link } from 'react-router-dom';
import Ticker from '../components/ui/Ticker.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import TicketStub from '../components/ui/TicketStub.jsx';
import Button from '../components/ui/Button.jsx';
import Tape from '../components/ui/Tape.jsx';
import {
  Search,
  PackagePlus,
  ShieldCheck,
  Lock,
  Edit3,
  GitCompare,
  KeyRound,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="font-sans">

      {/* HERO SECTION */}
      <main className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-paper border-2 border-ink hard-shadow-6 p-6 sm:p-10 relative">
          {/* Institutional Corner Tab */}
          <div className="absolute top-0 right-0 bg-manila border-b-2 border-l-2 border-ink px-3 py-1 font-meta text-xs font-bold tracking-wider">
            REGISTER CODE // SEC-12-REG
          </div>

          {/* Left Column (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 border-2 border-ink bg-manila px-3 py-1 w-fit hard-shadow-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-meta text-xs font-bold tracking-widest uppercase">
                CAMPUS PROPERTY REPOSITORY // PUBLIC DESK
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-ink">
                Lost something on campus?
              </h1>
              <p className="font-meta text-base sm:text-lg text-secondary font-bold tracking-tight">
                We've got a drawer for that.
              </p>
            </div>

            <p className="font-sans text-base sm:text-lg text-ink max-w-[500px] leading-relaxed">
              Physical ledger meets student intranet. Check verified intake logs, claim your missing gear, or log what you stumbled across between lectures.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                to="/browse?type=lost"
                className="flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span>I lost something</span>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                to="/login"
                className="flex items-center gap-2 bg-manila"
              >
                <PackagePlus className="w-5 h-5" />
                <span>I found something</span>
              </Button>
            </div>

            {/* Sub-verification memo */}
            <div className="pt-4 border-t-2 border-dashed border-ink/40 flex flex-wrap items-center gap-3 font-meta text-xs text-ink-muted font-bold">
              <span className="flex items-center gap-1 text-ink">
                <ShieldCheck className="w-4 h-4 text-stamp-found" />
                CAMPUS DISPOSITION DIV.
              </span>
              <span>•</span>
              <span>ROOM 102 STUDENT SERVICES</span>
              <span>•</span>
              <span>HOURS: 08:00 – 17:30</span>
            </div>
          </div>

          {/* Right Column: Stack of Physical Luggage Tag Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-6 min-h-[460px]">
            {/* Manila Backing Board */}
            <div className="w-full max-w-[440px] h-[460px] relative">
              <div className="absolute inset-0 bg-manila border-2 border-ink hard-shadow-4 -rotate-1 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between font-meta text-xs opacity-60 font-bold">
                  <span>MANIFEST ARCHIVE #104</span>
                  <span>INDEX: NORTH-QUAD</span>
                </div>
                <div className="border-b border-dashed border-ink/40 w-full" />
                <div className="border-b border-dashed border-ink/40 w-full" />
                <div className="border-b border-dashed border-ink/40 w-full" />
                <div className="font-meta text-[11px] text-right opacity-60 font-bold">
                  STATION RECEIPT LOG // PHYSICAL COPY
                </div>
              </div>

              {/* Tag 3: Casio Calculator (Lost) */}
              <div className="absolute left-4 top-8 w-[320px] sm:w-[350px] bg-paper border-2 border-ink hard-shadow-4 -rotate-3 p-4 hover:rotate-0 hover:z-30 transition-all">
                <Tape position="top-right" />
                <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-ink">
                  <div className="flex items-center gap-2">
                    <div className="eyelet" />
                    <span className="font-meta text-xs font-bold text-ink">TAG #0425-M</span>
                  </div>
                  <span className="font-meta text-xs text-ink-muted">14 OCT 11:20</span>
                </div>
                <div className="mt-3 flex gap-3">
                  <div className="w-16 h-16 bg-paper-light border-2 border-ink shrink-0 flex items-center justify-center font-meta text-xs font-bold">
                    [EVID]
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-sm font-bold text-ink">
                      Casio scientific calculator
                    </h4>
                    <p className="font-meta text-xs text-ink-muted">Model fx-991EX</p>
                    <p className="font-meta text-xs text-ink font-semibold mt-1">
                      LOC: Science Concourse L2
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-meta text-[11px] text-ink-muted">LOGGED BY: S. Vance</span>
                  <Stamp type="lost" size="sm" rotate={true} />
                </div>
              </div>

              {/* Tag 2: HP Laptop Bag (Claim Pending) */}
              <div className="absolute left-8 top-28 w-[320px] sm:w-[350px] bg-manila border-2 border-ink hard-shadow-4 rotate-3 p-4 hover:rotate-0 hover:z-30 transition-all z-10">
                <Tape position="top-left" />
                <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-ink">
                  <div className="flex items-center gap-2">
                    <div className="eyelet" />
                    <span className="font-meta text-xs font-bold text-ink">TAG #0426-B</span>
                  </div>
                  <span className="font-meta text-xs text-ink-muted">15 OCT 14:05</span>
                </div>
                <div className="mt-3 flex gap-3">
                  <div className="w-16 h-16 bg-paper-light border-2 border-ink shrink-0 flex items-center justify-center font-meta text-xs font-bold">
                    [EVID]
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-sm font-bold text-ink">
                      Blue HP laptop bag
                    </h4>
                    <p className="font-meta text-xs text-ink-muted">Includes charger cord</p>
                    <p className="font-meta text-xs text-ink font-semibold mt-1">
                      LOC: OB Canteen
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-meta text-[11px] text-ink-muted">DESK: R. Davis</span>
                  <Stamp type="claim pending" size="sm" rotate={true} />
                </div>
              </div>

              {/* Tag 1: JBL Earbuds (Found) */}
              <div className="absolute left-10 top-48 w-[320px] sm:w-[350px] bg-paper-light border-2 border-ink hard-shadow-6 -rotate-2 p-4 hover:rotate-0 hover:z-30 transition-all z-20">
                <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-ink">
                  <div className="flex items-center gap-2">
                    <div className="eyelet" />
                    <span className="font-meta text-xs font-bold text-ink">TAG #0427-E</span>
                  </div>
                  <span className="font-meta text-xs text-ink-muted">16 OCT 09:42</span>
                </div>
                <div className="mt-3 flex gap-3">
                  <div className="w-16 h-16 bg-manila border-2 border-ink shrink-0 flex items-center justify-center font-meta text-xs font-bold">
                    [EVID]
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-sm font-bold text-ink">
                      Black JBL earbuds
                    </h4>
                    <p className="font-meta text-xs text-ink-muted">Matte case with clip</p>
                    <p className="font-meta text-xs text-ink font-semibold mt-1">
                      LOC: Main Library 2nd Fl
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-meta text-[11px] text-ink-muted">VERIFIED INTAKE UNIT</span>
                  <Stamp type="found" size="sm" rotate={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SCROLLING TICKER STRIP */}
      <Ticker />

      {/* HOW IT WORKS SECTION // 3-STEP DISPOSITION */}
      <section className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-12 md:py-16" id="how-it-works">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b-2 border-ink pb-4 gap-4">
          <div>
            <div className="font-meta text-xs font-bold tracking-widest text-primary uppercase mb-1">
              OPERATIONAL DIRECTIVE // 3-STEP DISPOSITION
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-ink tracking-tight uppercase">
              How the System Works
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/how-it-works"
              className="font-meta text-xs font-bold uppercase text-primary hover:underline flex items-center gap-1"
            >
              <span>Read the full guide</span>
              <span>→</span>
            </Link>
            <div className="font-meta text-xs text-ink-muted font-bold hidden sm:block">
              CAMPUS CENTRAL LEDGER PROTOCOL
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* STUB 01 */}
          <TicketStub
            className="bg-manila flex flex-col justify-between"
            header={
              <div className="flex items-center justify-between">
                <span className="font-meta text-xs font-bold tracking-wider text-ink">
                  STUB 01 // REPORT
                </span>
                <span className="font-meta text-[10px] bg-ink text-paper px-2 py-0.5 font-bold uppercase">
                  PHASE I
                </span>
              </div>
            }
            footer={
              <div className="font-meta text-xs text-ink-muted flex justify-between">
                <span>CLASSIFICATION</span>
                <span className="font-bold text-ink">ENTRY LOG</span>
              </div>
            }
          >
            <div className="w-12 h-12 bg-paper border-2 border-ink flex items-center justify-center mb-4 hard-shadow-2">
              <Edit3 className="w-6 h-6 text-ink" />
            </div>
            <h3 className="font-heading text-xl font-bold text-ink mb-2">
              File Intake or Loss Slip
            </h3>
            <p className="font-sans text-sm text-ink leading-relaxed">
              File a digital missing slip or hand in found items at verified campus stations. Describe the item, attach photos, and record the exact location.
            </p>
          </TicketStub>

          {/* STUB 02 */}
          <TicketStub
            className="bg-paper flex flex-col justify-between"
            header={
              <div className="flex items-center justify-between">
                <span className="font-meta text-xs font-bold tracking-wider text-ink">
                  STUB 02 // MATCH
                </span>
                <span className="font-meta text-[10px] bg-ink text-paper px-2 py-0.5 font-bold uppercase">
                  PHASE II
                </span>
              </div>
            }
            footer={
              <div className="font-meta text-xs text-ink-muted flex justify-between">
                <span>RECONCILIATION</span>
                <span className="font-bold text-ink">INDEX CORRELATION</span>
              </div>
            }
          >
            <div className="w-12 h-12 bg-manila border-2 border-ink flex items-center justify-center mb-4 hard-shadow-2">
              <GitCompare className="w-6 h-6 text-ink" />
            </div>
            <h3 className="font-heading text-xl font-bold text-ink mb-2">
              Cross-Reference Logs
            </h3>
            <p className="font-sans text-sm text-ink leading-relaxed">
              Registry cross-references intake tags, dates, and campus concourse logs. Potential matches notify verified students immediately.
            </p>
          </TicketStub>

          {/* STUB 03 */}
          <TicketStub
            className="bg-manila flex flex-col justify-between"
            header={
              <div className="flex items-center justify-between">
                <span className="font-meta text-xs font-bold tracking-wider text-ink">
                  STUB 03 // COLLECT
                </span>
                <span className="font-meta text-[10px] bg-ink text-paper px-2 py-0.5 font-bold uppercase">
                  PHASE III
                </span>
              </div>
            }
            footer={
              <div className="font-meta text-xs text-ink-muted flex justify-between">
                <span>FINAL DISPOSITION</span>
                <span className="font-bold text-ink">CHAIN CLOSED</span>
              </div>
            }
          >
            <div className="w-12 h-12 bg-primary-container border-2 border-ink flex items-center justify-center mb-4 hard-shadow-2">
              <KeyRound className="w-6 h-6 text-ink" />
            </div>
            <h3 className="font-heading text-xl font-bold text-ink mb-2">
              Desk Handover & Release
            </h3>
            <p className="font-sans text-sm text-ink leading-relaxed">
              Answer the security verification question, confirm owner contact, sign the digital handover slip, and recover your property.
            </p>
          </TicketStub>
        </div>
      </section>

      {/* VERIFIED STUDENTS ONLY DOSSIER */}
      <section className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <div className="border-2 border-ink bg-manila hard-shadow-6 p-6 sm:p-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Description (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Stamp type="approved" size="sm" rotate={false} />
                <span className="font-meta text-xs font-bold text-ink uppercase tracking-wider">
                  SYSTEM AUDIT // RESTRICTED ACCESS
                </span>
              </div>

              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-ink leading-tight">
                Verified Students Only. No bots, no scammers.
              </h2>

              <p className="font-sans text-base text-ink leading-relaxed max-w-xl">
                Every single account is vetted against student enrollment records with a student ID and roll number. No scraped marketplace listings or unauthorized claims.
              </p>

              <div className="space-y-2.5 font-sans text-sm font-semibold text-ink pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-ink bg-paper flex items-center justify-center hard-shadow-2">
                    <Check className="w-4 h-4 text-ink" />
                  </div>
                  <span>Student ID and roll number with admin credential verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-ink bg-paper flex items-center justify-center hard-shadow-2">
                    <Check className="w-4 h-4 text-ink" />
                  </div>
                  <span>Strict verification questions on found property claims</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-ink bg-paper flex items-center justify-center hard-shadow-2">
                    <Check className="w-4 h-4 text-ink" />
                  </div>
                  <span>Private contact exchange only upon approved claim decision</span>
                </div>
              </div>
            </div>

            {/* Right: Graphic ID Card Dossier (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[360px] bg-paper border-2 border-ink hard-shadow-4 p-5 relative rotate-1">
                <Tape position="top-right" />
                <div className="flex justify-between items-start border-b-2 border-ink pb-3">
                  <div>
                    <p className="font-meta text-xs font-extrabold uppercase tracking-widest text-ink">
                      STUDENT IDENTIFICATION
                    </p>
                    <p className="font-meta text-[11px] text-ink-muted">
                      REGISTRY VALIDATION CARD
                    </p>
                  </div>
                  <div className="w-8 h-8 border-2 border-ink bg-manila flex items-center justify-center font-meta text-xs font-bold">
                    ID
                  </div>
                </div>

                <div className="my-4 flex gap-4">
                  <div className="w-20 h-24 border-2 border-ink bg-paper-light flex items-center justify-center font-meta text-xs text-ink-faint">
                    [PHOTO]
                  </div>
                  <div className="flex-1 space-y-1 font-meta text-xs">
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase">STUDENT NAME</span>
                      <span className="font-bold text-ink">MARSHALL, JORDAN K.</span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase">ROLL NUMBER</span>
                      <span className="font-mono font-bold text-ink">2110042</span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase">DEPARTMENT</span>
                      <span className="font-bold text-ink">COMPUTER ENGINEERING</span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase">CLEARANCE</span>
                      <span className="text-stamp-found font-bold">ACTIVE REGISTRY</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t-2 border-dashed border-ink flex items-center justify-between">
                  <Stamp type="approved" size="sm" rotate={false} />
                  <span className="font-meta text-[10px] text-ink-muted">CAMPUS RECORD #9028-A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLURRED SAMPLE TAG CARDS WITH OVERLAY SHIELD */}
      <section className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between border-b-2 border-ink pb-4 gap-2">
          <div>
            <div className="font-meta text-xs font-bold tracking-widest text-primary uppercase mb-1">
              CENTRAL REPOSITORY ARCHIVE VAULT
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-ink uppercase tracking-tight">
              Recent Logbook Entries
            </h2>
          </div>
          <p className="font-meta text-xs text-ink-muted font-bold">
            Latest physical intake from the campus floor.
          </p>
        </div>

        {/* Container with Blurred Cards and Privacy Overlay */}
        <div className="relative border-2 border-ink p-6 sm:p-8 bg-paper hard-shadow-6 overflow-hidden">
          {/* Blurred Background Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none pointer-events-none filter blur-[5px] opacity-40">
            <div className="bg-manila border-2 border-ink p-4 hard-shadow-2">
              <div className="flex justify-between items-center pb-2 border-b border-ink">
                <span className="font-meta text-xs font-bold">TAG #0424-K</span>
                <Stamp type="found" size="sm" />
              </div>
              <div className="h-28 my-3 bg-paper border border-ink flex items-center justify-center font-meta text-xs">
                [Locker Keys]
              </div>
              <h4 className="font-heading text-sm font-bold">Brass locker key bunch</h4>
              <p className="font-meta text-xs text-ink-muted">Gym Bleachers Row</p>
            </div>

            <div className="bg-paper border-2 border-ink p-4 hard-shadow-2">
              <div className="flex justify-between items-center pb-2 border-b border-ink">
                <span className="font-meta text-xs font-bold">TAG #0423-B</span>
                <Stamp type="lost" size="sm" />
              </div>
              <div className="h-28 my-3 bg-paper-light border border-ink flex items-center justify-center font-meta text-xs">
                [Backpack]
              </div>
              <h4 className="font-heading text-sm font-bold">Olive green backpack</h4>
              <p className="font-meta text-xs text-ink-muted">Lecture Hall A</p>
            </div>

            <div className="bg-manila border-2 border-ink p-4 hard-shadow-2">
              <div className="flex justify-between items-center pb-2 border-b border-ink">
                <span className="font-meta text-xs font-bold">TAG #0422-H</span>
                <Stamp type="found" size="sm" />
              </div>
              <div className="h-28 my-3 bg-paper border border-ink flex items-center justify-center font-meta text-xs">
                [Hydro Flask]
              </div>
              <h4 className="font-heading text-sm font-bold">Yellow Hydro Flask</h4>
              <p className="font-meta text-xs text-ink-muted">Science Lab Bench 4</p>
            </div>

            <div className="bg-paper border-2 border-ink p-4 hard-shadow-2">
              <div className="flex justify-between items-center pb-2 border-b border-ink">
                <span className="font-meta text-xs font-bold">TAG #0421-U</span>
                <Stamp type="claim pending" size="sm" />
              </div>
              <div className="h-28 my-3 bg-paper-light border border-ink flex items-center justify-center font-meta text-xs">
                [Umbrella]
              </div>
              <h4 className="font-heading text-sm font-bold">Black compact umbrella</h4>
              <p className="font-meta text-xs text-ink-muted">Main Library Atrium</p>
            </div>
          </div>

          {/* OVERLAY PAPER SHIELD BANNER */}
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-paper/30 backdrop-blur-xs">
            <div className="max-w-[500px] w-full bg-paper border-2 border-ink hard-shadow-6 p-6 sm:p-8 text-center relative z-20">
              <Tape position="top-center" />
              <div className="w-12 h-12 bg-manila border-2 border-ink mx-auto mb-3 flex items-center justify-center hard-shadow-2">
                <Lock className="w-6 h-6 text-ink" />
              </div>

              <div className="stamp-badge text-ink border-ink outline-ink mb-3 -rotate-1 text-[11px]">
                ARCHIVAL PRIVACY RESTRICTION
              </div>

              <h3 className="font-heading text-2xl font-extrabold text-ink tracking-tight mb-2 uppercase">
                Log In to Browse Full Archive
              </h3>

              <p className="font-sans text-sm text-ink leading-relaxed mb-6">
                Active student credentials are required to view full item serials, locations, and filing dossiers. Prevents fraudulent claims on unattended campus items.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="primary" size="md" to="/login" className="w-full sm:w-auto">
                  Log In With Student ID
                </Button>
                <Button variant="secondary" size="md" to="/signup" className="w-full sm:w-auto bg-manila">
                  Create Account
                </Button>
              </div>

              <p className="font-meta text-[11px] text-ink-muted mt-4">
                CAMPUS CENTRAL DISPOSITION PROTOCOL § 18-C
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
