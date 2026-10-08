import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';

export default function ErrorState({
  title = 'Archive Protocol Error',
  message = 'Failed to load entries from the central repository index.',
  retryLabel = 'Retry dispatch',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`border-2 border-stamp-rejected bg-stamp-rejected/5 p-8 text-center hard-shadow-4 flex flex-col items-center justify-center max-w-xl mx-auto my-6 ${className}`}
    >
      <div className="p-3 border-2 border-stamp-rejected bg-white hard-shadow-2 mb-3">
        <AlertTriangle className="w-8 h-8 text-stamp-rejected" />
      </div>
      <h3 className="font-heading font-bold text-xl text-stamp-rejected uppercase tracking-wider">
        {title}
      </h3>
      <p className="font-meta text-xs md:text-sm text-ink-muted mt-2 max-w-md">
        {message}
      </p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="danger" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
