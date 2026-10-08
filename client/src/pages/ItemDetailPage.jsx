import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useItem } from '../hooks/useItem.js';
import { useAuth } from '../context/AuthContext.jsx';
import { createClaim, markItemReturned, deleteItem } from '../api/items.js';
import { getErrorMessage } from '../api/errors.js';
import FoundItemDetail from '../components/items/FoundItemDetail.jsx';
import LostItemDetail from '../components/items/LostItemDetail.jsx';
import { ArrowLeft } from 'lucide-react';

export default function ItemDetailPage({
  user,
  variantOverride,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { item, matches, setItemStatus, refetch } = useItem(id);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimAnswer, setClaimAnswer] = useState('');
  const [claimProofFiles, setClaimProofFiles] = useState([]);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');

  if (!item) return null;

  // Derive owner: use real currentUser, fall back to prop
  const effectiveUser = currentUser || user;
  const isOwner =
    variantOverride === 'owner' ||
    (effectiveUser && item?.postedBy && String(effectiveUser._id) === String(item.postedBy._id));

  // Check if item is open
  const isOpen = variantOverride === 'closed' ? false : item.status === 'open';

  // Check if item already has an active claim (Only one claim allowed at once)
  const hasActiveClaim = Boolean(item.hasActiveClaim || item.status === 'claim_pending');

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

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimMessage) return;
    if (item.type === 'found' && !claimAnswer) return;

    setClaimLoading(true);
    setClaimError('');
    try {
      const fd = new FormData();
      fd.append('message', claimMessage);
      if (item.type === 'found') fd.append('answer', claimAnswer);
      claimProofFiles.forEach((file) => {
        if (file instanceof File) fd.append('proof', file);
      });
      await createClaim(id, fd);
      setClaimSubmitted(true);
      setTimeout(() => {
        setClaimSubmitted(false);
        setClaimModalOpen(false);
        navigate('/claims');
      }, 1200);
    } catch (err) {
      setClaimError(getErrorMessage(err));
    } finally {
      setClaimLoading(false);
    }
  };

  const handleMarkReturned = async () => {
    try {
      await markItemReturned(id);
      setItemStatus('returned');
      if (refetch) refetch();
    } catch (err) {
      console.warn('Mark returned failed:', getErrorMessage(err));
    }
  };

  const handleDeleteItem = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this listing? This cannot be undone.')) return;
    try {
      await deleteItem(id);
      navigate('/my-items');
    } catch (err) {
      console.warn('Delete item failed:', getErrorMessage(err));
    }
  };

  const commonProps = {
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
  };

  return (
    <div className="font-sans">
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

      {/* MAIN DETAIL CANVAS: Distinct Views for Lost vs Found */}
      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 w-full flex-1">
        {item.type === 'lost' ? (
          <LostItemDetail {...commonProps} />
        ) : (
          <FoundItemDetail {...commonProps} />
        )}
      </main>
    </div>
  );
}
