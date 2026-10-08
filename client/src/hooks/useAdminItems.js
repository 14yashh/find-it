import { useState, useMemo } from 'react';
import { mockItems } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useAdminItems(initialFilters = {}) {
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();
  const [items, setItems] = useState(mockItems);

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateItemStatus = (id, newStatus) => {
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
    );
  };

  const activeItems = simEmpty ? [] : items;
  const total = activeItems.length;
  const page = 1;
  const limit = 20;
  const totalPages = Math.ceil(total / limit) || 1;

  const data = simError
    ? null
    : {
        items: activeItems,
        total,
        page,
        limit,
        totalPages,
      };

  return {
    data,
    items: simLoading || simError ? [] : activeItems,
    allItems: simLoading || simError ? [] : items,
    total,
    deleteItem,
    updateItemStatus,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to access master items ledger.' } : null,
  };
}
