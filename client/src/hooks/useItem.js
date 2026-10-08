import { useState, useEffect, useCallback } from 'react';
import { getItem, getItemMatches } from '../api/items.js';

export function useItem(id) {
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetchItem = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await getItem(id);
      setItem(result);
      // Fetch matches in parallel — ignore failures
      try {
        const matchResult = await getItemMatches(id);
        setMatches(matchResult || []);
      } catch {
        setMatches([]);
      }
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const setItemStatus = (newStatus) => {
    setItem((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };

  return {
    data: item,
    item,
    matches,
    setItemStatus,
    isLoading,
    isError,
    error,
    refetch: fetchItem,
  };
}
