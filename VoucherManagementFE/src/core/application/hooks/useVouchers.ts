"use client";

import { useState, useCallback, useEffect } from "react";
import { Voucher } from "../../domain/entities/Voucher";
import { VoucherApiRepository } from "../../infrastructure/api/VoucherApiRepository";
import { VoucherUsageApiRepository } from "../../infrastructure/api/VoucherUsageApiRepository";
import { VoucherUsage } from "../../domain/entities/VoucherUsage";
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
 * useVouchers - Custom hook for managing voucher state and operations
 * Handles: fetching, searching, creating, updating, deleting, and applying vouchers
 * Now with server-side pagination support
 */
export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCode, setSearchCode] = useState("");
  const [pageInfo, setPageInfo] = useState<PageInfo>(DEFAULT_PAGE_INFO);

  const voucherRepository = new VoucherApiRepository();
  const voucherUsageRepository = new VoucherUsageApiRepository();
  const { success, error: errorNotify } = useNotification();

  /**
   * Fetch vouchers (paginated)
   */
  const fetchVouchers = useCallback(async (page: number = 0, size: number = DEFAULT_PAGE_SIZE) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherRepository.getAll(page, size);

      if (response.success && response.data) {
        setVouchers(response.data.items);
        setPageInfo(response.data.pageInfo);
        setError(null);
      } else {
        const errorMsg = response.message || "Failed to fetch vouchers";
        setError(errorMsg);
        errorNotify(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error fetching vouchers";
      setError(errorMsg);
      errorNotify(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [errorNotify]);

  /**
   * Search vouchers by code (paginated)
   */
  const searchVouchers = useCallback(
    async (code: string, page: number = 0, size: number = DEFAULT_PAGE_SIZE) => {
      setSearchCode(code);

      if (!code.trim()) {
        await fetchVouchers(page, size);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await voucherRepository.search(code, page, size);

        if (response.success && response.data) {
          setVouchers(response.data.items);
          setPageInfo(response.data.pageInfo);
          setError(null);
        } else {
          const errorMsg = response.message || "Search failed";
          setError(errorMsg);
          errorNotify(errorMsg);
          setVouchers([]);
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error searching vouchers";
        setError(errorMsg);
        errorNotify(errorMsg);
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchVouchers, errorNotify]
  );

  /**
   * Change page
   */
  const goToPage = useCallback(
    async (page: number) => {
      if (searchCode.trim()) {
        await searchVouchers(searchCode, page, pageInfo.pageSize);
      } else {
        await fetchVouchers(page, pageInfo.pageSize);
      }
    },
    [searchCode, pageInfo.pageSize, searchVouchers, fetchVouchers]
  );

  /**
   * Change page size
   */
  const changePageSize = useCallback(
    async (size: number) => {
      if (searchCode.trim()) {
        await searchVouchers(searchCode, 0, size);
      } else {
        await fetchVouchers(0, size);
      }
    },
    [searchCode, searchVouchers, fetchVouchers]
  );

  /**
   * Create a new voucher
   */
  const createVoucher = useCallback(
    async (voucherData: Omit<Voucher, "id" | "createdAt">) => {
      // Validate voucher data
      const voucher = new Voucher(
        voucherData.code,
        voucherData.discountPercent,
        voucherData.quantity,
        voucherData.expiredDate
      );

      const validationErrors = voucher.validate();
      if (validationErrors.length > 0) {
        const errorMsg = validationErrors.join(", ");
        setError(errorMsg);
        errorNotify(errorMsg);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await voucherRepository.create(voucher);

        const createdVoucher = response.data;
        if (response.success && createdVoucher) {
          success(`Voucher "${createdVoucher.code}" created successfully`);
          setError(null);
          // Refresh current page to reflect the new voucher
          await fetchVouchers(pageInfo.pageNo, pageInfo.pageSize);
          return createdVoucher;
        } else {
          const errorMsg = response.message || "Failed to create voucher";
          setError(errorMsg);
          errorNotify(errorMsg);
          return null;
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error creating voucher";
        setError(errorMsg);
        errorNotify(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [success, errorNotify, fetchVouchers, pageInfo]
  );

  /**
   * Update existing voucher
   */
  const updateVoucher = useCallback(
    async (
      id: number,
      voucherData: Omit<Voucher, "id" | "createdAt">
    ) => {
      // Validate voucher data
      const voucher = new Voucher(
        voucherData.code,
        voucherData.discountPercent,
        voucherData.quantity,
        voucherData.expiredDate
      );

      const validationErrors = voucher.validate();
      if (validationErrors.length > 0) {
        const errorMsg = validationErrors.join(", ");
        setError(errorMsg);
        errorNotify(errorMsg);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await voucherRepository.update(id, voucher);

        const updatedVoucher = response.data;
        if (response.success && updatedVoucher) {
          setVouchers((prev) =>
            prev.map((v) => (v.id === id ? updatedVoucher : v))
          );
          success(`Voucher "${updatedVoucher.code}" updated successfully`);
          setError(null);
          return updatedVoucher;
        } else {
          const errorMsg = response.message || "Failed to update voucher";
          setError(errorMsg);
          errorNotify(errorMsg);
          return null;
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error updating voucher";
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
   * Delete voucher
   */
  const deleteVoucher = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await voucherRepository.delete(id);

        if (response.success) {
          success("Voucher deleted successfully");
          setError(null);
          // Refresh current page after deletion
          await fetchVouchers(pageInfo.pageNo, pageInfo.pageSize);
          return true;
        } else {
          const errorMsg = response.message || "Failed to delete voucher";
          setError(errorMsg);
          errorNotify(errorMsg);
          return false;
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error deleting voucher";
        setError(errorMsg);
        errorNotify(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [success, errorNotify, fetchVouchers, pageInfo]
  );

  /**
   * Apply/Use voucher (record usage)
   */
  const applyVoucher = useCallback(
    async (userId: number, voucherId: number) => {
      const voucherUsage = new VoucherUsage(userId, voucherId);

      const validationErrors = voucherUsage.validate();
      if (validationErrors.length > 0) {
        const errorMsg = validationErrors.join(", ");
        setError(errorMsg);
        errorNotify(errorMsg);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await voucherUsageRepository.create(voucherUsage);

        if (response.success && response.data) {
          const voucherToUpdate = vouchers.find((v) => v.id === voucherId);
          success(
            `Voucher applied to user successfully. Discount: ${voucherToUpdate?.discountPercent || "N/A"}%`
          );
          setError(null);
          // Refresh vouchers to get updated quantity
          await fetchVouchers(pageInfo.pageNo, pageInfo.pageSize);
          return response.data;
        } else {
          const errorMsg = response.message || "Failed to apply voucher";
          setError(errorMsg);
          errorNotify(errorMsg);
          return null;
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error applying voucher";
        setError(errorMsg);
        errorNotify(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [vouchers, success, errorNotify, fetchVouchers, pageInfo]
  );

  /**
   * Get voucher by ID
   */
  const getVoucherById = useCallback(
    (id: number) => {
      return vouchers.find((v) => v.id === id);
    },
    [vouchers]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch vouchers on mount
  useEffect(() => {
    fetchVouchers();
  }, []);

  return {
    // State
    vouchers,
    loading,
    error,
    searchCode,
    pageInfo,

    // Actions
    fetchVouchers,
    searchVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    applyVoucher,
    getVoucherById,
    goToPage,
    changePageSize,
    clearError,
    setSearchCode,
  };
};
