import { useState } from 'react';
import { mockAdminStats } from '../mocks/data.js';

export function useAdminStats() {
  const [stats] = useState(mockAdminStats);
  return { stats, loading: false, error: null };
}
