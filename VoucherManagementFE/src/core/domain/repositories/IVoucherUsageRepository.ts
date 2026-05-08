import { VoucherUsage } from "../entities/VoucherUsage";
import { ApiResponse, PaginatedResponse } from "../entities/ApiResponse";

/**
 * IVoucherUsageRepository - Repository Interface for VoucherUsage Entity
 * Defines contract for voucher usage history data access operations
 * Implementation should be provided by infrastructure layer
 */
export interface IVoucherUsageRepository {
  /**
   * Get all voucher usages (paginated)
   */
  getAll(page?: number, size?: number): Promise<ApiResponse<PaginatedResponse<VoucherUsage>>>;

  /**
   * Get voucher usages by user ID (paginated)
   */
  getByUserId(userId: number, page?: number, size?: number): Promise<ApiResponse<PaginatedResponse<VoucherUsage>>>;

  /**
   * Get voucher usages by voucher ID (paginated)
   */
  getByVoucherId(voucherId: number, page?: number, size?: number): Promise<ApiResponse<PaginatedResponse<VoucherUsage>>>;

  /**
   * Create new voucher usage record
   */
  create(voucherUsage: VoucherUsage): Promise<ApiResponse<VoucherUsage>>;
}
