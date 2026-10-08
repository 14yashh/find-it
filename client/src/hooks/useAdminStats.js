import { useState, useEffect, useCallback } from 'react';
import { getAdminStats } from '../api/admin.js';

export function useAdminStats() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await getAdminStats();
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const handleRefresh = () => fetch();
    window.addEventListener('admin:refresh-stats', handleRefresh);
    return () => window.removeEventListener('admin:refresh-stats', handleRefresh);
  }, [fetch]);

  const stats = data?.stats || data || {
    pendingVerifications: 0,
    openItems: 0,
    returnedItems: 0,
    totalUsers: 0,
    pendingClaims: 0,
  };

  return {
    data,
    stats,
    isLoading,
    loading: isLoading,
    isError,
    error,
    refetch: fetch,
  };
}
