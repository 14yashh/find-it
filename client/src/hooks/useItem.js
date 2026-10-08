import { useState, useMemo } from 'react';
import { mockItems } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useItem(id) {
  const { isLoading: simLoading, isError: simError } = useDevSimulation();
  const [items, setItems] = useState(mockItems);

  const foundItem = useMemo(() => {
    return items.find((it) => it._id === id || it.tagNumber === id) || items[0];
  }, [items, id]);

  const matches = useMemo(() => {
    if (!foundItem) return [];
    return items
      .filter((it) => it._id !== foundItem._id && it.category === foundItem.category)
      .slice(0, 3);
  }, [items, foundItem]);

  const setItemStatus = (newStatus) => {
    setItems((prev) =>
      prev.map((it) => (it._id === foundItem?._id ? { ...it, status: newStatus } : it))
    );
  };

  return {
    data: simError ? null : foundItem,
    item: simLoading || simError ? null : foundItem,
    matches: simLoading || simError ? [] : matches,
    setItemStatus,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Item record not found in archive registry.' } : null,
  };
}
