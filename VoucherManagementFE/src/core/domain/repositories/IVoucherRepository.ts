import { Voucher } from "../entities/Voucher";
import { ApiResponse, PaginatedResponse } from "../entities/ApiResponse";

/**
 * IVoucherRepository - Repository Interface for Voucher Entity
 * Defines contract for voucher data access operations
 * Implementation should be provided by infrastructure layer
 */
export interface IVoucherRepository {
  /**
   * Get all vouchers (paginated)
   */
  getAll(page?: number, size?: number): Promise<ApiResponse<PaginatedResponse<Voucher>>>;

  /**
   * Get single voucher by ID
   */
  getById(id: number): Promise<ApiResponse<Voucher>>;

  /**
   * Create a new voucher
   */
  create(voucher: Voucher): Promise<ApiResponse<Voucher>>;

  /**
   * Update existing voucher
   */
  update(id: number, voucher: Voucher): Promise<ApiResponse<Voucher>>;

  /**
   * Delete voucher by ID
   */
  delete(id: number): Promise<ApiResponse<void>>;

  /**
   * Search vouchers by code (paginated)
   */
  search(code: string, page?: number, size?: number): Promise<ApiResponse<PaginatedResponse<Voucher>>>;
}
