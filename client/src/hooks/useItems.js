import { useState, useMemo } from 'react';
import { mockItems } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useItems(initialFilters = {}) {
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();

  const [items, setItems] = useState(mockItems);
  const [filters, setFilters] = useState({
    type: 'all', // 'all' | 'lost' | 'found'
    category: 'all',
    q: '',
    status: 'open,claim_pending',
    sort: 'newest',
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const filteredItems = useMemo(() => {
    if (simEmpty) return [];

    return items.filter((item) => {
      if (filters.type && filters.type !== 'all' && item.type !== filters.type) {
        return false;
      }
      if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }
      if (filters.q && filters.q.trim()) {
        const query = filters.q.toLowerCase().trim();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }
      if (filters.location && filters.location.trim()) {
        const loc = filters.location.toLowerCase().trim();
        if (!item.location?.toLowerCase().includes(loc)) return false;
      }
      return true;
    });
  }, [items, filters, simEmpty]);

  const addItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const updateItem = (id, updatedFields) => {
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const limit = filters.limit || 10;
  const page = filters.page || 1;
  const total = filteredItems.length;
  const totalPages = Math.ceil(total / limit) || 1;

  const data = simError
    ? null
    : {
        items: filteredItems,
        page,
        limit,
        total,
        totalPages,
      };

  return {
    data,
    items: simLoading || simError ? [] : filteredItems,
    allItems: items,
    filters,
    setFilters,
    total,
    addItem,
    updateItem,
    deleteItem,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to retrieve archive items. Simulated error.' } : null,
  };
}
