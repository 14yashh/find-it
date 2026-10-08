import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Stamp from './Stamp.jsx';
import { MapPin, Calendar, User, Package } from 'lucide-react';

export default function TagCard({ item, className = '' }) {
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  // Determine stamp type:
  // "Each tag card shows exactly one stamp (LOST or FOUND for open items; CLAIM PENDING, RETURNED or EXPIRED otherwise)."
  let stampType = item.type; // 'lost' | 'found'
  if (item.status && item.status !== 'open') {
    if (item.status === 'claim_pending') stampType = 'claim pending';
    else if (item.status === 'returned') stampType = 'returned';
    else if (item.status === 'expired') stampType = 'expired';
  }

  // Tag number e.g. TAG-24-089
  const tagNumber = item.tagNumber || `TAG-${(item._id || '').slice(-6).toUpperCase()}`;

  // Image handling
  const firstImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;

  // Formatted date
  const dateStr = item.dateOccurred
    ? new Date(item.dateOccurred).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date';

  return (
    <article
      className={`group relative flex flex-col bg-paper border-2 border-ink hard-shadow-4 hover:hard-shadow-6 hover:-translate-y-1 transition-all ${className}`}
    >
      {/* Top Tag Header with Eyelet and String */}
      <div className="relative bg-manila border-b-2 border-ink px-4 py-2.5 flex items-center justify-between">
        {/* Physical Eyelet */}
        <div className="relative flex items-center">
          <div className="eyelet" title="Reinforced tag eyelet" />
          <div className="tag-string" />
          <span className="ml-3 font-meta text-xs font-bold tracking-wider text-ink uppercase">
            {tagNumber}
          </span>
        </div>

        {/* Single Stamp */}
        <div className="z-10">
          <Stamp type={stampType} size="sm" rotate={true} />
        </div>
      </div>

      {/* Item Image with Fallback */}
      <div className="relative w-full h-48 bg-paper-light border-b-2 border-ink overflow-hidden flex items-center justify-center">
        {firstImage && !imgError ? (
          <img
            src={firstImage}
            alt={item.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-ink-muted p-4 text-center">
            <Package className="w-10 h-10 mb-2 stroke-[1.5] text-ink" />
            <span className="font-meta text-xs uppercase tracking-wider font-semibold text-ink">
              Archival Evidence Asset
            </span>
            <span className="font-meta text-[11px] text-ink-faint mt-1">
              {item.category?.replace('_', ' ') || 'Uncatalogued item'}
            </span>
          </div>
        )}

        {/* Category Badge on image corner */}
        <div className="absolute bottom-2 left-2 bg-paper/95 border border-ink px-2 py-0.5 font-meta text-[11px] uppercase font-bold text-ink">
          {item.category?.replace('_', ' ')}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-ink line-clamp-1 group-hover:text-primary transition-colors">
            <Link to={`/items/${item._id}`} className="hover:underline">
              {item.title}
            </Link>
          </h3>
          <p className="font-sans text-sm text-ink-muted line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>

        {/* Metadata Ledger Rows */}
        <div className="border-t border-dashed border-ink/40 pt-3 space-y-1.5 font-meta text-xs text-ink">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-ink shrink-0" />
            <span className="font-bold uppercase tracking-wider text-ink-faint shrink-0">Where:</span>
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-ink shrink-0" />
            <span className="font-bold uppercase tracking-wider text-ink-faint shrink-0">When:</span>
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-ink shrink-0" />
            <span className="font-bold uppercase tracking-wider text-ink-faint shrink-0">Posted:</span>
            <span className="truncate">
              {item.postedBy?.name ? `${item.postedBy.name} (${item.postedBy.department || 'Campus'})` : 'Student'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            to={`/items/${item._id}`}
            className="w-full inline-flex items-center justify-center py-2 px-3 bg-paper-light border-2 border-ink text-ink font-meta text-xs font-bold uppercase tracking-wider hard-shadow-2 hover:bg-manila interactive-hard"
          >
            Inspect Record →
          </Link>
        </div>
      </div>
    </article>
  );
}
