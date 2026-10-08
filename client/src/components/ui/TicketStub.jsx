import React from 'react';

export default function TicketStub({
  children,
  className = '',
  notchPosition = 'vertical', // 'vertical' (top/bottom) or 'horizontal' (left/right)
  header,
  footer,
}) {
  return (
    <div
      className={`relative bg-paper border-2 border-ink hard-shadow-4 p-5 overflow-visible ${className}`}
    >
      {/* Notches */}
      {notchPosition === 'vertical' ? (
        <>
          <div className="stub-notch-top" />
          <div className="stub-notch-bottom" />
        </>
      ) : (
        <>
          <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-paper border-r-2 border-ink" />
          <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-paper border-l-2 border-ink" />
        </>
      )}

      {header && (
        <div className="border-b-2 border-dashed border-ink pb-3 mb-4">
          {header}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="border-t-2 border-dashed border-ink pt-3 mt-4">
          {footer}
        </div>
      )}
    </div>
  );
}
