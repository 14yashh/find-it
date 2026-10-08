import { useState, useMemo } from 'react';
import { mockClaims } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useAdminClaims() {
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();
  const [allClaimsList, setAllClaimsList] = useState([
    ...mockClaims.made,
    ...mockClaims.received,
  ]);

  const decideClaim = (claimId, decision, note = '') => {
    setAllClaimsList((prev) =>
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

  const activeClaims = simEmpty ? [] : allClaimsList;
  const total = activeClaims.length;
  const page = 1;
  const limit = 20;
  const totalPages = Math.ceil(total / limit) || 1;

  const data = simError
    ? null
    : {
        claims: activeClaims,
        total,
        page,
        limit,
        totalPages,
      };

  return {
    data,
    claims: simLoading || simError ? [] : activeClaims,
    total,
    decideClaim,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to access claims audit ledger.' } : null,
  };
}
