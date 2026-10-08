import { useState } from 'react';
import { mockAdminStats } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useAdminStats() {
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();
  const [stats] = useState(mockAdminStats);

  const activeStats = simEmpty
    ? {
        pendingVerifications: 0,
        openItems: 0,
        returnedItems: 0,
        totalUsers: 0,
        pendingClaims: 0,
      }
    : stats;

  return {
    data: simError ? null : activeStats,
    stats: activeStats,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to retrieve administrative overview metrics.' } : null,
  };
}
