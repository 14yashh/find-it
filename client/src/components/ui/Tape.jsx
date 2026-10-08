import React from 'react';

export default function Tape({
  position = 'top-left',
  className = '',
}) {
  const positions = {
    'top-left': '-top-2.5 -left-3 rotate-[-30deg]',
    'top-right': '-top-2.5 -right-3 rotate-[30deg]',
    'top-center': '-top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]',
    'bottom-left': '-bottom-2.5 -left-3 rotate-[30deg]',
    'bottom-right': '-bottom-2.5 -right-3 rotate-[-30deg]',
  }[position] || '-top-2.5 -left-3 rotate-[-30deg]';

  return (
    <div
      className={`tape-strip absolute w-10 h-4 bg-manila/80 border border-dashed border-ink/40 shadow-sm pointer-events-none select-none z-20 ${positions} ${className}`}
      aria-hidden="true"
    />
  );
}
