import React from 'react';
import Stamp from '../ui/Stamp.jsx';
import Button from '../ui/Button.jsx';
import Tape from '../ui/Tape.jsx';
import TagCard from '../ui/TagCard.jsx';
import Modal from '../ui/Modal.jsx';
import Textarea from '../ui/Textarea.jsx';
import Input from '../ui/Input.jsx';
import FileDrop from '../ui/FileDrop.jsx';
import {
  MapPin,
  Calendar,
  User,
  Tag,
  Package,
  FileCheck2,
  Trash2,
  CheckCircle,
  ShieldAlert,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export default function FoundItemDetail({
  item,
  isOwner,
  isOpen,
  hasActiveClaim,
  effectiveStatus,
  dateFormatted,
  tagNumber,
  matches,
  handleMarkReturned,
  handleDeleteItem,
  navigate,
  // Claim modal props
  claimModalOpen,
  setClaimModalOpen,
  claimMessage,
  setClaimMessage,
  claimAnswer,
  setClaimAnswer,
  claimProofFiles,
  setClaimProofFiles,
  claimSubmitted,
  claimLoading,
  claimError,
  handleClaimSubmit,
}) {
  return (
    <>
      <div className="bg-paper border-2 border-ink hard-shadow-6 p-6 sm:p-10 relative">
        <Tape position="top-right" />
        <div className="absolute top-4 left-4 eyelet" />

        {/* Dossier Header - Found Item */}
        <div className="border-b-2 border-ink pb-6 mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-stamp-found text-paper font-meta text-[11px] px-2.5 py-0.5 uppercase tracking-wider font-bold">
                FOUND PROPERTY DOSSIER // INTAKE DESK
              </span>
              <span className="font-meta text-xs text-ink-muted uppercase font-bold">
                CUSTODY RECORD #{tagNumber}
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink tracking-tight uppercase mt-2">
              {item.title}
            </h1>
            <p className="font-meta text-xs text-stamp-found font-bold flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>LOGGED INTO PHYSICAL REPOSITORY — PROOF OF OWNERSHIP REQUIRED TO CLAIM</span>
            </p>
          </div>

          <div className="self-start md:self-center">
            <Stamp
              type={
                effectiveStatus !== 'open'
                  ? effectiveStatus === 'claim_pending'
                    ? 'claim pending'
                    : effectiveStatus
                  : 'found'
              }
              size="lg"
              rotate={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: EVIDENCE IMAGE & VERIFICATION PLATE */}
          <div className="lg:col-span-5 space-y-6">
            {/* Image Frame */}
            <div className="relative border-2 border-ink bg-paper-light p-3 hard-shadow-4">
              <Tape position="top-center" />
              <div className="w-full h-72 sm:h-80 bg-manila/30 border-2 border-ink flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="space-y-2">
                    <Package className="w-16 h-16 text-ink mx-auto stroke-[1.5]" />
                    <span className="block font-meta text-xs font-bold uppercase tracking-wider text-ink">
                      ARCHIVAL EVIDENCE PHOTO PLATE
                    </span>
                    <span className="block font-meta text-[11px] text-ink-muted">
                      Tagged under {item.category?.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-dashed border-ink/40 flex justify-between font-meta text-[11px] text-ink-muted">
                <span>PLATE ID: #EVID-{tagNumber}</span>
                <span className="uppercase font-bold text-ink">{item.category?.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Founder Verification Question Box */}
            {item.verificationQuestion && (
              <div className="bg-manila border-2 border-ink p-4 hard-shadow-2">
                <div className="flex items-center gap-2 mb-2 pb-1 border-b border-ink font-meta text-xs font-bold text-ink uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Founder Security Verification Check</span>
                </div>
                <p className="font-sans text-sm font-bold text-ink italic">
                  "{item.verificationQuestion}"
                </p>
                <p className="font-meta text-[11px] text-ink-muted mt-2">
                  Claimants must answer this specific question correctly before property release.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PARTICULAR SPECIFICATION & CLAIM ACTIONS */}
          <div className="lg:col-span-7 space-y-6">
            {/* Description */}
            <div className="bg-paper-light border-2 border-ink p-5 hard-shadow-2">
              <span className="font-meta text-xs font-bold text-ink-muted uppercase tracking-wider block mb-2">
                Item Description & Found Particulars
              </span>
              <p className="font-sans text-base text-ink leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Metadata Rows */}
            <div className="bg-paper border-2 border-ink p-5 hard-shadow-4">
              <h3 className="font-meta text-xs font-extrabold uppercase tracking-widest text-ink pb-2 border-b-2 border-ink mb-3">
                Found Property Intake Specifications
              </h3>

              <dl className="divide-y divide-ink/20 font-meta text-xs md:text-sm">
                <div className="py-2.5 flex justify-between items-center">
                  <dt className="flex items-center gap-2 text-ink-muted font-bold uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Tag No.:</span>
                  </dt>
                  <dd className="font-bold text-ink">{tagNumber}</dd>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <dt className="flex items-center gap-2 text-ink-muted font-bold uppercase tracking-wider">
                    <Package className="w-3.5 h-3.5" />
                    <span>Category:</span>
                  </dt>
                  <dd className="font-bold text-ink uppercase">
                    {item.category?.replace('_', ' ')}
                  </dd>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <dt className="flex items-center gap-2 text-ink-muted font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Found At:</span>
                  </dt>
                  <dd className="font-bold text-ink">{item.location}</dd>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <dt className="flex items-center gap-2 text-ink-muted font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Found On:</span>
                  </dt>
                  <dd className="font-bold text-ink">{dateFormatted}</dd>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <dt className="flex items-center gap-2 text-ink-muted font-bold uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" />
                    <span>Secured By Finder:</span>
                  </dt>
                  <dd className="font-bold text-ink">
                    {item.postedBy?.name} ({item.postedBy?.department || 'Student'})
                  </dd>
                </div>
              </dl>
            </div>

            {/* ACTION BUTTONS & VIEW STATES */}
            <div className="pt-2">
              {isOwner ? (
                /* Owner / Founder View */
                <div className="bg-manila/50 border-2 border-ink p-4 space-y-3">
                  <div className="flex items-center gap-2 font-meta text-xs font-bold text-ink">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="uppercase tracking-wider">You are the recorder who found and logged this property.</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {isOpen && (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleMarkReturned}
                        className="flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark as Returned</span>
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="md"
                      to={`/items/${item._id}/edit`}
                      className="bg-paper"
                    >
                      Edit Record
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      onClick={handleDeleteItem}
                      className="flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Listing</span>
                    </Button>
                  </div>
                </div>
              ) : !isOpen ? (
                /* Closed / Returned */
                <div className="bg-stamp-expired/10 border-2 border-stamp-expired p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-stamp-expired" />
                    <span className="font-meta text-xs md:text-sm font-bold uppercase text-ink">
                      This found item is currently {effectiveStatus.replace('_', ' ')} and is no longer accepting claims.
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" to="/browse" className="bg-paper">
                    Back
                  </Button>
                </div>
              ) : hasActiveClaim ? (
                /* Active Claim Already in Progress (Only 1 allowed at once) */
                <div className="bg-manila border-2 border-ink p-4 hard-shadow-2 space-y-2">
                  <div className="flex items-center gap-2 text-ink font-bold font-meta text-xs uppercase">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    <span>CLAIM UNDER REVIEW // SINGLE CLAIM PROTOCOL</span>
                  </div>
                  <p className="font-sans text-xs text-ink leading-relaxed">
                    An active ownership claim is currently in progress for this found item. To prevent conflicting handovers, only one claim is processed at a time.
                  </p>
                </div>
              ) : (
                /* Claimant Action - Claim Found Item */
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setClaimModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    <FileCheck2 className="w-5 h-5" />
                    <span>File Ownership Claim Slip</span>
                  </Button>
                  <p className="font-meta text-[11px] text-ink-muted">
                    You will be prompted to answer the founder's security question and describe the item.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cross-Referenced Matches */}
        {matches && matches.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-ink">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="font-meta text-xs font-bold text-primary uppercase tracking-widest block">
                  ARCHIVAL CORRELATION DESK
                </span>
                <h2 className="font-heading text-2xl font-bold uppercase text-ink mt-0.5">
                  Matching Lost Item Reports
                </h2>
              </div>
              <span className="font-meta text-xs bg-manila border border-ink px-2 py-1 font-bold">
                {matches.length} POSSIBILITIES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matches.slice(0, 3).map((match) => (
                <TagCard key={match._id} item={match} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Claim Form Modal - Tailored for Found Items */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="File Ownership Claim Slip"
        subtitle={`FOUND PROPERTY RECORD // ${tagNumber}`}
      >
        {claimSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-12 h-12 text-stamp-found mx-auto" />
            <h3 className="font-heading text-xl font-bold uppercase text-ink">
              Claim Filed Successfully
            </h3>
            <p className="font-meta text-xs text-ink-muted">
              Your claim slip has been recorded and submitted to the founder for verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleClaimSubmit} className="space-y-4">
            <div className="bg-manila/40 border border-ink p-3 font-meta text-xs text-ink space-y-1">
              <span className="font-bold uppercase block text-primary">Ownership Verification Rule</span>
              <p>Please answer the founder's security question and describe identifying features that prove this item belongs to you.</p>
            </div>

            <Textarea
              label="Describe Your Lost Item & Identifying Details"
              id="claim-message"
              required
              rows={3}
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
              placeholder="Describe distinguishing marks, stickers, serial details, or contents of the item..."
              hint="Be as specific as possible so the founder can confirm ownership."
            />

            {item.verificationQuestion && (
              <div className="bg-manila/60 border-2 border-ink p-3 space-y-2">
                <span className="font-meta text-xs font-bold uppercase tracking-wider text-ink block">
                  Founder's Security Question: "{item.verificationQuestion}"
                </span>
                <Input
                  label="Your Answer"
                  id="claim-answer"
                  required
                  value={claimAnswer}
                  onChange={(e) => setClaimAnswer(e.target.value)}
                  placeholder="Enter your exact answer..."
                  hint="Must match what the founder asked."
                />
              </div>
            )}

            <FileDrop
              label="Proof of Ownership Image (Optional)"
              hint="Receipt, past photo showing you with the item, or serial documentation."
              multiple={false}
              files={claimProofFiles}
              onChange={(files) => setClaimProofFiles(files)}
              onRemove={() => setClaimProofFiles([])}
            />

            {claimError && (
              <div className="border border-stamp-rejected bg-stamp-rejected/10 p-2.5 font-meta text-xs text-stamp-rejected">
                {claimError}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setClaimModalOpen(false)}
                disabled={claimLoading}
                className="bg-paper"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={claimLoading}
                className="flex items-center gap-1.5"
              >
                <span>{claimLoading ? 'Submitting...' : 'Submit Claim Slip'}</span>
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
