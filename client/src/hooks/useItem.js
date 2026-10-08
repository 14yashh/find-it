import { useState, useMemo } from 'react';
import { mockItems } from '../mocks/data.js';

export function useItem(id) {
  const [items, setItems] = useState(mockItems);

  const item = useMemo(() => {
    return items.find((i) => i._id === id) || items[0];
  }, [items, id]);

  const matches = useMemo(() => {
    if (!item) return [];
    const oppositeType = item.type === 'lost' ? 'found' : 'lost';
    return items.filter(
      (other) => other.type === oppositeType && other._id !== item._id
    );
  }, [items, item]);

  const setItemStatus = (newStatus) => {
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, status: newStatus } : i))
    );
  };

  return {
    item,
    matches,
    setItemStatus,
    loading: false,
    error: null,
  };
}
