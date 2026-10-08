import { useState, useEffect, useCallback } from 'react';
import { getAdminUsers, verifyUser as apiVerifyUser, suspendUser as apiSuspendUser } from '../api/admin.js';

export function useAdminUsers(initialFilter = 'all') {
  const [filter, setFilter] = useState(initialFilter);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (currentFilter) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const params = {};
      if (currentFilter && currentFilter !== 'all') params.verificationStatus = currentFilter;
      const result = await getAdminUsers(params);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(filter); }, [filter, fetch]);

  const verifyUser = useCallback(async (userId, decision, reason = '') => {
    await apiVerifyUser(userId, decision, reason);
    // Optimistic update
    setData((prev) =>
      prev
        ? {
            ...prev,
            users: prev.users.map((u) =>
              u._id === userId
                ? {
                    ...u,
                    verificationStatus: decision === 'approve' ? 'approved' : 'rejected',
                    rejectionReason: decision === 'reject' ? reason : undefined,
                  }
                : u
            ),
          }
        : prev
    );
  }, []);

  const toggleSuspend = useCallback(async (userId) => {
    let newSuspended = true;
    setData((prev) => {
      if (!prev) return prev;
      const target = prev.users.find((u) => u._id === userId);
      newSuspended = target ? !target.isSuspended : true;
      return {
        ...prev,
        users: prev.users.map((u) =>
          u._id === userId ? { ...u, isSuspended: newSuspended } : u
        ),
      };
    });
    try {
      await apiSuspendUser(userId, newSuspended);
    } catch (err) {
      // Revert if API fails
      setData((prev) =>
        prev
          ? {
              ...prev,
              users: prev.users.map((u) =>
                u._id === userId ? { ...u, isSuspended: !newSuspended } : u
              ),
            }
          : prev
      );
      throw err;
    }
  }, []);

  return {
    data,
    users: data?.users || [],
    allUsers: data?.users || [],
    filter,
    setFilter,
    verifyUser,
    toggleSuspend,
    isLoading,
    isError,
    error,
    refetch: () => fetch(filter),
  };
}
