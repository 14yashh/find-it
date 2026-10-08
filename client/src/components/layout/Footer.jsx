import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-paper border-t-2 border-ink hard-shadow-4 py-8 select-none mt-auto">
      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b-2 border-dashed border-ink/40">
          {/* Brand */}
          <div className="space-y-2 md:col-span-2">
            <div className="inline-block font-heading font-extrabold text-base tracking-wider text-ink uppercase border-2 border-ink px-2.5 py-1 bg-manila hard-shadow-2">
              FINDIT // CENTRAL ARCHIVE
            </div>
            <p className="font-sans text-sm text-ink-muted max-w-sm mt-2">
              Official campus property repository and student retrieval index.
              Every verified record is preserved in the physical ledger.
            </p>
            <div className="flex items-center gap-2 font-meta text-xs text-ink-faint">
              <span className="w-2 h-2 rounded-full bg-stamp-found" />
              <span>ARCHIVE DISPATCH LEDGER ACTIVE</span>
            </div>
          </div>

          {/* Ledger Links */}
          <div className="space-y-2 font-meta text-xs">
            <span className="font-bold uppercase tracking-wider text-ink block border-b border-ink/20 pb-1">
              Ledger Desks
            </span>
            <ul className="space-y-1.5 text-ink-muted">
              <li>
                <Link to="/browse" className="hover:text-ink hover:underline">
                  Browse Records
                </Link>
              </li>
              <li>
                <Link to="/items/new" className="hover:text-ink hover:underline">
                  Report Item
                </Link>
              </li>
              <li>
                <Link to="/claims" className="hover:text-ink hover:underline">
                  Claims Registry
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-ink hover:underline">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/dev" className="hover:text-ink text-primary font-bold">
                  Review Index [/dev]
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification Protocol */}
          <div className="space-y-2 font-meta text-xs">
            <span className="font-bold uppercase tracking-wider text-ink block border-b border-ink/20 pb-1">
              Student Protocol
            </span>
            <ul className="space-y-1.5 text-ink-muted">
              <li>Student ID and roll number required</li>
              <li>Admin verified clearance</li>
              <li>Found item verification questions</li>
              <li>Chain-of-custody handovers</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-meta text-xs text-ink-muted">
          <span>
            © {new Date().getFullYear()} FindIt Campus Central Repository. All rights preserved.
          </span>
          <span className="uppercase tracking-widest text-ink-faint">
            ARCHIVE CODE // SEC-12-REG
          </span>
        </div>
      </div>
    </footer>
  );
}
