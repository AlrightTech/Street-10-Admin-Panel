import api from "./api";
import {
  ApiResponse,
  Order,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from "./types";

/**
 * Orders Service
 * Handles order-related API calls
 */

export const ordersService = {
  /**
   * Get orders list with filters and pagination
   */
  async getOrders(filters?: {
    status?: string;
    vendor_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; pagination?: ApiResponse["pagination"] }> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.vendor_id) params.append("vendor_id", filters.vendor_id);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get<ApiResponse<{ orders: Order[] }>>(
      `/orders?${params.toString()}`
    );
    if (response.data.success && response.data.data) {
      return {
        orders: response.data.data.orders || [],
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.message || "Failed to fetch orders");
  },

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch order");
  },

  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>("/orders", data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create order");
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusRequest
  ): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(
      `/orders/${id}/status`,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update order status");
  },
};

export default ordersService;
