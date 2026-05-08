"use client";

import { useState, useCallback, useEffect } from "react";
import { User } from "../../domain/entities/User";
import { UserApiRepository } from "../../infrastructure/api/UserApiRepository";
import { PageInfo } from "../../domain/entities/ApiResponse";
import { useNotification } from "./useNotification";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_INFO: PageInfo = {
  pageNo: 0,
  pageSize: DEFAULT_PAGE_SIZE,
  totalElements: 0,
  totalPages: 1,
  last: true,
};

/**
 * useUsers - Custom hook for managing user state and operations
 * Handles: fetching, creating, updating, deleting users with pagination
 */
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo>(DEFAULT_PAGE_INFO);

  const userRepository = new UserApiRepository();
  const { success, error: errorNotify } = useNotification();

  /**
   * Fetch users (paginated)
   */
  const fetchUsers = useCallback(async (page: number = 0, size: number = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userRepository.getAll(page, size);

      if (response.success && response.data) {
        setUsers(response.data.items);
        setPageInfo(response.data.pageInfo);
        setError(null);
      } else {
        const errorMsg = response.message || "Failed to fetch users";
        setError(errorMsg);
        errorNotify(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error fetching users";
      setError(errorMsg);
      errorNotify(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [errorNotify]);

  /**
   * Change page
   */
  const goToPage = useCallback(
    async (page: number) => {
      await fetchUsers(page, pageInfo.pageSize);
    },
    [pageInfo.pageSize, fetchUsers]
  );

  /**
   * Change page size
   */
  const changePageSize = useCallback(
    async (size: number) => {
      await fetchUsers(0, size);
    },
    [fetchUsers]
  );

  /**
   * Create a new user
   */
  const createUser = useCallback(
    async (userData: Omit<User, "id" | "createdAt">) => {
      // Validate user data
      const user = new User(userData.fullName, userData.email, userData.phone);

      const validationErrors = user.validate();
      if (validationErrors.length > 0) {
        const errorMsg = validationErrors.join(", ");
        setError(errorMsg);
        errorNotify(errorMsg);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await userRepository.create(user);

        const createdUser = response.data;
        if (response.success && createdUser) {
          success(`User "${createdUser.fullName}" created successfully`);
          setError(null);
          // Refresh current page
          await fetchUsers(pageInfo.pageNo, pageInfo.pageSize);
          return createdUser;
        } else {
          const errorMsg = response.message || "Failed to create user";
          setError(errorMsg);
          errorNotify(errorMsg);
          return null;
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error creating user";
        setError(errorMsg);
        errorNotify(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [success, errorNotify, fetchUsers, pageInfo]
  );

  /**
   * Update existing user
   */
  const updateUser = useCallback(
    async (
      id: number,
      userData: Omit<User, "id" | "createdAt">
    ) => {
      // Validate user data
      const user = new User(userData.fullName, userData.email, userData.phone);

      const validationErrors = user.validate();
      if (validationErrors.length > 0) {
        const errorMsg = validationErrors.join(", ");
        setError(errorMsg);
        errorNotify(errorMsg);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await userRepository.update(id, user);

        const updatedUser = response.data;
        if (response.success && updatedUser) {
          setUsers((prev) =>
            prev.map((u) => (u.id === id ? updatedUser : u))
          );
          success(`User "${updatedUser.fullName}" updated successfully`);
          setError(null);
          return updatedUser;
        } else {
          const errorMsg = response.message || "Failed to update user";
          setError(errorMsg);
          errorNotify(errorMsg);
          return null;
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error updating user";
        setError(errorMsg);
        errorNotify(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [success, errorNotify]
  );

  /**
   * Delete user
   */
  const deleteUser = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userRepository.delete(id);

        if (response.success) {
          success("User deleted successfully");
          setError(null);
          // Refresh current page
          await fetchUsers(pageInfo.pageNo, pageInfo.pageSize);
          return true;
        } else {
          const errorMsg = response.message || "Failed to delete user";
          setError(errorMsg);
          errorNotify(errorMsg);
          return false;
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error deleting user";
        setError(errorMsg);
        errorNotify(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [success, errorNotify, fetchUsers, pageInfo]
  );

  /**
   * Get user by ID
   */
  const getUserById = useCallback(
    (id: number) => {
      return users.find((u) => u.id === id);
    },
    [users]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    // State
    users,
    loading,
    error,
    pageInfo,

    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    goToPage,
    changePageSize,
    clearError,
  };
};
