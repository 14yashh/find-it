import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button.jsx';

export default function EmptyState({
  title = 'No records found',
  message = 'There are no ledger entries matching your current filters.',
  actionLabel,
  onAction,
  icon: Icon = PackageOpen,
  className = '',
}) {
  return (
    <div
      className={`border-2 border-dashed border-ink bg-paper p-8 md:p-12 text-center hard-shadow-2 flex flex-col items-center justify-center max-w-xl mx-auto my-6 ${className}`}
    >
      <div className="p-4 border-2 border-ink bg-manila hard-shadow-2 mb-4">
        <Icon className="w-8 h-8 text-ink stroke-[1.5]" />
      </div>
      <h3 className="font-heading font-bold text-xl text-ink uppercase tracking-wide">
        {title}
      </h3>
      <p className="font-sans text-sm md:text-base text-ink-muted mt-2 max-w-md">
        {message}
      </p>
      {actionLabel && (
        <div className="mt-5">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
