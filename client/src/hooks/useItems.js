import { useState, useEffect, useCallback } from 'react';
import { getItems } from '../api/items.js';

export function useItems(initialFilters = {}) {
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    q: '',
    status: 'open,claim_pending',
    sort: 'newest',
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async (params) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      // Build API params — strip 'all' and compound placeholders
      const apiParams = {};
      if (params.type && params.type !== 'all') apiParams.type = params.type;
      if (params.category && params.category !== 'all') apiParams.category = params.category;
      if (params.q && params.q.trim()) apiParams.q = params.q.trim();
      if (params.location && params.location.trim()) apiParams.location = params.location.trim();
      if (params.status && params.status !== 'all' && params.status !== 'open,claim_pending') {
        apiParams.status = params.status;
      }
      if (params.sort) {
        if (params.sort === 'relevance' && params.q && params.q.trim()) {
          apiParams.sort = 'relevance';
        } else {
          apiParams.sort = 'newest';
        }
      }
      if (params.page) apiParams.page = params.page;
      if (params.limit) apiParams.limit = params.limit;
      const result = await getItems(apiParams);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(filters);
  }, [filters, fetchItems]);

  const items = data?.items || [];

  return {
    data,
    items,
    filters,
    setFilters,
    total: data?.total || 0,
    isLoading,
    isError,
    error,
    refetch: () => fetchItems(filters),
  };
}
