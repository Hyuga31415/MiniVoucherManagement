import { VoucherUsage } from "../../domain/entities/VoucherUsage";
import { IVoucherUsageRepository } from "../../domain/repositories/IVoucherUsageRepository";
import { ApiResponse, PaginatedResponse, PageInfo } from "../../domain/entities/ApiResponse";
import { toFriendlyApiErrorMessage } from "./apiErrorMessages";

/**
 * VoucherUsageApiRepository - Implements IVoucherUsageRepository
 * Handles all HTTP communication with the backend for voucher usage operations
 * API response format: { success, message, data: { content: [...], pageNo, pageSize, totalElements, totalPages, last } }
 */
export class VoucherUsageApiRepository implements IVoucherUsageRepository {
  private readonly baseUrl = "/api";
  private readonly endpoint = "/voucher-usages";
  private readonly fallbackMessages = {
    getAll: "Không thể tải lịch sử sử dụng voucher. Vui lòng thử lại sau.",
    getByUserId: "Không thể tải lịch sử sử dụng voucher của người dùng. Vui lòng thử lại sau.",
    getByVoucherId: "Không thể tải lịch sử sử dụng của voucher. Vui lòng thử lại sau.",
    create: "Không thể ghi nhận lượt sử dụng voucher. Vui lòng thử lại sau.",
  };

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
      const params = new URLSearchParams({
        page: page.toString(),
        pageNo: page.toString(),
        size: size.toString(),
      });
      const response = await fetch(`${this.baseUrl}${this.endpoint}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const bodyText = await response.text().catch(() => null);
        return {
          success: false,
          message: toFriendlyApiErrorMessage({
            status: response.status,
            bodyText,
            fallback: this.fallbackMessages.getAll,
            notFoundMessage: "Không tìm thấy lịch sử sử dụng voucher.",
          }),
          data: { items: [], pageInfo: this.extractPageInfo(null) },
        };
      }

      const apiResponse: ApiResponse<any> = await response.json();
      
      console.log("VoucherUsage API Response:", apiResponse);
      console.log("VoucherUsage Raw Data:", apiResponse.data);

      if (apiResponse.success && apiResponse.data) {
        const content = this.extractContent(apiResponse.data);
        const usages = content.map((vu: any) => this.mapToVoucherUsage(vu));
        const pageInfo = this.extractPageInfo(apiResponse.data);
        
        console.log("Extracted pageInfo:", pageInfo);
        console.log("Page info details - pageNo:", apiResponse.data.pageNo, "pageSize:", apiResponse.data.pageSize);

        return {
          success: true,
          message: apiResponse.message,
          data: { items: usages, pageInfo },
        };
      }

      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: apiResponse.message,
          fallback: this.fallbackMessages.getAll,
          notFoundMessage: "Không tìm thấy lịch sử sử dụng voucher.",
        }),
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    } catch (error) {
      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: error instanceof Error ? error.message : null,
          fallback: this.fallbackMessages.getAll,
          notFoundMessage: "Không tìm thấy lịch sử sử dụng voucher.",
        }),
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    }
  }

  /**
   * Get voucher usages by user ID (paginated)
   */
  async getByUserId(userId: number, page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<VoucherUsage>>> {
    try {
      const params = new URLSearchParams({
        userId: userId.toString(),
        page: page.toString(),
        pageNo: page.toString(),
        size: size.toString(),
      });
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
        const bodyText = await response.text().catch(() => null);
        return {
          success: false,
          message: toFriendlyApiErrorMessage({
            status: response.status,
            bodyText,
            fallback: this.fallbackMessages.getByUserId,
            notFoundMessage: "Không tìm thấy lịch sử sử dụng voucher của người dùng.",
          }),
          data: { items: [], pageInfo: this.extractPageInfo(null) },
        };
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
        message: toFriendlyApiErrorMessage({
          bodyText: apiResponse.message,
          fallback: this.fallbackMessages.getByUserId,
          notFoundMessage: "Không tìm thấy lịch sử sử dụng voucher của người dùng.",
        }),
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    } catch (error) {
      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: error instanceof Error ? error.message : null,
          fallback: this.fallbackMessages.getByUserId,
          notFoundMessage: "Không tìm thấy lịch sử sử dụng voucher của người dùng.",
        }),
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    }
  }

  /**
   * Get voucher usages by voucher ID (paginated)
   */
  async getByVoucherId(voucherId: number, page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<VoucherUsage>>> {
    try {
      const params = new URLSearchParams({
        voucherId: voucherId.toString(),
        page: page.toString(),
        pageNo: page.toString(),
        size: size.toString(),
      });
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
        const bodyText = await response.text().catch(() => null);
        return {
          success: false,
          message: toFriendlyApiErrorMessage({
            status: response.status,
            bodyText,
            fallback: this.fallbackMessages.getByVoucherId,
            notFoundMessage: "Không tìm thấy lịch sử sử dụng của voucher.",
          }),
          data: { items: [], pageInfo: this.extractPageInfo(null) },
        };
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
        message: toFriendlyApiErrorMessage({
          bodyText: apiResponse.message,
          fallback: this.fallbackMessages.getByVoucherId,
          notFoundMessage: "Không tìm thấy lịch sử sử dụng voucher.",
        }),
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    } catch (error) {
      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: error instanceof Error ? error.message : null,
          fallback: this.fallbackMessages.getByVoucherId,
          notFoundMessage: "Không tìm thấy lịch sử sử dụng của voucher.",
        }),
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
        const bodyText = await response.text().catch(() => null);
        return {
          success: false,
          message: toFriendlyApiErrorMessage({
            status: response.status,
            bodyText,
            fallback: this.fallbackMessages.create,
            notFoundMessage: "Không tìm thấy voucher hoặc người dùng.",
          }),
        };
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
        message: toFriendlyApiErrorMessage({
          bodyText: apiResponse.message,
          fallback: this.fallbackMessages.create,
          notFoundMessage: "Không tìm thấy voucher hoặc người dùng.",
        }),
      };
    } catch (error) {
      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: error instanceof Error ? error.message : null,
          fallback: this.fallbackMessages.create,
          notFoundMessage: "Không tìm thấy voucher hoặc người dùng.",
        }),
      };
    }
  }
}
