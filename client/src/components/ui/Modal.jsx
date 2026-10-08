import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = '',
  maxWidth = 'max-w-lg',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} bg-paper border-2 border-ink hard-shadow-8 p-6 md:p-8 my-8 select-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-ink pb-4 mb-5">
          <div>
            {title && (
              <h2 className="font-heading font-extrabold text-2xl text-ink uppercase tracking-wide">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-meta text-xs text-ink-muted mt-1 uppercase tracking-wider">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border-2 border-ink bg-paper-light text-ink hard-shadow-2 hover:bg-manila interactive-hard ml-4"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
