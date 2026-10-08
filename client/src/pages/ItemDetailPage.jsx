import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Input from '../components/ui/Input.jsx';
import FileDrop from '../components/ui/FileDrop.jsx';
import Tape from '../components/ui/Tape.jsx';
import TagCard from '../components/ui/TagCard.jsx';
import { useItem } from '../hooks/useItem.js';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Tag,
  Package,
  HelpCircle,
  FileCheck2,
  Trash2,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';

export default function ItemDetailPage({
  user,
  variantOverride, // 'found' | 'lost' | 'owner' | 'closed'
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, matches, setItemStatus } = useItem(id);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimAnswer, setClaimAnswer] = useState('');
  const [claimProofFiles, setClaimProofFiles] = useState([]);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  if (!item) return null;

  // Check if current user is owner
  const isOwner =
    variantOverride === 'owner' ||
    (user && item.postedBy && String(user._id) === String(item.postedBy._id));

  // Check if item is open
  const isOpen = variantOverride === 'closed' ? false : item.status === 'open';

  // Effective status
  const effectiveStatus =
    variantOverride === 'closed' ? 'returned' : item.status || 'open';

  // Format date
  const dateFormatted = item.dateOccurred
    ? new Date(item.dateOccurred).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not logged';

  const tagNumber = item.tagNumber || `TAG-${(item._id || '').slice(-6).toUpperCase()}`;

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimMessage) return;
    if (item.type === 'found' && !claimAnswer) return;

    setClaimSubmitted(true);
    setTimeout(() => {
      setClaimSubmitted(false);
      setClaimModalOpen(false);
      navigate('/claims');
    }, 1200);
  };

  const handleMarkReturned = () => {
    setItemStatus('returned');
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      <Navbar variant="student" user={user} />

      {/* Case Registry Toolbar */}
      <section className="border-b-2 border-ink bg-manila px-4 md:px-6 py-2.5">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-meta text-xs">
          <div className="flex items-center gap-3">
            <Link
              to="/browse"
              className="flex items-center gap-1 font-bold text-ink hover:bg-ink hover:text-paper px-2 py-1 border border-ink bg-paper interactive-hard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to The Drawer</span>
            </Link>
            <span className="text-ink font-bold">/</span>
            <span className="font-bold uppercase text-ink">
              CENTRAL ARCHIVE // DOCKET <span className="bg-paper px-1.5 py-0.5 border border-ink">{tagNumber}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto font-meta text-xs">
            <span className="text-ink-muted">STATUS:</span>
            <span className="font-bold uppercase text-ink bg-paper border border-ink px-2 py-0.5">
              {effectiveStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      </section>

      {/* MAIN DETAIL CANVAS */}
      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        <div className="bg-paper border-2 border-ink hard-shadow-6 p-6 sm:p-10 relative">
          <Tape position="top-right" />
          <div className="absolute top-4 left-4 eyelet" />

          {/* Dossier Header */}
          <div className="border-b-2 border-ink pb-6 mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-ink text-paper font-meta text-[11px] px-2 py-0.5 uppercase tracking-wider font-bold">
                  CASE DOSSIER #{tagNumber}
                </span>
                <span className="font-meta text-xs text-ink-muted uppercase">
                  RECORD REGISTRY
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink tracking-tight uppercase mt-2">
                {item.title}
              </h1>
            </div>

            <div className="self-start md:self-center">
              <Stamp
                type={
                  effectiveStatus !== 'open'
                    ? effectiveStatus === 'claim_pending'
                      ? 'claim pending'
                      : effectiveStatus
                    : item.type
                }
                size="lg"
                rotate={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: EVIDENCE IMAGE & ARTIFACT (5 cols) */}
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
                  <span className="uppercase">{item.category?.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Security Verification Question Box (Found items only) */}
              {item.type === 'found' && item.verificationQuestion && (
                <div className="bg-manila border-2 border-ink p-4 hard-shadow-2">
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-ink font-meta text-xs font-bold text-ink uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <span>Founder Security Verification Question</span>
                  </div>
                  <p className="font-sans text-sm font-bold text-ink italic">
                    "{item.verificationQuestion}"
                  </p>
                  <p className="font-meta text-[11px] text-ink-muted mt-2">
                    Claimants must answer this specific question before custody handover.
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: REQUISITION DOSSIER LEDGER (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Description */}
              <div className="bg-paper-light border-2 border-ink p-5 hard-shadow-2">
                <span className="font-meta text-xs font-bold text-ink-muted uppercase tracking-wider block mb-2">
                  Item Description & Particulars
                </span>
                <p className="font-sans text-base text-ink leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Exact Metadata Rows required by Rule 4:
                  "Tag No., Category, Where, When, Posted by (name and department); no custody or staff fields." */}
              <div className="bg-paper border-2 border-ink p-5 hard-shadow-4">
                <h3 className="font-meta text-xs font-extrabold uppercase tracking-widest text-ink pb-2 border-b-2 border-ink mb-3">
                  Archival Specification Record
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
                      <span>Where:</span>
                    </dt>
                    <dd className="font-bold text-ink">{item.location}</dd>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="flex items-center gap-2 text-ink-muted font-bold uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>When:</span>
                    </dt>
                    <dd className="font-bold text-ink">{dateFormatted}</dd>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="flex items-center gap-2 text-ink-muted font-bold uppercase tracking-wider">
                      <User className="w-3.5 h-3.5" />
                      <span>Posted By:</span>
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
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="uppercase tracking-wider">You are the recorder of this property item.</span>
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
                        onClick={() => navigate('/browse')}
                        className="flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Listing</span>
                      </Button>
                    </div>
                  </div>
                ) : !isOpen ? (
                  /* Non-Open Item Notification */
                  <div className="bg-stamp-expired/10 border-2 border-stamp-expired p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-stamp-expired" />
                      <span className="font-meta text-xs md:text-sm font-bold uppercase text-ink">
                        This item is currently {effectiveStatus.replace('_', ' ')} and is not accepting new claims.
                      </span>
                    </div>
                    <Button variant="secondary" size="sm" to="/browse" className="bg-paper">
                      Back
                    </Button>
                  </div>
                ) : (
                  /* Standard Claimant Action */
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setClaimModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    <FileCheck2 className="w-5 h-5" />
                    <span>File Property Claim Slip</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* CROSS-REFERENCED SYSTEM MATCHES (For Owner view or related items) */}
          {matches && matches.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-ink">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="font-meta text-xs font-bold text-primary uppercase tracking-widest block">
                    ARCHIVAL CORRELATION DESK
                  </span>
                  <h2 className="font-heading text-2xl font-bold uppercase text-ink mt-0.5">
                    Cross-Referenced Candidate Matches
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
      </main>

      {/* CLAIM FORM MODAL */}
      {/* Rule 4: "Claim form: message, the item's verification question with an answer field (found items only), optional proof image." */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="File Property Claim Slip"
        subtitle={`REQUISITION DOCKET // ${tagNumber}`}
      >
        {claimSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-12 h-12 text-stamp-found mx-auto" />
            <h3 className="font-heading text-xl font-bold uppercase text-ink">
              Claim Filed Successfully
            </h3>
            <p className="font-meta text-xs text-ink-muted">
              Your claim slip has been recorded and the owner notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleClaimSubmit} className="space-y-4">
            <Textarea
              label="Claim Explanation Message"
              id="claim-message"
              required
              rows={3}
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
              placeholder="Describe when and where you lost this item, identifying details..."
              hint="Be specific about unique markings or contents."
            />

            {item.type === 'found' && (
              <div className="bg-manila/50 border-2 border-ink p-3 space-y-2">
                <span className="font-meta text-xs font-bold uppercase tracking-wider text-ink block">
                  Security Question: "{item.verificationQuestion}"
                </span>
                <Input
                  label="Your Answer"
                  id="claim-answer"
                  required
                  value={claimAnswer}
                  onChange={(e) => setClaimAnswer(e.target.value)}
                  placeholder="Enter your exact answer..."
                  hint="Must match the founder's verification check."
                />
              </div>
            )}

            <FileDrop
              label="Proof Evidence Image (Optional)"
              hint="Purchase receipt, photo of you with the item, serial record..."
              multiple={false}
              files={claimProofFiles}
              onChange={(files) => setClaimProofFiles(files)}
              onRemove={() => setClaimProofFiles([])}
            />

            <div className="pt-2 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setClaimModalOpen(false)}
                className="bg-paper"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="flex items-center gap-1.5"
              >
                <span>Submit Claim Slip</span>
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
