import { Link } from 'react-router-dom';
import StatTicket from '../components/ui/StatTicket.jsx';
import TicketStub from '../components/ui/TicketStub.jsx';
import Button from '../components/ui/Button.jsx';
import Tape from '../components/ui/Tape.jsx';
import { useAdminStats } from '../hooks/useAdminStats.js';
import {
  ShieldCheck,
  Package,
  CheckCircle,
  Users,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function AdminStatsPage() {
  const { stats, loading } = useAdminStats();

  return (
    <div className="space-y-8 max-w-6xl">
        {/* Tape decoration */}
        <div className="relative">
          <Tape text="DAILY METRIC AUDIT // VERIFIED" position="top-right" />
        </div>

        {/* 5 Core Stat Tickets required by specification */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-meta text-xs uppercase tracking-widest text-ink font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-ink inline-block"></span>
              Core System Registers
            </h2>
            <span className="font-meta text-xs text-ink-muted">
              Cycle: FY-2026-Q4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatTicket
              label="Pending Verifications"
              value={stats.pendingVerifications}
              subtext="Awaiting ID audit"
              icon={ShieldCheck}
              className="bg-primary-container/20 border-primary"
            />
            <StatTicket
              label="Open Items"
              value={stats.openItems}
              subtext="Unclaimed in registry"
              icon={Package}
            />
            <StatTicket
              label="Returned Items"
              value={stats.returnedItems}
              subtext="Resolved & handed over"
              icon={CheckCircle}
              className="bg-green-50"
            />
            <StatTicket
              label="Total Users"
              value={stats.totalUsers}
              subtext="Registered accounts"
              icon={Users}
            />
            <StatTicket
              label="Pending Claims"
              value={stats.pendingClaims}
              subtext="Awaiting owner review"
              icon={FileCheck2}
              className="bg-amber-50"
            />
          </div>
        </section>

        {/* Operational Dispatch Links */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Quick Action Station */}
          <TicketStub className="bg-paper border-2 border-ink hard-shadow-4 p-5 space-y-4">
            <div className="border-b-2 border-ink pb-2 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-lg text-ink uppercase tracking-wide">
                Priority Action Queues
              </h3>
              <Clock className="w-4 h-4 text-ink" />
            </div>

            <p className="font-meta text-xs text-ink-muted">
              Immediate attention requested on the following pending records.
            </p>

            <div className="space-y-3 font-meta text-xs">
              <div className="p-3 bg-manila border border-ink flex items-center justify-between">
                <div>
                  <span className="font-bold text-ink block">
                    Student ID Verifications
                  </span>
                  <span className="text-ink-muted text-[11px]">
                    {stats.pendingVerifications} enrollment proofs pending review
                  </span>
                </div>
                <Link to="/admin/verifications">
                  <Button size="sm" variant="primary" className="text-xs">
                    Review Queue <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="p-3 bg-paper-light border border-ink flex items-center justify-between">
                <div>
                  <span className="font-bold text-ink block">
                    Active Claims Awaiting Handover
                  </span>
                  <span className="text-ink-muted text-[11px]">
                    {stats.pendingClaims} claims open across departments
                  </span>
                </div>
                <Link to="/admin/claims">
                  <Button size="sm" variant="secondary" className="text-xs">
                    Audit Claims <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </TicketStub>

          {/* Ledger Health Docket */}
          <TicketStub className="bg-manila border-2 border-ink hard-shadow-4 p-5 space-y-4">
            <div className="border-b-2 border-ink pb-2 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-lg text-ink uppercase tracking-wide">
                Archive Protocol Notes
              </h3>
              <TrendingUp className="w-4 h-4 text-ink" />
            </div>

            <div className="space-y-2.5 font-meta text-xs text-ink">
              <div className="flex items-start gap-2">
                <span className="font-bold text-ink">01.</span>
                <span>
                  All recovered items must be tagged with unique physical barcode labels corresponding to the system Tag Number.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-ink">02.</span>
                <span>
                  Items remaining unclaimed past 60 days enter the institutional archival retention queue.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-ink">03.</span>
                <span>
                  Claims approved by depositors require verified physical handover before status can be marked as RETURNED.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-ink/20 flex items-center justify-between font-meta text-[11px] text-ink-muted">
              <span>LEDGER COMPLIANCE STATUS: ACTIVE</span>
              <span className="font-bold text-stamp-approved">100% AUDITED</span>
            </div>
          </TicketStub>
        </section>
      </div>
  );
}
