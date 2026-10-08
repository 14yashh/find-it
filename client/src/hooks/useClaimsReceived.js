import { useState, useMemo } from 'react';
import { mockClaims } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useClaimsReceived() {
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();
  const [claims, setClaims] = useState(mockClaims.received);

  const decideClaim = (claimId, decision, note = '') => {
    setClaims((prev) =>
      prev.map((c) =>
        c._id === claimId
          ? {
              ...c,
              status: decision === 'approve' ? 'approved' : 'rejected',
              decisionNote: note,
              decidedAt: new Date().toISOString(),
            }
          : c
      )
    );
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
    decideClaim,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to retrieve received claims.' } : null,
  };
}
