import { useState, useEffect, useCallback } from 'react';
import { getAdminClaims, handoverClaim as apiHandoverClaim } from '../api/admin.js';

export function useAdminClaims(initialFilters = {}) {
  const [filters, setFilters] = useState({ page: 1, limit: 20, ...initialFilters });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (params) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await getAdminClaims(params);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(filters); }, [filters, fetch]);

  const handoverClaim = useCallback(async (claimId) => {
    await apiHandoverClaim(claimId);
    setData((prev) =>
      prev
        ? {
            ...prev,
            claims: prev.claims.map((c) =>
              c._id === claimId
                ? {
                    ...c,
                    item: { ...c.item, status: 'returned' },
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
    filters,
    setFilters,
    handoverClaim,
    isLoading,
    isError,
    error,
    refetch: () => fetch(filters),
  };
}
