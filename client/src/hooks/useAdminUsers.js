import { useState } from 'react';
import { mockAdminUsers } from '../mocks/data.js';

export function useAdminUsers() {
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

  const filteredUsers =
    filter === 'all'
      ? users
      : users.filter((u) => u.verificationStatus === filter);

  return {
    users: filteredUsers,
    allUsers: users,
    filter,
    setFilter,
    verifyUser,
    toggleSuspend,
    loading: false,
    error: null,
  };
}
