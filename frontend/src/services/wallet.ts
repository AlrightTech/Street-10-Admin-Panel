import api from "./api";
import {
  ApiResponse,
  Wallet,
  WalletTransaction,
  DepositRequest,
} from "./types";

/**
 * Wallet Service
 * Handles wallet-related API calls
 */

export const walletService = {
  /**
   * Get wallet balance
   */
  async getBalance(): Promise<Wallet> {
    const response = await api.get<ApiResponse<Wallet>>("/wallet/balance");
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch wallet balance");
  },

  /**
   * Deposit to wallet
   */
  async deposit(data: DepositRequest): Promise<WalletTransaction> {
    const response = await api.post<ApiResponse<WalletTransaction>>(
      "/wallet/deposit",
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to deposit");
  },

  /**
   * Get wallet transactions
   */
  async getTransactions(filters?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<{
    transactions: WalletTransaction[];
    pagination?: ApiResponse["pagination"];
  }> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.type) params.append("type", filters.type);

    const response = await api.get<
      ApiResponse<{ transactions: WalletTransaction[] }>
    >(`/wallet/transactions?${params.toString()}`);
    if (response.data.success && response.data.data) {
      return {
        transactions: response.data.data.transactions || [],
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.message || "Failed to fetch transactions");
  },
};

export default walletService;
