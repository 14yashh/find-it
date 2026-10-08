import React from 'react';

export default function Ticker({ items = [], className = '' }) {
  const defaultItems = [
    'RECORD #TAG-24-089 // DELL CHARGER DEPOSITED AT LIBRARY 2F',
    'RECORD #TAG-24-088 // CALCULATOR RETRIEVED AT AUDITORIUM',
    'LEDGER UPDATE // 42 ITEMS CATALOGUED THIS WEEK',
    'DISPATCH // VERIFIED STUDENT CLAIMS ARE PROCESSING',
    'CAMPUS ARCHIVE // REPORT FOUND BELONGINGS WITHIN 24 HOURS',
  ];

  const displayList = items.length > 0 ? items : defaultItems;

  return (
    <div
      className={`w-full bg-ink text-paper border-y-2 border-ink py-2 overflow-hidden select-none font-meta text-xs tracking-wider uppercase ${className}`}
    >
      <div className="ticker-track flex items-center gap-12 whitespace-nowrap">
        {displayList.concat(displayList).map((text, idx) => (
          <span key={idx} className="flex items-center gap-4">
            <span>{text}</span>
            <span className="text-primary-container font-black">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
