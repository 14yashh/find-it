import React from 'react';
import TicketStub from './TicketStub.jsx';

export default function StatTicket({
  label,
  value,
  subtext,
  icon: Icon,
  className = '',
}) {
  return (
    <TicketStub
      className={`bg-paper border-2 border-ink hard-shadow-4 hover:hard-shadow-6 transition-all ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="block font-meta text-xs uppercase tracking-widest text-ink-muted font-bold">
            {label}
          </span>
          <span className="block font-heading font-extrabold text-3xl md:text-4xl text-ink mt-1">
            {value}
          </span>
          {subtext && (
            <p className="font-meta text-xs text-ink-faint mt-1.5">{subtext}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 border-2 border-ink bg-manila hard-shadow-2">
            <Icon className="w-5 h-5 text-ink stroke-[2]" />
          </div>
        )}
      </div>
    </TicketStub>
  );
}
