import api from "./api";
import { ApiResponse, Filter } from "./types";

/**
 * Filters Service
 * Handles filter-related API calls (admin only)
 */

export const filtersService = {
  /**
   * Get all filters (admin only)
   */
  async getFilters(): Promise<Filter[]> {
    const response = await api.get<ApiResponse<{ filters: Filter[] }>>(
      "/admin/filters"
    );
    if (response.data.success && response.data.data) {
      return response.data.data.filters || [];
    }
    throw new Error(response.data.message || "Failed to fetch filters");
  },

  /**
   * Get filter by ID (admin only)
   */
  async getFilterById(id: string): Promise<Filter> {
    const response = await api.get<ApiResponse<Filter>>(`/admin/filters/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch filter");
  },

  /**
   * Create filter (admin only)
   */
  async createFilter(data: {
    key: string;
    type: Filter["type"];
    label?: Record<string, string>;
    options?: any;
  }): Promise<Filter> {
    const response = await api.post<ApiResponse<Filter>>(
      "/admin/filters",
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create filter");
  },

  /**
   * Update filter (admin only)
   */
  async updateFilter(
    id: string,
    data: Partial<{
      key: string;
      type: Filter["type"];
      label?: Record<string, string>;
      options?: any;
    }>
  ): Promise<Filter> {
    const response = await api.patch<ApiResponse<Filter>>(
      `/admin/filters/${id}`,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update filter");
  },

  /**
   * Delete filter (admin only)
   */
  async deleteFilter(id: string): Promise<void> {
    const response = await api.delete<ApiResponse>(`/admin/filters/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete filter");
    }
  },

  /**
   * Assign filter to category (admin only)
   */
  async assignFilterToCategory(
    categoryId: string,
    filterId: string,
    config: {
      displayOrder?: number;
      required?: boolean;
      visibility?: "listing" | "detail" | "admin";
    }
  ): Promise<void> {
    const response = await api.post<ApiResponse>(
      `/categories/${categoryId}/filters`,
      {
        filterId,
        ...config,
      }
    );
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to assign filter to category"
      );
    }
  },

  /**
   * Remove filter from category (admin only)
   */
  async removeFilterFromCategory(
    categoryId: string,
    filterId: string
  ): Promise<void> {
    const response = await api.delete<ApiResponse>(
      `/categories/${categoryId}/filters/${filterId}`
    );
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to remove filter from category"
      );
    }
  },
};

export default filtersService;
