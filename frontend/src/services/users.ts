import api from "./api";
import { ApiResponse, User, UpdateUserRequest } from "./types";

/**
 * Users Service
 * Handles user profile-related API calls
 */

export const usersService = {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/users/me");
    if (response.data.success && response.data.data) {
      // Update stored user data
      localStorage.setItem("user", JSON.stringify(response.data.data));
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch user profile");
  },

  /**
   * Update current user profile
   */
  async updateCurrentUser(data: UpdateUserRequest): Promise<User> {
    const response = await api.patch<ApiResponse<User>>("/users/me", data);
    if (response.data.success && response.data.data) {
      // Update stored user data
      localStorage.setItem("user", JSON.stringify(response.data.data));
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update user profile");
  },
};

export default usersService;
