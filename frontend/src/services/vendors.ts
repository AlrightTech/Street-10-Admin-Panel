import api from "./api";
import {
  ApiResponse,
  Vendor,
  CreateVendorRequest,
  RejectVendorRequest,
} from "./types";

/**
 * Vendors Service
 * Handles vendor-related API calls
 */

export const vendorsService = {
  /**
   * Get vendors list with filters and pagination
   */
  async getVendors(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ vendors: Vendor[]; pagination?: ApiResponse["pagination"] }> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get<ApiResponse<{ vendors: Vendor[] }>>(
      `/vendors?${params.toString()}`
    );
    if (response.data.success && response.data.data) {
      return {
        vendors: response.data.data.vendors || [],
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.message || "Failed to fetch vendors");
  },

  /**
   * Get vendor by ID
   */
  async getVendorById(id: string): Promise<Vendor> {
    const response = await api.get<ApiResponse<Vendor>>(`/vendors/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch vendor");
  },

  /**
   * Create a new vendor (admin only)
   */
  async createVendor(data: CreateVendorRequest): Promise<Vendor> {
    const response = await api.post<ApiResponse<Vendor>>("/vendors", data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create vendor");
  },

  /**
   * Update vendor
   */
  async updateVendor(
    id: string,
    data: Partial<CreateVendorRequest>
  ): Promise<Vendor> {
    const response = await api.patch<ApiResponse<Vendor>>(
      `/vendors/${id}`,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update vendor");
  },

  /**
   * Approve vendor (admin only)
   */
  async approveVendor(id: string): Promise<Vendor> {
    const response = await api.post<ApiResponse<Vendor>>(
      `/vendors/${id}/approve`,
      {}
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to approve vendor");
  },

  /**
   * Reject vendor (admin only)
   */
  async rejectVendor(id: string, data: RejectVendorRequest): Promise<Vendor> {
    const response = await api.post<ApiResponse<Vendor>>(
      `/vendors/${id}/reject`,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to reject vendor");
  },

  /**
   * Suspend vendor (admin only)
   */
  async suspendVendor(id: string): Promise<Vendor> {
    const response = await api.post<ApiResponse<Vendor>>(
      `/vendors/${id}/suspend`,
      {}
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to suspend vendor");
  },

  /**
   * Get current vendor profile (for vendors)
   */
  async getMyProfile(): Promise<Vendor> {
    const response = await api.get<ApiResponse<{ vendor: Vendor }>>('/vendors/me');
    if (response.data.success && response.data.data) {
      return response.data.data.vendor;
    }
    throw new Error(response.data.message || "Failed to fetch vendor profile");
  },
};

export default vendorsService;
