import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams, useLocation } from 'react-router-dom';
import TicketStub from '../components/ui/TicketStub.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Tape from '../components/ui/Tape.jsx';
import { useClaims } from '../hooks/useClaims.js';
import { getErrorMessage } from '../api/errors.js';
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  User,
  Package,
  Calendar,
  AlertCircle,
  Handshake,
  Filter,
} from 'lucide-react';

export default function ClaimsPage({ user }) {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const location = useLocation();

  const isItemClaimsRoute = location.pathname.includes('/items/') && location.pathname.endsWith('/claims');
  const isSingleClaimRoute = location.pathname.startsWith('/claims/') && id;

  const initialTab = (searchParams.get('tab') === 'received' || isItemClaimsRoute) ? 'received' : 'made';
  const [activeTab, setActiveTab] = useState(initialTab); // 'made' | 'received'

  useEffect(() => {
    if (isItemClaimsRoute) {
      setActiveTab('received');
    }
  }, [isItemClaimsRoute]);

  const { claimsMade, claimsReceived, decideClaim, cancelClaim, confirmHandover } = useClaims();

  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [targetClaim, setTargetClaim] = useState(null);
  const [decisionType, setDecisionType] = useState('approve');
  const [decisionNote, setDecisionNote] = useState('');
  const [handoverLoadingId, setHandoverLoadingId] = useState(null);
  const [handoverError, setHandoverError] = useState('');

  // Status filter state
  const [statusFilter, setStatusFilter] = useState(() => {
    const s = searchParams.get('status');
    return ['all', 'pending', 'approved', 'rejected', 'cancelled'].includes(s) ? s : 'all';
  });

  const openDecisionModal = (claim, decision) => {
    setTargetClaim(claim);
    setDecisionType(decision);
    setDecisionNote('');
    setDecisionModalOpen(true);
  };

  const handleConfirmDecision = (e) => {
    e.preventDefault();
    if (!targetClaim) return;

    decideClaim(targetClaim._id, decisionType, decisionNote);
    setDecisionModalOpen(false);
  };

  const handleConfirmHandover = async (claimId) => {
    setHandoverLoadingId(claimId);
    setHandoverError('');
    try {
      await confirmHandover(claimId);
    } catch (err) {
      setHandoverError(getErrorMessage(err));
    } finally {
      setHandoverLoadingId(null);
    }
  };

  const tabClaimsMade = isSingleClaimRoute && id
    ? claimsMade.filter((c) => String(c._id) === String(id))
    : claimsMade;

  const tabClaimsReceived = isItemClaimsRoute && id
    ? claimsReceived.filter((c) => String(c.item?._id || c.item) === String(id))
    : isSingleClaimRoute && id
    ? claimsReceived.filter((c) => String(c._id) === String(id))
    : claimsReceived;

  const activeTabClaims = activeTab === 'made' ? tabClaimsMade : tabClaimsReceived;

  const statusCounts = {
    all: activeTabClaims.length,
    pending: activeTabClaims.filter((c) => c.status === 'pending').length,
    approved: activeTabClaims.filter((c) => c.status === 'approved').length,
    rejected: activeTabClaims.filter((c) => c.status === 'rejected').length,
    cancelled: activeTabClaims.filter((c) => c.status === 'cancelled').length,
  };

  const displayedMade = statusFilter === 'all'
    ? tabClaimsMade
    : tabClaimsMade.filter((c) => c.status === statusFilter);

  const displayedReceived = statusFilter === 'all'
    ? tabClaimsReceived
    : tabClaimsReceived.filter((c) => c.status === statusFilter);

  return (
    <div className="font-sans">

      <section className="bg-manila border-b-2 border-ink px-4 md:px-6 py-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 font-meta text-xs">
              <span className="bg-ink text-paper px-2 py-0.5 uppercase font-bold">
                REQUISITION AUDIT
              </span>
              <span className="text-ink-muted uppercase">CLAIMS RECORD REGISTER</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase text-ink tracking-tight">
              Claims Registry
            </h1>
            <p className="font-sans text-sm md:text-base text-ink-muted mt-0.5">
              Review ownership dispute claims made on your items or inspect the status of your claims.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-2 font-meta text-xs border-2 border-ink bg-paper p-1 hard-shadow-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('made')}
              className={`px-4 py-1.5 font-bold uppercase transition-none ${
                activeTab === 'made' ? 'bg-ink text-paper' : 'text-ink hover:bg-manila'
              }`}
            >
              Claims Made ({claimsMade.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('received')}
              className={`px-4 py-1.5 font-bold uppercase transition-none ${
                activeTab === 'received' ? 'bg-ink text-paper' : 'text-ink hover:bg-manila'
              }`}
            >
              Claims Received ({claimsReceived.length})
            </button>
          </div>
        </div>
      </section>

      {/* Filtered Docket Banner */}
      {isItemClaimsRoute && id && (
        <section className="bg-paper border-b-2 border-ink px-4 md:px-6 py-3">
          <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-meta text-xs">
            <div className="flex items-center gap-2 text-ink font-bold">
              <span className="bg-manila border border-ink px-2 py-0.5">ITEM DOCKET #{id.slice(-6).toUpperCase()}</span>
              <span>Showing claims registered for this specific reported item.</span>
            </div>
            <Link to="/claims?tab=received" className="font-bold underline text-primary hover:text-ink">
              View All Received Claims
            </Link>
          </div>
        </section>
      )}

      {/* Status Filter Bar */}
      <section className="bg-paper border-b-2 border-ink px-4 md:px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-meta text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-ink shrink-0" />
            <span className="font-bold uppercase tracking-wider text-ink">Filter Status:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map(({ id: sId, label }) => {
              const count = statusCounts[sId] ?? 0;
              const isActive = statusFilter === sId;
              return (
                <button
                  key={sId}
                  type="button"
                  onClick={() => setStatusFilter(sId)}
                  className={`px-3 py-1 uppercase font-bold border-2 border-ink transition-none ${
                    isActive
                      ? 'bg-ink text-paper hard-shadow-2'
                      : 'bg-paper text-ink hover:bg-manila'
                  }`}
                >
                  {label} <span className={isActive ? 'text-paper/80' : 'text-ink-muted'}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        {activeTab === 'made' ? (
          /* CLAIMS MADE */
          <div className="space-y-6">
            {displayedMade.length > 0 ? (
              displayedMade.map((claim) => (
                <article
                  key={claim._id}
                  className="bg-paper border-2 border-ink hard-shadow-4 p-6 relative space-y-4"
                >
                  <Tape position="top-right" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-meta text-xs font-bold uppercase bg-manila px-2 py-0.5 border border-ink">
                        DOCKET #{claim._id.slice(-6).toUpperCase()}
                      </span>
                      <h2 className="font-heading text-xl font-bold uppercase text-ink">
                        {claim.item?.title || 'Claimed Property'}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stamp type={claim.status} size="sm" rotate={false} />
                    </div>
                  </div>

                  {/* Claim Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7 space-y-3">
                      <div>
                        <span className="font-meta text-xs font-bold text-ink-muted uppercase block">
                          Your Explanation Message:
                        </span>
                        <p className="font-sans text-sm text-ink bg-paper-light border border-ink p-3 mt-1">
                          "{claim.message}"
                        </p>
                      </div>

                      {claim.answer && (
                        <div>
                          <span className="font-meta text-xs font-bold text-ink-muted uppercase block">
                            Your Verification Answer:
                          </span>
                          <p className="font-sans text-sm text-ink bg-manila/30 border border-ink p-2 mt-1 font-semibold">
                            "{claim.answer}"
                          </p>
                        </div>
                      )}

                      {claim.decisionNote && (
                        <div className="p-3 border border-ink bg-paper-light text-xs font-meta space-y-1">
                          <span className="font-bold uppercase text-ink block">
                            Founder Note:
                          </span>
                          <p className="text-ink-muted">"{claim.decisionNote}"</p>
                        </div>
                      )}
                    </div>

                    {/* Right column: Handover Details if APPROVED */}
                    {/* Prompt requirement: "approved claims show a 'Handover details' ticket with contact info" */}
                    <div className="lg:col-span-5">
                      {claim.status === 'approved' ? (
                        <TicketStub
                          className="bg-manila border-2 border-ink hard-shadow-2 space-y-3"
                          header={
                            <div className="flex items-center gap-2 text-stamp-found font-meta text-xs font-bold uppercase">
                              <CheckCircle className="w-4 h-4" />
                              <span>Handover Details // Clearance Approved</span>
                            </div>
                          }
                        >
                          <p className="font-sans text-xs text-ink">
                            Your claim was approved! You can now contact the founder directly to coordinate physical retrieval.
                          </p>

                          <div className="space-y-2 pt-2 border-t border-dashed border-ink/40 font-meta text-xs">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-ink shrink-0" />
                              <span className="font-bold text-ink">
                                {claim.item?.postedBy?.name} ({claim.item?.postedBy?.department || 'Student'})
                              </span>
                            </div>
                            {claim.item?.postedBy?.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-ink shrink-0" />
                                <a
                                  href={`mailto:${claim.item.postedBy.email}`}
                                  className="underline text-ink font-bold"
                                >
                                  {claim.item.postedBy.email}
                                </a>
                              </div>
                            )}
                            {claim.item?.postedBy?.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-ink shrink-0" />
                                <span className="font-bold text-ink">
                                  {claim.item.postedBy.phone}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Handover Action for Claims Made */}
                          <div className="pt-3 border-t border-dashed border-ink/40 space-y-2">
                            {claim.item?.status === 'returned' || (claim.founderHandoverConfirmed && claim.receiverHandoverConfirmed) ? (
                              <div className="bg-stamp-found/10 border border-stamp-found p-2.5 flex items-center gap-2 font-meta text-xs text-stamp-found font-bold uppercase">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span>Handover Complete — Property Returned</span>
                              </div>
                            ) : claim.item?.type === 'lost' ? (
                              /* Current user claimed a lost item (current user is Finder) */
                              claim.founderHandoverConfirmed ? (
                                <div className="bg-paper-light border border-ink p-2.5 font-meta text-xs text-ink space-y-1">
                                  <div className="font-bold text-stamp-found flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Handover Confirmed by You</span>
                                  </div>
                                  <p className="text-[11px] text-ink-muted">Awaiting the owner to confirm receipt to close the claim docket.</p>
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  <p className="font-meta text-[11px] text-ink-muted">
                                    Met with the owner? Confirm that you handed over the item:
                                  </p>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleConfirmHandover(claim._id)}
                                    disabled={handoverLoadingId === claim._id}
                                    className="w-full flex items-center justify-center gap-1.5"
                                  >
                                    <Handshake className="w-4 h-4" />
                                    <span>{handoverLoadingId === claim._id ? 'Confirming...' : 'Confirm Item Handed Over'}</span>
                                  </Button>
                                </div>
                              )
                            ) : (
                              /* Current user claimed a found item (current user is Receiver) */
                              claim.founderHandoverConfirmed ? (
                                <div className="bg-manila/50 border-2 border-ink p-2.5 space-y-2">
                                  <div className="font-meta text-xs font-bold text-ink">
                                    The finder has confirmed handing over this item to you. Did you receive it?
                                  </div>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleConfirmHandover(claim._id)}
                                    disabled={handoverLoadingId === claim._id}
                                    className="w-full flex items-center justify-center gap-1.5"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{handoverLoadingId === claim._id ? 'Approving...' : 'Confirm Receipt & Complete Handover'}</span>
                                  </Button>
                                </div>
                              ) : (
                                <p className="font-meta text-[11px] text-ink-muted bg-paper-light p-2 border border-ink/30">
                                  Meet the founder in a campus public area. Once they hand over the item and confirm in the app, approve receipt here.
                                </p>
                              )
                            )}

                            {handoverError && handoverLoadingId === claim._id && (
                              <p className="font-meta text-xs text-stamp-rejected">{handoverError}</p>
                            )}
                          </div>
                        </TicketStub>
                      ) : claim.status === 'pending' ? (
                        <div className="border border-ink bg-paper-light p-4 space-y-3">
                          <div className="flex items-center gap-2 text-stamp-pending font-meta text-xs font-bold uppercase">
                            <AlertCircle className="w-4 h-4" />
                            <span>In Review with Founder</span>
                          </div>
                          <p className="font-sans text-xs text-ink-muted">
                            The item founder has been notified. Contact details remain hidden until your claim is approved.
                          </p>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => cancelClaim(claim._id)}
                            className="w-full"
                          >
                            Cancel Claim
                          </Button>
                        </div>
                      ) : (
                        <div className="border border-ink bg-paper-light p-3 font-meta text-xs text-ink-muted">
                          <span>Status: {claim.status.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : tabClaimsMade.length > 0 ? (
              <EmptyState
                title={`No ${statusFilter.toUpperCase()} Claims Found`}
                message={`You have no claims with status "${statusFilter}" in this register.`}
                actionLabel="Show All Claims"
                onAction={() => setStatusFilter('all')}
                icon={FileCheck}
              />
            ) : (
              <EmptyState
                title="No Claims Made"
                message="You haven't filed any ownership claims on open items."
                actionLabel="Browse Available Items"
                onAction={() => window.location.assign('/browse')}
                icon={FileCheck}
              />
            )}
          </div>
        ) : (
          /* CLAIMS RECEIVED */
          <div className="space-y-6">
            {displayedReceived.length > 0 ? (
              displayedReceived.map((claim) => (
                <article
                  key={claim._id}
                  className="bg-paper border-2 border-ink hard-shadow-4 p-6 relative space-y-4"
                >
                  <Tape position="top-right" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-meta text-xs font-bold uppercase bg-manila px-2 py-0.5 border border-ink">
                        CLAIM ON RECORD
                      </span>
                      <h2 className="font-heading text-xl font-bold uppercase text-ink">
                        {claim.item?.title || 'Your Reported Item'}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stamp type={claim.status} size="sm" rotate={false} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7 space-y-3 font-sans text-sm">
                      <div className="flex items-center gap-2 font-meta text-xs text-ink font-bold">
                        <User className="w-4 h-4" />
                        <span>Claimant: {claim.claimant?.name} ({claim.claimant?.department})</span>
                      </div>

                      <div>
                        <span className="font-meta text-xs font-bold text-ink-muted uppercase block">
                          Claim Message:
                        </span>
                        <p className="bg-paper-light border border-ink p-3 mt-1 text-ink">
                          "{claim.message}"
                        </p>
                      </div>

                      {claim.answer && (
                        <div>
                          <span className="font-meta text-xs font-bold text-ink-muted uppercase block">
                            Security Question Answer:
                          </span>
                          <p className="bg-manila/30 border border-ink p-2 mt-1 text-ink font-semibold">
                            "{claim.answer}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right column: Decision Actions or Handover Details */}
                    <div className="lg:col-span-5">
                      {claim.status === 'pending' ? (
                        <div className="bg-manila/50 border-2 border-ink p-4 space-y-3">
                          <span className="font-meta text-xs font-bold uppercase text-ink block">
                            Take Decision on Claim:
                          </span>
                          <p className="font-sans text-xs text-ink-muted">
                            Approving unlocks contact details for both parties and marks your item as claim pending.
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="primary"
                              size="md"
                              onClick={() => openDecisionModal(claim, 'approve')}
                              className="w-full flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Approve</span>
                            </Button>
                            <Button
                              variant="danger"
                              size="md"
                              onClick={() => openDecisionModal(claim, 'reject')}
                              className="w-full flex items-center justify-center gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </Button>
                          </div>
                        </div>
                      ) : claim.status === 'approved' ? (
                        <TicketStub
                          className="bg-manila border-2 border-ink hard-shadow-2 space-y-3"
                          header={
                            <div className="flex items-center gap-2 text-stamp-found font-meta text-xs font-bold uppercase">
                              <CheckCircle className="w-4 h-4" />
                              <span>Handover Details // Claimant Contact</span>
                            </div>
                          }
                        >
                          <p className="font-sans text-xs text-ink">
                            You approved this claim. Coordinate retrieval using the contact details below:
                          </p>
                          <div className="space-y-1.5 pt-2 border-t border-dashed border-ink/40 font-meta text-xs">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-ink shrink-0" />
                              <span className="font-bold text-ink">
                                {claim.claimant?.name}
                              </span>
                            </div>
                            {claim.claimant?.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-ink shrink-0" />
                                <a
                                  href={`mailto:${claim.claimant.email}`}
                                  className="underline text-ink font-bold"
                                >
                                  {claim.claimant.email}
                                </a>
                              </div>
                            )}
                            {claim.claimant?.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-ink shrink-0" />
                                <span className="font-bold text-ink">
                                  {claim.claimant.phone}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Handover Action for Claims Received */}
                          <div className="pt-3 border-t border-dashed border-ink/40 space-y-2">
                            {claim.item?.status === 'returned' || (claim.founderHandoverConfirmed && claim.receiverHandoverConfirmed) ? (
                              <div className="bg-stamp-found/10 border border-stamp-found p-2.5 flex items-center gap-2 font-meta text-xs text-stamp-found font-bold uppercase">
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <span>Handover Complete — Property Returned</span>
                              </div>
                            ) : claim.item?.type === 'found' ? (
                              /* Current user posted a found item (current user is Finder) */
                              claim.founderHandoverConfirmed ? (
                                <div className="bg-paper-light border border-ink p-2.5 font-meta text-xs text-ink space-y-1">
                                  <div className="font-bold text-stamp-found flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Handover Confirmed by You</span>
                                  </div>
                                  <p className="text-[11px] text-ink-muted">Awaiting the claimant to approve receipt to close the claim docket.</p>
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  <p className="font-meta text-[11px] text-ink-muted">
                                    Handed the property over to the verified claimant?
                                  </p>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleConfirmHandover(claim._id)}
                                    disabled={handoverLoadingId === claim._id}
                                    className="w-full flex items-center justify-center gap-1.5"
                                  >
                                    <Handshake className="w-4 h-4" />
                                    <span>{handoverLoadingId === claim._id ? 'Confirming...' : 'Confirm Item Handed Over'}</span>
                                  </Button>
                                </div>
                              )
                            ) : (
                              /* Current user posted a lost item (current user is Receiver) */
                              claim.founderHandoverConfirmed ? (
                                <div className="bg-manila/50 border-2 border-ink p-2.5 space-y-2">
                                  <div className="font-meta text-xs font-bold text-ink">
                                    The finder has confirmed handing over your lost item. Did you receive it?
                                  </div>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleConfirmHandover(claim._id)}
                                    disabled={handoverLoadingId === claim._id}
                                    className="w-full flex items-center justify-center gap-1.5"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{handoverLoadingId === claim._id ? 'Approving...' : 'Confirm Receipt & Complete Handover'}</span>
                                  </Button>
                                </div>
                              ) : (
                                <p className="font-meta text-[11px] text-ink-muted bg-paper-light p-2 border border-ink/30">
                                  Once you meet the finder and they confirm handover in the app, confirm receipt here to resolve.
                                </p>
                              )
                            )}

                            {handoverError && handoverLoadingId === claim._id && (
                              <p className="font-meta text-xs text-stamp-rejected">{handoverError}</p>
                            )}
                          </div>
                        </TicketStub>
                      ) : (
                        <div className="border border-ink bg-paper-light p-3 font-meta text-xs text-ink-muted">
                          Status: {claim.status.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : tabClaimsReceived.length > 0 ? (
              <EmptyState
                title={`No ${statusFilter.toUpperCase()} Claims Received`}
                message={`There are no incoming claims with status "${statusFilter}" on your items.`}
                actionLabel="Show All Claims"
                onAction={() => setStatusFilter('all')}
                icon={FileCheck}
              />
            ) : (
              <EmptyState
                title="No Incoming Claims"
                message="No students have filed ownership claims on your logged items yet."
                actionLabel="Inspect My Items"
                onAction={() => window.location.assign('/my-items')}
                icon={FileCheck}
              />
            )}
          </div>
        )}
      </main>

      {/* DECISION MODAL */}
      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        title={decisionType === 'approve' ? 'Approve Claim Slip' : 'Reject Claim Slip'}
        subtitle={`REQUISITION // ${targetClaim?.item?.title}`}
      >
        <form onSubmit={handleConfirmDecision} className="space-y-4">
          <p className="font-sans text-sm text-ink leading-relaxed">
            {decisionType === 'approve'
              ? 'Approving confirms ownership. Both you and the claimant will receive each other’s contact details to arrange property handover.'
              : 'Rejecting marks this claim invalid. The claimant will be informed with your note.'}
          </p>

          <Textarea
            label="Decision Note (Optional)"
            id="decision-note"
            rows={3}
            value={decisionNote}
            onChange={(e) => setDecisionNote(e.target.value)}
            placeholder="e.g. Verified sticker match; please meet at Library entrance..."
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setDecisionModalOpen(false)}
              className="bg-paper"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={decisionType === 'approve' ? 'primary' : 'danger'}
              size="md"
            >
              {decisionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
