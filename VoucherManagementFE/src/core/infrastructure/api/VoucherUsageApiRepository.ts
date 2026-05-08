import { VoucherUsage } from "../../domain/entities/VoucherUsage";
import { IVoucherUsageRepository } from "../../domain/repositories/IVoucherUsageRepository";
import { ApiResponse, PaginatedResponse, PageInfo } from "../../domain/entities/ApiResponse";

/**
 * VoucherUsageApiRepository - Implements IVoucherUsageRepository
 * Handles all HTTP communication with the backend for voucher usage operations
 * API response format: { success, message, data: { content: [...], pageNo, pageSize, totalElements, totalPages, last } }
 */
export class VoucherUsageApiRepository implements IVoucherUsageRepository {
  private readonly baseUrl = "/api";
  private readonly endpoint = "/voucher-usages";

  /**
   * Extract content array from paginated API response
   */
  private extractContent(data: any): any[] {
    if (Array.isArray(data)) return data;
    if (data?.content && Array.isArray(data.content)) return data.content;
    return [];
  }

  /**
   * Extract page info from API response
   */
  private extractPageInfo(data: any): PageInfo {
    return {
      pageNo: data?.pageNo ?? 0,
      pageSize: data?.pageSize ?? 10,
      totalElements: data?.totalElements ?? 0,
      totalPages: data?.totalPages ?? 1,
      last: data?.last ?? true,
    };
  }

  /**
   * Map raw API data to VoucherUsage entity
   */
  private mapToVoucherUsage(vu: any): VoucherUsage {
    return new VoucherUsage(
      vu.userId,
      vu.voucherId,
      vu.id,
      vu.usedAt
    );
  }

  /**
   * Get all voucher usages (paginated)
   */
  async getAll(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<VoucherUsage>>> {
    try {
      const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
      const response = await fetch(`${this.baseUrl}${this.endpoint}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const apiResponse: ApiResponse<any> = await response.json();

      if (apiResponse.success && apiResponse.data) {
        const content = this.extractContent(apiResponse.data);
        const usages = content.map((vu: any) => this.mapToVoucherUsage(vu));
        const pageInfo = this.extractPageInfo(apiResponse.data);

        return {
          success: true,
          message: apiResponse.message,
          data: { items: usages, pageInfo },
        };
      }

      return {
        success: false,
        message: apiResponse.message || "Failed to fetch voucher usages",
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error fetching voucher usages",
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    }
  }

  /**
   * Get voucher usages by user ID (paginated)
   */
  async getByUserId(userId: number, page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<VoucherUsage>>> {
    try {
      const params = new URLSearchParams({ userId: userId.toString(), page: page.toString(), size: size.toString() });
      const response = await fetch(
        `${this.baseUrl}${this.endpoint}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const apiResponse: ApiResponse<any> = await response.json();

      if (apiResponse.success && apiResponse.data) {
        const content = this.extractContent(apiResponse.data);
        const usages = content.map((vu: any) => this.mapToVoucherUsage(vu));
        const pageInfo = this.extractPageInfo(apiResponse.data);

        return {
          success: true,
          message: apiResponse.message,
          data: { items: usages, pageInfo },
        };
      }

      return {
        success: false,
        message:
          apiResponse.message || "Failed to fetch user voucher usages",
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error fetching user voucher usages",
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    }
  }

  /**
   * Get voucher usages by voucher ID (paginated)
   */
  async getByVoucherId(voucherId: number, page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<VoucherUsage>>> {
    try {
      const params = new URLSearchParams({ voucherId: voucherId.toString(), page: page.toString(), size: size.toString() });
      const response = await fetch(
        `${this.baseUrl}${this.endpoint}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const apiResponse: ApiResponse<any> = await response.json();

      if (apiResponse.success && apiResponse.data) {
        const content = this.extractContent(apiResponse.data);
        const usages = content.map((vu: any) => this.mapToVoucherUsage(vu));
        const pageInfo = this.extractPageInfo(apiResponse.data);

        return {
          success: true,
          message: apiResponse.message,
          data: { items: usages, pageInfo },
        };
      }

      return {
        success: false,
        message:
          apiResponse.message || "Failed to fetch voucher usages",
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error fetching voucher usages",
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    }
  }

  /**
   * Create new voucher usage record
   * Payload: { "userId": number, "voucherId": number }
   */
  async create(voucherUsage: VoucherUsage): Promise<ApiResponse<VoucherUsage>> {
    try {
      const payload = {
        userId: voucherUsage.userId,
        voucherId: voucherUsage.voucherId,
      };

      const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const apiResponse: ApiResponse<any> = await response.json();

      if (apiResponse.success && apiResponse.data) {
        const createdUsage = this.mapToVoucherUsage(apiResponse.data);
        return {
          success: true,
          message: apiResponse.message,
          data: createdUsage,
        };
      }

      return {
        success: false,
        message: apiResponse.message || "Failed to create voucher usage",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error creating voucher usage",
      };
    }
  }
}
