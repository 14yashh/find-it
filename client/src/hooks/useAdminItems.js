import { useState, useEffect, useCallback } from 'react';
import { getAdminItems, adminDeleteItem as apiDeleteItem, adminUpdateItemStatus as apiUpdateStatus } from '../api/admin.js';

export function useAdminItems(initialFilters = {}) {
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
      const result = await getAdminItems(params);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(filters); }, [filters, fetch]);

  const deleteItem = useCallback(async (id) => {
    await apiDeleteItem(id);
    setData((prev) =>
      prev ? { ...prev, items: prev.items.filter((it) => it._id !== id) } : prev
    );
  }, []);

  const updateItemStatus = useCallback(async (id, status) => {
    await apiUpdateStatus(id, status);
    setData((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((it) => (it._id === id ? { ...it, status } : it)),
          }
        : prev
    );
  }, []);

  return {
    data,
    items: data?.items || [],
    allItems: data?.items || [],
    total: data?.total || 0,
    filters,
    setFilters,
    deleteItem,
    updateItemStatus,
    isLoading,
    isError,
    error,
    refetch: () => fetch(filters),
  };
}
