import api from "./api";
import {
  ApiResponse,
  DashboardStats,
  UserStatistics,
  SalesStatistics,
} from "./types";

/**
 * Admin Service
 * Handles admin-related API calls
 */

export const adminService = {
  /**
   * Get dashboard statistics
   */
  async getDashboard(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>(
      "/admin/dashboard"
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch dashboard statistics"
    );
  },

  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<UserStatistics> {
    const response = await api.get<ApiResponse<UserStatistics>>(
      "/admin/stats/users"
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch user statistics");
  },

  /**
   * Get sales statistics
   */
  async getSalesStatistics(): Promise<SalesStatistics> {
    const response = await api.get<ApiResponse<SalesStatistics>>(
      "/admin/stats/sales"
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch sales statistics"
    );
  },

  /**
   * Get audit logs
   */
  async getAuditLogs(filters?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
  }): Promise<{ logs: any[]; pagination?: ApiResponse["pagination"] }> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.action) params.append("action", filters.action);

    const response = await api.get<ApiResponse<{ logs: any[] }>>(
      `/admin/audit-logs?${params.toString()}`
    );
    if (response.data.success && response.data.data) {
      return {
        logs: response.data.data.logs || [],
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.message || "Failed to fetch audit logs");
  },
};

export default adminService;
