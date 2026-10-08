import { useState, useMemo } from 'react';
import { mockItems } from '../mocks/data.js';

export function useItems(initialFilters = {}) {
  const [items, setItems] = useState(mockItems);
  const [filters, setFilters] = useState({
    type: 'all', // 'all' | 'lost' | 'found'
    category: 'all',
    q: '',
    status: 'open,claim_pending',
    sort: 'newest',
    ...initialFilters,
  });

  const filteredItems = useMemo(() => {
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
        const matchesLoc = item.location?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }
      return true;
    });
  }, [items, filters]);

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

  return {
    items: filteredItems,
    allItems: items,
    filters,
    setFilters,
    total: filteredItems.length,
    addItem,
    updateItem,
    deleteItem,
    loading: false,
    error: null,
  };
}
