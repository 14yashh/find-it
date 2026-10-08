import { useMemo } from 'react';
import { mockItems } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useMatches(itemId) {
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();

  const matches = useMemo(() => {
    if (simEmpty || !itemId) return [];
    const currentItem = mockItems.find((it) => it._id === itemId || it.tagNumber === itemId);
    if (!currentItem) return [];

    return mockItems
      .filter((it) => it._id !== currentItem._id && it.category === currentItem.category)
      .map((it) => ({
        item: it,
        score: 0.85,
        reasons: ['Same category: ' + it.category, 'Matching location proximity'],
      }));
  }, [itemId, simEmpty]);

  const total = matches.length;

  return {
    data: simError ? null : { matches, total },
    matches: simLoading || simError ? [] : matches,
    total,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to compute similarity matches.' } : null,
  };
}
