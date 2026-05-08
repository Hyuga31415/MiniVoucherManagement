import { User } from "../entities/User";
import { ApiResponse, PaginatedResponse } from "../entities/ApiResponse";

/**
 * IUserRepository - Repository Interface for User Entity
 * Defines contract for user data access operations
 * Implementation should be provided by infrastructure layer
 */
export interface IUserRepository {
  /**
   * Get all users (paginated)
   */
  getAll(page?: number, size?: number): Promise<ApiResponse<PaginatedResponse<User>>>;

  /**
   * Get single user by ID
   */
  getById(id: number): Promise<ApiResponse<User>>;

  /**
   * Create a new user
   */
  create(user: User): Promise<ApiResponse<User>>;

  /**
   * Update existing user
   */
  update(id: number, user: User): Promise<ApiResponse<User>>;

  /**
   * Delete user by ID
   */
  delete(id: number): Promise<ApiResponse<void>>;
}
