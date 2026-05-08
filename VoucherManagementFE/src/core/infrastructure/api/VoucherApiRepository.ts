import { Voucher } from "../../domain/entities/Voucher";
import { IVoucherRepository } from "../../domain/repositories/IVoucherRepository";
import { ApiResponse, PaginatedResponse, PageInfo } from "../../domain/entities/ApiResponse";

/**
 * VoucherApiRepository - Implements IVoucherRepository
 * Handles all HTTP communication with the backend for voucher operations
 * API response format: { success, message, data: { content: [...], pageNo, pageSize, totalElements, totalPages, last } }
 */
export class VoucherApiRepository implements IVoucherRepository {
  private readonly baseUrl = "/api";
  private readonly endpoint = "/vouchers";

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
   * Map raw API data to Voucher entity
   */
  private mapToVoucher(v: any): Voucher {
    return new Voucher(
      v.code,
      v.discountPercent,
      v.quantity,
      v.expiredDate,
      v.status || "ACTIVE",
      v.id,
      v.createdAt
    );
  }

  /**
   * Get all vouchers (paginated)
   */
  async getAll(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<Voucher>>> {
    try {
      const params = new URLSearchParams({ page: page.toString(), pageNo: page.toString(), size: size.toString() });
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
        const vouchers = content.map((v: any) => this.mapToVoucher(v));
        const pageInfo = this.extractPageInfo(apiResponse.data);

        return {
          success: true,
          message: apiResponse.message,
          data: { items: vouchers, pageInfo },
        };
      }

      return {
        success: false,
        message: apiResponse.message || "Failed to fetch vouchers",
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error fetching vouchers",
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    }
  }

  /**
   * Get single voucher by ID
   */
  async getById(id: number): Promise<ApiResponse<Voucher>> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
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
        const voucher = this.mapToVoucher(apiResponse.data);
        return {
          success: true,
          message: apiResponse.message,
          data: voucher,
        };
      }

      return {
        success: false,
        message: apiResponse.message || "Voucher not found",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error fetching voucher",
      };
    }
  }

  /**
   * Create a new voucher
   */
  async create(voucher: Voucher): Promise<ApiResponse<Voucher>> {
    try {
      const payload = {
        code: voucher.code,
        discountPercent: voucher.discountPercent,
        quantity: voucher.quantity,
        expiredDate: voucher.expiredDate,
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
        const createdVoucher = this.mapToVoucher(apiResponse.data);
        return {
          success: true,
          message: apiResponse.message,
          data: createdVoucher,
        };
      }

      return {
        success: false,
        message: apiResponse.message || "Failed to create voucher",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error creating voucher",
      };
    }
  }

  /**
   * Update existing voucher
   */
  async update(id: number, voucher: Voucher): Promise<ApiResponse<Voucher>> {
    try {
      const payload = {
        code: voucher.code,
        discountPercent: voucher.discountPercent,
        quantity: voucher.quantity,
        expiredDate: voucher.expiredDate,
      };

      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: "PUT",
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
        const updatedVoucher = this.mapToVoucher(apiResponse.data);
        return {
          success: true,
          message: apiResponse.message,
          data: updatedVoucher,
        };
      }

      return {
        success: false,
        message: apiResponse.message || "Failed to update voucher",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error updating voucher",
      };
    }
  }

  /**
   * Delete voucher by ID
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const apiResponse: ApiResponse<void> = await response.json();

      return {
        success: apiResponse.success,
        message:
          apiResponse.message || "Voucher deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error deleting voucher",
      };
    }
  }

  /**
   * Search vouchers by code (paginated)
   */
  async search(code: string, page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<Voucher>>> {
    // Try multiple common search endpoints/param names to be resilient
    const variants = [
      { path: `${this.baseUrl}${this.endpoint}/search`, params: { code, page: page.toString(), pageNo: page.toString(), size: size.toString() } },
      { path: `${this.baseUrl}${this.endpoint}`, params: { code, page: page.toString(), pageNo: page.toString(), size: size.toString() } },
      { path: `${this.baseUrl}${this.endpoint}`, params: { search: code, page: page.toString(), pageNo: page.toString(), size: size.toString() } },
      { path: `${this.baseUrl}${this.endpoint}`, params: { q: code, page: page.toString(), pageNo: page.toString(), size: size.toString() } },
    ];

    for (const variant of variants) {
      try {
        const params = new URLSearchParams(variant.params as Record<string, string>);
        const url = `${variant.path}?${params.toString()}`;
        console.debug("VoucherApiRepository.search: trying URL", url);
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          // try to read response body for error detail
          let bodyText: string | null = null;
          try {
            bodyText = await response.text();
          } catch (e) {
            bodyText = null;
          }
          console.debug("VoucherApiRepository.search: response not ok", response.status, url, bodyText);

          // If client error (400-499) we should surface it instead of trying other variants
          if (response.status >= 400 && response.status < 500) {
            const message = bodyText || `HTTP Error: ${response.status}`;
            return {
              success: false,
              message,
              data: { items: [], pageInfo: this.extractPageInfo(null) },
            };
          }

          // otherwise try next variant
          continue;
        }

        const apiResponse: ApiResponse<any> = await response.json();
        console.debug("VoucherApiRepository.search: apiResponse", url, apiResponse);

        if (apiResponse.success && apiResponse.data) {
          const data = apiResponse.data;

          // If API returned a paginated structure or an array
          if (Array.isArray(data) || (data?.content && Array.isArray(data.content))) {
            const content = this.extractContent(data);
            const vouchers = content.map((v: any) => this.mapToVoucher(v));
            const pageInfo = this.extractPageInfo(data);

            return {
              success: true,
              message: apiResponse.message,
              data: { items: vouchers, pageInfo },
            };
          }

          // If API returned a single voucher object, map it to an array
          if (data && typeof data === "object") {
            // Detect typical voucher object by presence of `id` or `code`
            if (data.id || data.code) {
              const voucher = this.mapToVoucher(data);
              const pageInfo: PageInfo = {
                pageNo: 0,
                pageSize: 1,
                totalElements: 1,
                totalPages: 1,
                last: true,
              };

              return {
                success: true,
                message: apiResponse.message,
                data: { items: [voucher], pageInfo },
              };
            }
          }
        }
        // if response OK but API indicates failure, try next variant
      } catch (error) {
        // try next variant
        continue;
      }
    }

    // All variants failed
    return {
      success: false,
      message: "Search failed: no compatible endpoint responded",
      data: { items: [], pageInfo: this.extractPageInfo(null) },
    };
  }
}
