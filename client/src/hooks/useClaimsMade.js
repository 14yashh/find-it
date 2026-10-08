import { useState, useEffect, useCallback } from 'react';
import { getClaimsMade } from '../api/claims.js';
import { cancelClaim as apiCancelClaim } from '../api/claims.js';

export function useClaimsMade() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const claims = await getClaimsMade();
      setData({ claims, total: claims.length, page: 1, limit: 20, totalPages: Math.ceil(claims.length / 20) || 1 });
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const cancelClaim = useCallback(async (claimId) => {
    await apiCancelClaim(claimId);
    setData((prev) =>
      prev
        ? {
            ...prev,
            claims: prev.claims.map((c) => (c._id === claimId ? { ...c, status: 'cancelled' } : c)),
          }
        : prev
    );
  }, []);

  return {
    data,
    claims: data?.claims || [],
    total: data?.total || 0,
    cancelClaim,
    isLoading,
    isError,
    error,
    refetch: fetch,
  };
}
