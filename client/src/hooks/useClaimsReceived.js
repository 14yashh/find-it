import { useState, useEffect, useCallback } from 'react';
import { getClaimsReceived } from '../api/claims.js';
import { decideClaim as apiDecideClaim } from '../api/claims.js';

export function useClaimsReceived() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const claims = await getClaimsReceived();
      setData({ claims, total: claims.length, page: 1, limit: 20, totalPages: Math.ceil(claims.length / 20) || 1 });
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const decideClaim = useCallback(async (claimId, decision, note = '') => {
    await apiDecideClaim(claimId, decision, note);
    setData((prev) =>
      prev
        ? {
            ...prev,
            claims: prev.claims.map((c) =>
              c._id === claimId
                ? {
                    ...c,
                    status: decision === 'approve' ? 'approved' : 'rejected',
                    decisionNote: note,
                    decidedAt: new Date().toISOString(),
                  }
                : c
            ),
          }
        : prev
    );
  }, []);

  return {
    data,
    claims: data?.claims || [],
    total: data?.total || 0,
    decideClaim,
    isLoading,
    isError,
    error,
    refetch: fetch,
  };
}
