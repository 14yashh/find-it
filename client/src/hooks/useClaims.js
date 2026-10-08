import { useState } from 'react';
import { mockClaims } from '../mocks/data.js';

export function useClaims() {
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

  return {
    claimsMade,
    claimsReceived,
    decideClaim,
    cancelClaim,
    createClaim,
    loading: false,
    error: null,
  };
}
