/**
 * src/lib/utils.js
 * Helpers for tags, dates, and images matching docs/API.md
 */

export function getTagNumber(id) {
  if (!id) return 'TAG-0000';
  const hex = id.slice(-4);
  const num = parseInt(hex, 16);
  const val = isNaN(num) ? 0 : num % 10000;
  return `TAG-${String(val).padStart(4, '0')}`;
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
