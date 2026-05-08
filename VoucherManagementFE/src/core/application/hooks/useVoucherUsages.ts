"use client";

import { useState, useCallback, useEffect } from "react";
import { VoucherUsage } from "../../domain/entities/VoucherUsage";
import { VoucherUsageApiRepository } from "../../infrastructure/api/VoucherUsageApiRepository";
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
 * useVoucherUsages - Custom hook for managing voucher usage history
 * Handles: fetching usage history with pagination
 */
export const useVoucherUsages = () => {
  const [usages, setUsages] = useState<VoucherUsage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo>(DEFAULT_PAGE_INFO);

  const voucherUsageRepository = new VoucherUsageApiRepository();
  const { error: errorNotify } = useNotification();

  /**
   * Fetch all voucher usages (paginated)
   */
  const fetchUsages = useCallback(async (page: number = 0, size: number = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherUsageRepository.getAll(page, size);

      if (response.success && response.data) {
        setUsages(response.data.items);
        setPageInfo(response.data.pageInfo);
        setError(null);
      } else {
        const errorMsg = response.message || "Failed to fetch voucher usages";
        setError(errorMsg);
        errorNotify(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error fetching voucher usages";
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
      await fetchUsages(page, pageInfo.pageSize);
    },
    [pageInfo.pageSize, fetchUsages]
  );

  /**
   * Change page size
   */
  const changePageSize = useCallback(
    async (size: number) => {
      await fetchUsages(0, size);
    },
    [fetchUsages]
  );

  /**
   * Get usages by user ID (paginated)
   */
  const getUsagesByUserId = useCallback(
    async (userId: number, page: number = 0, size: number = DEFAULT_PAGE_SIZE) => {
      setLoading(true);
      setError(null);

      try {
        const response = await voucherUsageRepository.getByUserId(userId, page, size);

        if (response.success && response.data) {
          setUsages(response.data.items);
          setPageInfo(response.data.pageInfo);
          setError(null);
          return response.data.items;
        } else {
          const errorMsg =
            response.message || "Failed to fetch user voucher usages";
          setError(errorMsg);
          errorNotify(errorMsg);
          return [];
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error fetching user usages";
        setError(errorMsg);
        errorNotify(errorMsg);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [errorNotify]
  );

  /**
   * Get usages by voucher ID (paginated)
   */
  const getUsagesByVoucherId = useCallback(
    async (voucherId: number, page: number = 0, size: number = DEFAULT_PAGE_SIZE) => {
      setLoading(true);
      setError(null);

      try {
        const response = await voucherUsageRepository.getByVoucherId(
          voucherId, page, size
        );

        if (response.success && response.data) {
          setUsages(response.data.items);
          setPageInfo(response.data.pageInfo);
          setError(null);
          return response.data.items;
        } else {
          const errorMsg =
            response.message || "Failed to fetch voucher usages";
          setError(errorMsg);
          errorNotify(errorMsg);
          return [];
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error fetching voucher usages";
        setError(errorMsg);
        errorNotify(errorMsg);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [errorNotify]
  );

  /**
   * Refresh usages list
   */
  const refreshUsages = useCallback(async () => {
    await fetchUsages(pageInfo.pageNo, pageInfo.pageSize);
  }, [fetchUsages, pageInfo]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch usages on mount
  useEffect(() => {
    fetchUsages();
  }, []);

  return {
    usages,
    loading,
    error,
    pageInfo,
    fetchUsages,
    getUsagesByUserId,
    getUsagesByVoucherId,
    refreshUsages,
    goToPage,
    changePageSize,
    clearError,
  };
};
