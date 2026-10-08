/**
 * useClaims — combined hook for ClaimsPage.
 * Delegates to useClaimsMade + useClaimsReceived internally.
 */
import { useClaimsMade } from './useClaimsMade.js';
import { useClaimsReceived } from './useClaimsReceived.js';

export function useClaims() {
  const made = useClaimsMade();
  const received = useClaimsReceived();

  const isLoading = made.isLoading || received.isLoading;
  const isError = made.isError || received.isError;
  const error = made.error || received.error;

  return {
    claimsMade: made.claims,
    claimsReceived: received.claims,
    cancelClaim: made.cancelClaim,
    decideClaim: received.decideClaim,
    isLoading,
    isError,
    error,
    refetchMade: made.refetch,
    refetchReceived: received.refetch,
  };
}
