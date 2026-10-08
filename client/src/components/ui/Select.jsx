import React from 'react';

export default function Select({
  label,
  id,
  options = [],
  error,
  hint,
  className = '',
  required = false,
  children,
  ...props
}) {
  const selectId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block font-meta text-xs md:text-sm font-bold uppercase tracking-wider text-ink"
        >
          {label} {required && <span className="text-stamp-lost">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          required={required}
          className={`w-full px-3 py-2 bg-paper-light text-ink font-sans text-base border-2 border-ink hard-shadow-2 appearance-none focus:outline-none focus:bg-white focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none transition-none cursor-pointer pr-10 ${
            error ? 'border-stamp-lost ring-1 ring-stamp-lost' : ''
          } ${className}`}
          {...props}
        >
          {children ? (
            children
          ) : (
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink font-bold font-meta text-xs">
          ▼
        </div>
      </div>
      {hint && !error && (
        <p className="font-meta text-xs text-ink-muted">{hint}</p>
      )}
      {error && (
        <p className="font-meta text-xs font-bold text-stamp-lost">{error}</p>
      )}
    </div>
  );
}
