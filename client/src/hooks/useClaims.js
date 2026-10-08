import { useCallback, useEffect } from 'react';
import { useClaimsMade } from './useClaimsMade.js';
import { useClaimsReceived } from './useClaimsReceived.js';
import { confirmClaimHandover } from '../api/claims.js';

const POLL_INTERVAL_MS = 30_000; // 30 seconds — keeps handover state in sync for both parties

export function useClaims() {
  const made = useClaimsMade();
  const received = useClaimsReceived();

  const isLoading = made.isLoading || received.isLoading;
  const isError = made.isError || received.isError;
  const error = made.error || received.error;

  // Poll periodically when there are approved claims with incomplete handover
  // so the receiver sees the finder's confirmation (and vice versa) without refreshing.
  const hasApprovedPending =
    made.claims.some((c) => c.status === 'approved' && !(c.founderHandoverConfirmed && c.receiverHandoverConfirmed)) ||
    received.claims.some((c) => c.status === 'approved' && !(c.founderHandoverConfirmed && c.receiverHandoverConfirmed));

  useEffect(() => {
    if (!hasApprovedPending) return;
    const id = setInterval(() => {
      made.refetch();
      received.refetch();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasApprovedPending, made.refetch, received.refetch]);

  const confirmHandover = useCallback(async (claimId) => {
    const res = await confirmClaimHandover(claimId);
    await Promise.all([made.refetch(), received.refetch()]);
    return res;
  }, [made, received]);

  return {
    claimsMade: made.claims,
    claimsReceived: received.claims,
    cancelClaim: made.cancelClaim,
    decideClaim: received.decideClaim,
    confirmHandover,
    isLoading,
    isError,
    error,
    refetchMade: made.refetch,
    refetchReceived: received.refetch,
  };
}
