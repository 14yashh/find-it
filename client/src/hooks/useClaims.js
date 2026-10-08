import { useState } from 'react';
import { mockClaims } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useClaims() {
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();

  const [claimsMade, setClaimsMade] = useState(mockClaims.made);
  const [claimsReceived, setClaimsReceived] = useState(mockClaims.received);

  const decideClaim = (claimId, decision, note = '') => {
    setClaimsReceived((prev) =>
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

  const cancelClaim = (claimId) => {
    setClaimsMade((prev) =>
      prev.map((c) => (c._id === claimId ? { ...c, status: 'cancelled' } : c))
    );
  };

  const createClaim = (newClaim) => {
    setClaimsMade((prev) => [newClaim, ...prev]);
  };

  const activeMade = simEmpty ? [] : claimsMade;
  const activeReceived = simEmpty ? [] : claimsReceived;

  const data = simError
    ? null
    : {
        made: { claims: activeMade, total: activeMade.length },
        received: { claims: activeReceived, total: activeReceived.length },
      };

  return {
    data,
    claimsMade: simLoading || simError ? [] : activeMade,
    claimsReceived: simLoading || simError ? [] : activeReceived,
    decideClaim,
    cancelClaim,
    createClaim,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to access claims registry.' } : null,
  };
}
