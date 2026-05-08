/**
 * Generic API Response Wrapper
 * Format: { "success": boolean, "message": string, "data": any }
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Pagination metadata from the API
 */
export interface PageInfo {
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/**
 * Paginated API Response - wraps items + pagination metadata
 */
export interface PaginatedResponse<T> {
  items: T[];
  pageInfo: PageInfo;
}
