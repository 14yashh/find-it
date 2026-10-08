import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  to,
  type = 'button',
  onClick,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-bold font-sans tracking-wide border-2 border-ink select-none cursor-pointer interactive-hard disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm hard-shadow-2',
    md: 'px-4 py-2 text-base hard-shadow-4',
    lg: 'px-6 py-3 text-lg hard-shadow-4',
  }[size] || 'px-4 py-2 text-base hard-shadow-4';

  const variantClasses = {
    primary: 'bg-primary-container text-ink hover:bg-[#ff6c2e]',
    secondary: 'bg-paper hover:bg-manila text-ink',
    manila: 'bg-manila hover:bg-manila-dark text-ink',
    danger: 'bg-stamp-rejected text-white hover:bg-[#a62520]',
    outline: 'bg-transparent text-ink hover:bg-black/5',
  }[variant] || 'bg-primary-container text-ink';

  const combined = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combined} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combined}
      {...props}
    >
      {children}
    </button>
  );
}
