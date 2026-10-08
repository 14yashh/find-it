import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  hint,
  className = '',
  required = false,
  ...props
}) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-meta text-xs md:text-sm font-bold uppercase tracking-wider text-ink"
        >
          {label} {required && <span className="text-stamp-lost">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        className={`w-full px-3 py-2 bg-paper-light text-ink font-sans text-base border-2 border-ink hard-shadow-2 focus:outline-none focus:bg-white focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none transition-none placeholder:text-ink-faint ${
          error ? 'border-stamp-lost ring-1 ring-stamp-lost' : ''
        } ${className}`}
        {...props}
      />
      {hint && !error && (
        <p className="font-meta text-xs text-ink-muted">{hint}</p>
      )}
      {error && (
        <p className="font-meta text-xs font-bold text-stamp-lost">{error}</p>
      )}
    </div>
  );
}
