import { useState, useEffect, useCallback } from 'react';
import { getMyItems } from '../api/items.js';

export function useMyItems() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const items = await getMyItems();
      setData({ items, total: items.length, page: 1, limit: 20, totalPages: Math.ceil(items.length / 20) || 1 });
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return {
    data,
    items: data?.items || [],
    total: data?.total || 0,
    isLoading,
    isError,
    error,
    refetch: fetch,
  };
}
