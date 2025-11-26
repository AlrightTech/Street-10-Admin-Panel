import api from "./api";
import {
  ApiResponse,
  Auction,
  CreateAuctionRequest,
  PlaceBidRequest,
} from "./types";

/**
 * Auctions Service
 * Handles auction-related API calls
 */

export const auctionsService = {
  /**
   * Get auctions list with filters
   */
  async getAuctions(filters?: {
    state?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ auctions: Auction[]; pagination?: ApiResponse["pagination"] }> {
    const params = new URLSearchParams();

    if (filters?.state) params.append("state", filters.state);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get<ApiResponse<{ auctions: Auction[] }>>(
      `/auctions?${params.toString()}`
    );
    if (response.data.success && response.data.data) {
      return {
        auctions: response.data.data.auctions || [],
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.message || "Failed to fetch auctions");
  },

  /**
   * Get auction by ID
   */
  async getAuctionById(id: string): Promise<Auction> {
    const response = await api.get<ApiResponse<Auction>>(`/auctions/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch auction");
  },

  /**
   * Create auction (vendor/admin only)
   */
  async createAuction(data: CreateAuctionRequest): Promise<Auction> {
    const response = await api.post<ApiResponse<Auction>>("/auctions", data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create auction");
  },

  /**
   * Place bid on auction
   */
  async placeBid(
    auctionId: string,
    data: PlaceBidRequest
  ): Promise<{ bidId: string; message?: string }> {
    const response = await api.post<ApiResponse<{ bidId: string }>>(
      `/auctions/${auctionId}/bid`,
      data
    );
    if (response.data.success && response.data.data) {
      return {
        bidId: response.data.data.bidId,
        message: response.data.message,
      };
    }
    throw new Error(response.data.message || "Failed to place bid");
  },

  /**
   * Update auction state (admin only)
   */
  async updateAuctionState(
    id: string,
    state: Auction["state"]
  ): Promise<Auction> {
    const response = await api.patch<ApiResponse<Auction>>(
      `/auctions/${id}/state`,
      { state }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update auction state");
  },
};

export default auctionsService;
