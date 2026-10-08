/**
 * useMatches — matches are now fetched inside useItem directly.
 * This hook is kept as a thin wrapper for backward compat.
 */
import { useItem } from './useItem.js';

export function useMatches(itemId) {
  const { matches, isLoading, isError, error } = useItem(itemId);
  return {
    data: isError ? null : { matches, total: matches.length },
    matches,
    total: matches.length,
    isLoading,
    isError,
    error,
  };
}
