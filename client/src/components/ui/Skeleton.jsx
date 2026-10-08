import React from 'react';

export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-ink/10 border border-ink/20 rounded-none ${className}`}
    />
  );
}

export function TagCardSkeleton() {
  return (
    <div className="bg-paper border-2 border-ink hard-shadow-4 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-16 h-5" />
      </div>
      <Skeleton className="w-full h-44" />
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
      </div>
      <div className="pt-2 border-t border-dashed border-ink/30 space-y-1">
        <Skeleton className="w-1/2 h-3" />
        <Skeleton className="w-1/3 h-3" />
      </div>
    </div>
  );
}
