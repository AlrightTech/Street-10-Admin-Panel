import api from "./api";
import { ApiResponse, Category, CategoryTree, Filter } from "./types";

/**
 * Categories Service
 * Handles category-related API calls
 */

export const categoriesService = {
  /**
   * Get category tree
   */
  async getCategoryTree(): Promise<CategoryTree> {
    const response = await api.get<ApiResponse<CategoryTree>>(
      "/categories/tree"
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch category tree");
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch category");
  },

  /**
   * Get filters for a category
   */
  async getCategoryFilters(categoryId: string): Promise<Filter[]> {
    const response = await api.get<ApiResponse<{ filters: Filter[] }>>(
      `/categories/${categoryId}/filters`
    );
    if (response.data.success && response.data.data) {
      return response.data.data.filters || [];
    }
    throw new Error(
      response.data.message || "Failed to fetch category filters"
    );
  },

  /**
   * Create category (admin only)
   */
  async createCategory(data: {
    name: string;
    slug: string;
    parentId?: string;
  }): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>("/categories", data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create category");
  },

  /**
   * Update category (admin only)
   */
  async updateCategory(
    id: string,
    data: Partial<{ name: string; slug: string; parentId?: string }>
  ): Promise<Category> {
    const response = await api.patch<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update category");
  },

  /**
   * Delete category (admin only)
   */
  async deleteCategory(id: string): Promise<void> {
    const response = await api.delete<ApiResponse>(`/categories/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete category");
    }
  },
};

export default categoriesService;
