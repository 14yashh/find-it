import { useState, useMemo } from 'react';
import { mockClaims } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useClaimsMade() {
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();
  const [claims, setClaims] = useState(mockClaims.made);

  const cancelClaim = (claimId) => {
    setClaims((prev) =>
      prev.map((c) => (c._id === claimId ? { ...c, status: 'cancelled' } : c))
    );
  };

  const createClaim = (newClaim) => {
    setClaims((prev) => [newClaim, ...prev]);
  };

  const activeClaims = simEmpty ? [] : claims;
  const total = activeClaims.length;
  const page = 1;
  const limit = 10;
  const totalPages = Math.ceil(total / limit) || 1;

  const data = simError
    ? null
    : {
        claims: activeClaims,
        page,
        limit,
        total,
        totalPages,
      };

  return {
    data,
    claims: simLoading || simError ? [] : activeClaims,
    total,
    cancelClaim,
    createClaim,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to retrieve filed claims.' } : null,
  };
}
