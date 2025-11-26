import api from "./api";
import {
  ApiResponse,
  Product,
  ProductFilters,
  CreateProductRequest,
} from "./types";

/**
 * Products Service
 * Handles product-related API calls
 */

export const productsService = {
  /**
   * Get products list with filters and pagination
   */
  async getProducts(
    filters?: ProductFilters
  ): Promise<{ products: Product[]; pagination?: ApiResponse["pagination"] }> {
    const params = new URLSearchParams();

    if (filters?.category_id) params.append("category_id", filters.category_id);
    if (filters?.vendor_id) params.append("vendor_id", filters.vendor_id);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.filters) params.append("filters", filters.filters);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get<ApiResponse<{ products: Product[] }>>(
      `/products?${params.toString()}`
    );
    if (response.data.success && response.data.data) {
      return {
        products: response.data.data.products || [],
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.message || "Failed to fetch products");
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch product");
  },

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>("/products", data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create product");
  },

  /**
   * Update product
   */
  async updateProduct(
    id: string,
    data: Partial<CreateProductRequest>
  ): Promise<Product> {
    const response = await api.patch<ApiResponse<Product>>(
      `/products/${id}`,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update product");
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    const response = await api.delete<ApiResponse>(`/products/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete product");
    }
  },
};

export default productsService;
