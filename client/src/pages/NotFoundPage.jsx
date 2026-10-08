import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Button from '../components/ui/Button.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import Tape from '../components/ui/Tape.jsx';
import TicketStub from '../components/ui/TicketStub.jsx';
import { HelpCircle, ArrowLeft, Search, FileQuestion } from 'lucide-react';

export default function NotFoundPage({ currentUser }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between">
      <Navbar variant={currentUser ? 'student' : 'public'} currentUser={currentUser} />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-xl relative">
          <Tape text="UNMATCHED PROPERTY LOG ENTRY // 404" position="top-right" />

          <TicketStub className="bg-manila border-2 border-ink hard-shadow-8 p-6 md:p-10 space-y-6 relative overflow-hidden">
            {/* Stamp */}
            <div className="absolute right-4 top-4 select-none opacity-85 rotate-6">
              <Stamp status="expired" text="STATUS: 404 LOST" size="lg" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-meta text-xs uppercase tracking-widest bg-ink text-paper px-2 py-0.5 font-bold">
                  LEDGER MISSING
                </span>
                <span className="font-meta text-xs text-ink-muted font-bold">
                  REF: 404-NOT-FOUND
                </span>
              </div>
              <h1 className="font-heading font-black text-3xl md:text-5xl text-ink uppercase tracking-tight">
                This page got lost too.
              </h1>
            </div>

            <p className="font-sans text-ink text-base md:text-lg leading-relaxed border-l-4 border-ink pl-4 py-1">
              We checked the storage bins, consulted the dispatch ledger, and searched under every lecture bench, but the URL you requested could not be found in our property registry.
            </p>

            <div className="p-4 bg-paper border-2 border-dashed border-ink font-meta text-xs space-y-2">
              <div className="flex items-center gap-2 text-ink font-bold uppercase tracking-wider">
                <FileQuestion className="w-4 h-4 text-ink-muted" />
                Disposition Recommendations
              </div>
              <ul className="list-disc list-inside space-y-1 text-ink-muted">
                <li>Double check the tag number or path in your browser navigation bar.</li>
                <li>The item or log entry may have been purged or archived after 60 days.</li>
                <li>Return to the main campus registry to locate active items.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link to="/browse" className="flex-1">
                <Button variant="primary" className="w-full justify-center">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Active Items
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button variant="secondary" className="w-full justify-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
              </Link>
            </div>
          </TicketStub>
        </div>
      </main>

      <Footer />
    </div>
  );
}
