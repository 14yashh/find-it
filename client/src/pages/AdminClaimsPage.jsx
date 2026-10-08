import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import TicketStub from '../components/ui/TicketStub.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useAdminClaims } from '../hooks/useAdminClaims.js';
import {
  FileCheck2,
  Search,
  ExternalLink,
  CheckCircle,
  XCircle,
  HelpCircle,
  Phone,
  Mail,
  User,
  Package,
  Calendar,
} from 'lucide-react';

export default function AdminClaimsPage({ onLogout }) {
  const { claims: allClaims, handoverClaim, isLoading, isError } = useAdminClaims();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);

  const filteredClaims = allClaims.filter((claim) => {
    if (statusFilter !== 'all' && claim.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = claim._id?.toLowerCase().includes(q);
      const matchTitle = claim.item?.title?.toLowerCase().includes(q);
      const matchTag = claim.item?.tagNumber?.toLowerCase().includes(q);
      const matchClaimant = claim.claimant?.name?.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchTag && !matchClaimant) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
        {/* Filter controls */}
        <div className="bg-paper border-2 border-ink hard-shadow-4 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search claim ID, item tag, claimant name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="w-full sm:w-56">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Claim Statuses' },
                  { value: 'pending', label: 'Status: Pending' },
                  { value: 'approved', label: 'Status: Approved' },
                  { value: 'rejected', label: 'Status: Rejected' },
                  { value: 'cancelled', label: 'Status: Cancelled' },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-meta text-ink-muted border-t border-ink/10 pt-2">
            <span>
              CLAIMS LOGGED: <strong className="text-ink">{filteredClaims.length}</strong> DISPUTES RECORDED
            </span>
            <span>HANDOVER COMPLIANCE: REQUIRED BEFORE CLEARANCE</span>
          </div>
        </div>

        {/* Claims Table */}
        {filteredClaims.length === 0 ? (
          <EmptyState
            title="No Claims Found in Audit Ledger"
            message="No claims match your query or filter parameters."
            icon={FileCheck2}
            actionLabel="Clear Filters"
            onAction={() => {
              setSearch('');
              setStatusFilter('all');
            }}
          />
        ) : (
          <div className="bg-paper border-2 border-ink hard-shadow-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-manila border-b-2 border-ink font-meta text-xs uppercase tracking-wider text-ink select-none">
                    <th className="p-3 border-r border-ink">Claim Ref</th>
                    <th className="p-3 border-r border-ink">Target Item</th>
                    <th className="p-3 border-r border-ink">Claimant Party</th>
                    <th className="p-3 border-r border-ink">Testimony & Proof</th>
                    <th className="p-3 border-r border-ink">Disposition Status</th>
                    <th className="p-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink text-xs font-meta">
                  {filteredClaims.map((claim) => (
                    <tr key={claim._id} className="hover:bg-manila/30 transition-colors">
                      {/* Claim Ref */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <span className="font-bold text-ink block">{claim._id}</span>
                        <span className="text-ink-faint text-[10px] block mt-0.5">
                          {new Date(claim.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Target Item */}
                      <td className="p-3 border-r border-ink align-top max-w-xs">
                        <span className="font-bold text-ink block">{claim.item?.tagNumber}</span>
                        <Link
                          to={`/items/${claim.item?._id}`}
                          className="font-heading font-bold text-sm text-ink hover:underline block truncate"
                        >
                          {claim.item?.title}
                        </Link>
                      </td>

                      {/* Claimant Party */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <span className="font-bold text-ink block">{claim.claimant?.name}</span>
                        <span className="text-ink-muted text-[11px] block">
                          {claim.claimant?.department}
                        </span>
                        {claim.claimant?.email && (
                          <span className="text-ink-faint text-[10px] block truncate max-w-[150px]">
                            {claim.claimant.email}
                          </span>
                        )}
                      </td>

                      {/* Testimony & Proof */}
                      <td className="p-3 border-r border-ink align-top max-w-xs">
                        <p className="text-ink font-sans text-xs line-clamp-2">
                          {claim.message}
                        </p>
                        {claim.answer && (
                          <div className="mt-1 p-1 bg-paper-light border border-ink/40 text-[11px]">
                            <strong className="text-ink">Answer:</strong> {claim.answer}
                          </div>
                        )}
                      </td>

                      {/* Status Stamp */}
                      <td className="p-3 border-r border-ink align-top whitespace-nowrap">
                        <Stamp status={claim.status} size="sm" />
                        {claim.decisionNote && (
                          <p className="text-[10px] text-ink-muted italic mt-1 max-w-[140px] truncate">
                            Note: {claim.decisionNote}
                          </p>
                        )}
                      </td>

                      {/* Details / Modal Action */}
                      <td className="p-3 align-top text-right whitespace-nowrap">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedClaim(claim)}
                          className="text-xs"
                        >
                          Audit Docket
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Claim Audit Detail Modal */}
        <Modal
          isOpen={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
          title={`CLAIM DOSSIER // REF #${selectedClaim?._id || ''}`}
        >
          {selectedClaim && (
            <div className="space-y-6">
              {/* Item Summary Stub */}
              <TicketStub className="bg-manila border-2 border-ink p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-meta text-xs uppercase tracking-wider text-ink-muted font-bold">
                    Target Property
                  </span>
                  <Stamp status={selectedClaim.item?.status || 'open'} size="sm" />
                </div>
                <h4 className="font-heading font-extrabold text-lg text-ink">
                  {selectedClaim.item?.title}
                </h4>
                <div className="flex flex-wrap gap-4 font-meta text-xs text-ink-muted">
                  <span>Tag: <strong>{selectedClaim.item?.tagNumber}</strong></span>
                  <span>Type: <strong className="uppercase">{selectedClaim.item?.type}</strong></span>
                </div>
              </TicketStub>

              {/* Testimony and Answer */}
              <div className="p-4 bg-paper border-2 border-ink hard-shadow-2 space-y-3 font-meta text-xs">
                <div>
                  <span className="font-bold text-ink block uppercase tracking-wider text-[11px]">
                    Claimant Statement
                  </span>
                  <p className="text-ink mt-1 font-sans text-sm bg-paper-light p-2 border border-ink/30">
                    {selectedClaim.message}
                  </p>
                </div>

                {selectedClaim.answer && (
                  <div>
                    <span className="font-bold text-ink block uppercase tracking-wider text-[11px]">
                      Verification Challenge Answer
                    </span>
                    <p className="text-ink mt-1 bg-amber-50 p-2 border border-ink/30 font-bold">
                      {selectedClaim.answer}
                    </p>
                  </div>
                )}
              </div>

              {/* Handover Details Ticket (Revealed if approved) */}
              {selectedClaim.status === 'approved' && (
                <TicketStub className="bg-paper-light border-2 border-dashed border-ink p-4 space-y-2">
                  <div className="flex items-center gap-2 text-stamp-approved font-meta text-xs font-bold uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4" />
                    Handover Authorization Approved
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-meta pt-2">
                    <div className="p-2 bg-paper border border-ink">
                      <span className="font-bold block text-ink">Claimant Contact</span>
                      <p className="text-ink-muted">{selectedClaim.claimant?.name}</p>
                      <p className="text-ink">{selectedClaim.claimant?.email || 'N/A'}</p>
                      <p className="text-ink">{selectedClaim.claimant?.phone || 'N/A'}</p>
                    </div>
                    <div className="p-2 bg-paper border border-ink">
                      <span className="font-bold block text-ink">Depositor Contact</span>
                      <p className="text-ink-muted">{selectedClaim.item?.postedBy?.name || 'N/A'}</p>
                      <p className="text-ink">{selectedClaim.item?.postedBy?.email || 'N/A'}</p>
                      <p className="text-ink">{selectedClaim.item?.postedBy?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </TicketStub>
              )}

              <div className="flex justify-end gap-3 pt-2">
                {selectedClaim.status === 'approved' && selectedClaim.item?.status !== 'returned' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      await handoverClaim(selectedClaim._id);
                      setSelectedClaim({
                        ...selectedClaim,
                        item: { ...selectedClaim.item, status: 'returned' },
                      });
                    }}
                  >
                    Confirm Property Handover
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedClaim(null)}
                >
                  Close Dossier
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
  );
}
