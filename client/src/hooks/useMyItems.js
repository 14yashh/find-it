import { useMemo } from 'react';
import { mockItems } from '../mocks/data.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useDevSimulation } from './useDevStateHelper.js';

export function useMyItems() {
  const { currentUser } = useAuth();
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();

  const myItems = useMemo(() => {
    if (simEmpty) return [];
    if (!currentUser) return mockItems.slice(0, 3);
    return mockItems.filter(
      (it) => it.postedBy && String(it.postedBy._id) === String(currentUser._id)
    );
  }, [currentUser, simEmpty]);

  const total = myItems.length;
  const page = 1;
  const limit = 10;
  const totalPages = Math.ceil(total / limit) || 1;

  const data = simError
    ? null
    : {
        items: myItems,
        page,
        limit,
        total,
        totalPages,
      };

  return {
    data,
    items: simLoading || simError ? [] : myItems,
    total,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to retrieve personal item records.' } : null,
  };
}
