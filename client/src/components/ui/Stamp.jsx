import React from 'react';

export default function Stamp({
  type = 'lost',
  size = 'md',
  rotate = true,
  className = '',
}) {
  const normalized = type.toLowerCase().replace('_', ' ');

  const config = {
    lost: {
      text: 'LOST',
      color: 'text-stamp-lost border-stamp-lost outline-stamp-lost',
      bg: 'bg-white/95',
      defaultRotation: '-rotate-3',
    },
    found: {
      text: 'FOUND',
      color: 'text-stamp-found border-stamp-found outline-stamp-found',
      bg: 'bg-white/95',
      defaultRotation: 'rotate-2',
    },
    returned: {
      text: 'RETURNED',
      color: 'text-stamp-returned border-stamp-returned outline-stamp-returned',
      bg: 'bg-white/95',
      defaultRotation: '-rotate-2',
    },
    'claim pending': {
      text: 'CLAIM PENDING',
      color: 'text-stamp-pending border-stamp-pending outline-stamp-pending',
      bg: 'bg-white/95',
      defaultRotation: 'rotate-3',
    },
    pending: {
      text: 'PENDING',
      color: 'text-stamp-pending border-stamp-pending outline-stamp-pending',
      bg: 'bg-white/95',
      defaultRotation: '-rotate-1',
    },
    expired: {
      text: 'EXPIRED',
      color: 'text-stamp-expired border-stamp-expired outline-stamp-expired',
      bg: 'bg-white/95',
      defaultRotation: 'rotate-1',
    },
    approved: {
      text: 'APPROVED',
      color: 'text-stamp-approved border-stamp-approved outline-stamp-approved',
      bg: 'bg-white/95',
      defaultRotation: '-rotate-2',
    },
    rejected: {
      text: 'REJECTED',
      color: 'text-stamp-rejected border-stamp-rejected outline-stamp-rejected',
      bg: 'bg-white/95',
      defaultRotation: 'rotate-3',
    },
  }[normalized] || {
    text: normalized.toUpperCase(),
    color: 'text-ink border-ink outline-ink',
    bg: 'bg-white/95',
    defaultRotation: 'rotate-0',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5 tracking-wider border outline-[1px] outline-offset-1',
    md: 'text-xs md:text-sm px-2.5 py-1 tracking-widest border-2 outline-[1.5px] outline-offset-2',
    lg: 'text-base md:text-lg px-4 py-1.5 tracking-widest border-2 outline-2 outline-offset-3 font-extrabold',
  }[size] || 'text-xs md:text-sm px-2.5 py-1 tracking-widest border-2 outline-[1.5px] outline-offset-2';

  const rotClass = rotate ? config.defaultRotation : '';

  return (
    <span
      className={`inline-block font-meta font-extrabold uppercase select-none ${config.color} ${config.bg} ${sizeStyles} ${rotClass} ${className}`}
      style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }}
    >
      {config.text}
    </span>
  );
}
