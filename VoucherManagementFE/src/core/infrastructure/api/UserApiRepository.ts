import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ApiResponse, PaginatedResponse, PageInfo } from "../../domain/entities/ApiResponse";
import { toFriendlyApiErrorMessage } from "./apiErrorMessages";

/**
 * UserApiRepository - Implements IUserRepository
 * Handles all HTTP communication with the backend for user operations
 * API response format: { success, message, data: { content: [...], pageNo, pageSize, totalElements, totalPages, last } }
 */
export class UserApiRepository implements IUserRepository {
  private readonly baseUrl = "/api";
  private readonly endpoint = "/users";
  private readonly fallbackMessages = {
    getAll: "Không thể tải danh sách người dùng. Vui lòng thử lại sau.",
    getById: "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
    create: "Không thể tạo người dùng. Vui lòng thử lại sau.",
    update: "Không thể cập nhật người dùng. Vui lòng thử lại sau.",
    delete: "Không thể xóa người dùng. Vui lòng thử lại sau.",
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
   * Map raw API data to User entity
   */
  private mapToUser(u: any): User {
    return new User(
      u.fullName,
      u.email,
      u.phone,
      u.id,
      u.createdAt
    );
  }

  /**
   * Get all users (paginated)
   */
  async getAll(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      const params = new URLSearchParams({ page: page.toString(), pageNo: page.toString(), size: size.toString() });
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
            notFoundMessage: "Không tìm thấy người dùng.",
          }),
          data: { items: [], pageInfo: this.extractPageInfo(null) },
        };
      }

      const apiResponse: ApiResponse<any> = await response.json();

      if (apiResponse.success && apiResponse.data) {
        const content = this.extractContent(apiResponse.data);
        const users = content.map((u: any) => this.mapToUser(u));
        const pageInfo = this.extractPageInfo(apiResponse.data);

        return {
          success: true,
          message: apiResponse.message,
          data: { items: users, pageInfo },
        };
      }

      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: apiResponse.message,
          fallback: this.fallbackMessages.getAll,
          notFoundMessage: "Không tìm thấy người dùng.",
        }),
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    } catch (error) {
      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: error instanceof Error ? error.message : null,
          fallback: this.fallbackMessages.getAll,
          notFoundMessage: "Không tìm thấy người dùng.",
        }),
        data: { items: [], pageInfo: this.extractPageInfo(null) },
      };
    }
  }

  /**
   * Get single user by ID
   */
  async getById(id: number): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
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
            fallback: this.fallbackMessages.getById,
            notFoundMessage: "Không tìm thấy người dùng.",
          }),
        };
      }

      const apiResponse: ApiResponse<any> = await response.json();

      if (apiResponse.success && apiResponse.data) {
        const user = this.mapToUser(apiResponse.data);
        return {
          success: true,
          message: apiResponse.message,
          data: user,
        };
      }

      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: apiResponse.message,
          fallback: this.fallbackMessages.getById,
          notFoundMessage: "Không tìm thấy người dùng.",
        }),
      };
    } catch (error) {
      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: error instanceof Error ? error.message : null,
          fallback: this.fallbackMessages.getById,
          notFoundMessage: "Không tìm thấy người dùng.",
        }),
      };
    }
  }

  /**
   * Create a new user
   */
  async create(user: User): Promise<ApiResponse<User>> {
    try {
      const payload = {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
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
            notFoundMessage: "Không tìm thấy người dùng.",
          }),
        };
      }

      const apiResponse: ApiResponse<any> = await response.json();

      if (apiResponse.success && apiResponse.data) {
        const createdUser = this.mapToUser(apiResponse.data);
        return {
          success: true,
          message: apiResponse.message,
          data: createdUser,
        };
      }

      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: apiResponse.message,
          fallback: this.fallbackMessages.create,
          notFoundMessage: "Không tìm thấy người dùng.",
        }),
      };
    } catch (error) {
      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: error instanceof Error ? error.message : null,
          fallback: this.fallbackMessages.create,
          notFoundMessage: "Không tìm thấy người dùng.",
        }),
      };
    }
  }

  /**
   * Update existing user
   */
  async update(id: number, user: User): Promise<ApiResponse<User>> {
    try {
      const payload = {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      };

      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: "PUT",
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
            fallback: this.fallbackMessages.update,
            notFoundMessage: "Không tìm thấy người dùng.",
          }),
        };
      }

      const apiResponse: ApiResponse<any> = await response.json();

      if (apiResponse.success && apiResponse.data) {
        const updatedUser = this.mapToUser(apiResponse.data);
        return {
          success: true,
          message: apiResponse.message,
          data: updatedUser,
        };
      }

      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: apiResponse.message,
          fallback: this.fallbackMessages.update,
          notFoundMessage: "Không tìm thấy người dùng.",
        }),
      };
    } catch (error) {
      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: error instanceof Error ? error.message : null,
          fallback: this.fallbackMessages.update,
          notFoundMessage: "Không tìm thấy người dùng.",
        }),
      };
    }
  }

  /**
   * Delete user by ID
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
        const bodyText = await response.text().catch(() => null);
        return {
          success: false,
          message: toFriendlyApiErrorMessage({
            status: response.status,
            bodyText,
            fallback: this.fallbackMessages.delete,
            notFoundMessage: "Không tìm thấy người dùng.",
          }),
        };
      }

      const apiResponse: ApiResponse<void> = await response.json();

      return {
        success: apiResponse.success,
        message:
          apiResponse.message || "User deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: toFriendlyApiErrorMessage({
          bodyText: error instanceof Error ? error.message : null,
          fallback: this.fallbackMessages.delete,
          notFoundMessage: "Không tìm thấy người dùng.",
        }),
      };
    }
  }
}
