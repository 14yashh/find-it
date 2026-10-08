import { useState, useMemo } from 'react';
import { mockAdminUsers } from '../mocks/data.js';
import { useDevSimulation } from './useDevStateHelper.js';

export function useAdminUsers() {
  const { isLoading: simLoading, isError: simError, isEmpty: simEmpty } = useDevSimulation();
  const [users, setUsers] = useState(mockAdminUsers);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'

  const verifyUser = (userId, decision, reason = '') => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId
          ? {
              ...u,
              verificationStatus: decision === 'approve' ? 'approved' : 'rejected',
              rejectionReason: decision === 'reject' ? reason : undefined,
            }
          : u
      )
    );
  };

  const toggleSuspend = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, isSuspended: !u.isSuspended } : u
      )
    );
  };

  const activeUsers = simEmpty ? [] : users;
  const filteredUsers = useMemo(() => {
    return filter === 'all'
      ? activeUsers
      : activeUsers.filter((u) => u.verificationStatus === filter);
  }, [activeUsers, filter]);

  const total = filteredUsers.length;
  const page = 1;
  const limit = 10;
  const totalPages = Math.ceil(total / limit) || 1;

  const data = simError
    ? null
    : {
        users: filteredUsers,
        total,
        page,
        limit,
        totalPages,
      };

  return {
    data,
    users: simLoading || simError ? [] : filteredUsers,
    allUsers: simLoading || simError ? [] : activeUsers,
    filter,
    setFilter,
    verifyUser,
    toggleSuspend,
    isLoading: simLoading,
    isError: simError,
    error: simError ? { message: 'Failed to access student user directory.' } : null,
  };
}
