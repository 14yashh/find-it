import React from 'react';
import Stamp from '../ui/Stamp.jsx';
import Button from '../ui/Button.jsx';
import Tape from '../ui/Tape.jsx';
import TagCard from '../ui/TagCard.jsx';
import Modal from '../ui/Modal.jsx';
import Textarea from '../ui/Textarea.jsx';
import FileDrop from '../ui/FileDrop.jsx';
import {
  MapPin,
  Calendar,
  User,
  Tag,
  Package,
  Trash2,
  CheckCircle,
  ShieldAlert,
  AlertTriangle,
  Handshake,
  Search,
  BellRing,
} from 'lucide-react';

export default function LostItemDetail({
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

        {/* Dossier Header - Lost Item Bulletin */}
        <div className="border-b-2 border-ink pb-6 mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-stamp-lost text-paper font-meta text-[11px] px-2.5 py-0.5 uppercase tracking-wider font-bold">
                MISSING PROPERTY BULLETIN // SEARCH IN EFFECT
              </span>
              <span className="font-meta text-xs text-ink-muted uppercase font-bold">
                LOST NOTICE #{tagNumber}
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink tracking-tight uppercase mt-2">
              {item.title}
            </h1>
            <p className="font-meta text-xs text-stamp-lost font-bold flex items-center gap-1.5 pt-1">
              <AlertTriangle className="w-4 h-4" />
              <span>ACTIVE STUDENT SEARCH NOTICE — PLEASE REPORT IF FOUND ON CAMPUS</span>
            </p>
          </div>

          <div className="self-start md:self-center">
            <Stamp
              type={
                effectiveStatus !== 'open'
                  ? effectiveStatus === 'claim_pending'
                    ? 'claim pending'
                    : effectiveStatus
                  : 'lost'
              }
              size="lg"
              rotate={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: EVIDENCE / REFERENCE PHOTO & NOTICE */}
          <div className="lg:col-span-5 space-y-6">
            {/* Reference Image Frame */}
            <div className="relative border-2 border-ink bg-paper-light p-3 hard-shadow-4">
              <Tape position="top-center" />
              <div className="w-full h-72 sm:h-80 bg-paper border-2 border-ink flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="space-y-2">
                    <Search className="w-16 h-16 text-stamp-lost mx-auto stroke-[1.5]" />
                    <span className="block font-meta text-xs font-bold uppercase tracking-wider text-ink">
                      REFERENCE ITEM PHOTO / SKETCH
                    </span>
                    <span className="block font-meta text-[11px] text-ink-muted">
                      Tagged under {item.category?.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-dashed border-ink/40 flex justify-between font-meta text-[11px] text-ink-muted">
                <span>BULLETIN ID: #LOST-{tagNumber}</span>
                <span className="uppercase font-bold text-ink">{item.category?.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Missing Alert Information Box */}
            <div className="bg-paper-light border-2 border-stamp-lost/50 p-4 hard-shadow-2 space-y-2">
              <div className="flex items-center gap-2 font-meta text-xs font-bold text-stamp-lost uppercase tracking-wider">
                <BellRing className="w-4 h-4" />
                <span>Campus Community Assistance Needed</span>
              </div>
              <p className="font-sans text-xs text-ink leading-relaxed">
                If you have seen this item or turned it in to student services, please click below to notify the owner immediately.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: PARTICULAR SPECIFICATION & RECOVERY ACTIONS */}
          <div className="lg:col-span-7 space-y-6">
            {/* Description */}
            <div className="bg-paper-light border-2 border-ink p-5 hard-shadow-2">
              <span className="font-meta text-xs font-bold text-ink-muted uppercase tracking-wider block mb-2">
                Item Description & Circumstances of Loss
              </span>
              <p className="font-sans text-base text-ink leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Metadata Rows */}
            <div className="bg-paper border-2 border-ink p-5 hard-shadow-4">
              <h3 className="font-meta text-xs font-extrabold uppercase tracking-widest text-ink pb-2 border-b-2 border-ink mb-3">
                Missing Property Specifications
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
                    <span>Last Seen At:</span>
                  </dt>
                  <dd className="font-bold text-ink">{item.location}</dd>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <dt className="flex items-center gap-2 text-ink-muted font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Missing Since:</span>
                  </dt>
                  <dd className="font-bold text-ink">{dateFormatted}</dd>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <dt className="flex items-center gap-2 text-ink-muted font-bold uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" />
                    <span>Reported Lost By:</span>
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
                /* Owner View Actions */
                <div className="bg-manila/50 border-2 border-ink p-4 space-y-3">
                  <div className="flex items-center gap-2 font-meta text-xs font-bold text-ink">
                    <span className="w-2.5 h-2.5 rounded-full bg-stamp-lost" />
                    <span className="uppercase tracking-wider">You reported this lost property bulletin.</span>
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
                        <span>Mark as Recovered / Returned</span>
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="md"
                      to={`/items/${item._id}/edit`}
                      className="bg-paper"
                    >
                      Edit Bulletin
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      onClick={handleDeleteItem}
                      className="flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Bulletin</span>
                    </Button>
                  </div>
                </div>
              ) : !isOpen ? (
                /* Non-Open Notification */
                <div className="bg-stamp-expired/10 border-2 border-stamp-expired p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-stamp-expired" />
                    <span className="font-meta text-xs md:text-sm font-bold uppercase text-ink">
                      This lost item is currently {effectiveStatus.replace('_', ' ')} and is no longer active.
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" to="/browse" className="bg-paper">
                    Back
                  </Button>
                </div>
              ) : hasActiveClaim ? (
                /* Active Claim / Match Report Already in Progress (Only 1 allowed at once) */
                <div className="bg-manila border-2 border-ink p-4 hard-shadow-2 space-y-2">
                  <div className="flex items-center gap-2 text-ink font-bold font-meta text-xs uppercase">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    <span>RECOVERY MATCH IN PROGRESS // SINGLE CLAIM PROTOCOL</span>
                  </div>
                  <p className="font-sans text-xs text-ink leading-relaxed">
                    A fellow student has already submitted a found report for this item. The owner is currently reviewing their details. Only one active claim is evaluated at a time.
                  </p>
                </div>
              ) : (
                /* Finder Action - "I Found This Item!" */
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setClaimModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-ink text-paper hover:bg-ink-muted"
                  >
                    <Handshake className="w-5 h-5 text-stamp-found" />
                    <span>I Found This Item! / Report Found Match</span>
                  </Button>
                  <p className="font-meta text-[11px] text-ink-muted">
                    Notify the owner where you found their item and arrange a safe campus handover.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cross-Referenced Found Matches */}
        {matches && matches.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-ink">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="font-meta text-xs font-bold text-primary uppercase tracking-widest block">
                  ARCHIVAL CORRELATION DESK
                </span>
                <h2 className="font-heading text-2xl font-bold uppercase text-ink mt-0.5">
                  Matching Found Items in Repository
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

      {/* Claim Form Modal - Tailored for Lost Items (Finder reporting match) */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Report Found Item to Owner"
        subtitle={`RECOVERY NOTIFICATION // ${tagNumber}`}
      >
        {claimSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-12 h-12 text-stamp-found mx-auto" />
            <h3 className="font-heading text-xl font-bold uppercase text-ink">
              Recovery Notice Sent!
            </h3>
            <p className="font-meta text-xs text-ink-muted">
              The owner has been notified that you found their item.
            </p>
          </div>
        ) : (
          <form onSubmit={handleClaimSubmit} className="space-y-4">
            <div className="bg-manila/50 border border-ink p-3 font-meta text-xs text-ink space-y-1">
              <span className="font-bold uppercase block text-primary">Helper Notice</span>
              <p>Thank you for helping a fellow student recover their belongings! Please describe where you found the item and where it is currently kept.</p>
            </div>

            <Textarea
              label="Where Did You Find It & Current Location"
              id="claim-message"
              required
              rows={3}
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
              placeholder="e.g., Found it under seat in Lecture Hall A. It is currently with me / turned over to Library reception..."
              hint="Provide clear details so the owner can coordinate safe recovery."
            />

            <FileDrop
              label="Photo of Found Item (Optional)"
              hint="Attach a photo of the recovered item to help the owner confirm it's theirs."
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
                <span>{claimLoading ? 'Sending...' : 'Send Recovery Notice to Owner'}</span>
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
