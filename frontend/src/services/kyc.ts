import api from "./api";
import { ApiResponse, KYCSubmission, SubmitKYCRequest } from "./types";

/**
 * KYC Service
 * Handles KYC-related API calls
 */

export const kycService = {
  /**
   * Submit KYC documents
   */
  async submitKYC(data: SubmitKYCRequest): Promise<KYCSubmission> {
    const response = await api.post<ApiResponse<KYCSubmission>>(
      "/kyc/submit",
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to submit KYC");
  },

  /**
   * Get KYC status
   */
  async getKYCStatus(): Promise<KYCSubmission> {
    const response = await api.get<ApiResponse<KYCSubmission>>("/kyc/status");
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch KYC status");
  },

  /**
   * Approve KYC (admin only)
   */
  async approveKYC(submissionId: string): Promise<KYCSubmission> {
    const response = await api.post<ApiResponse<KYCSubmission>>(
      "/kyc/approve",
      { submissionId }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to approve KYC");
  },

  /**
   * Reject KYC (admin only)
   */
  async rejectKYC(
    submissionId: string,
    reason: string
  ): Promise<KYCSubmission> {
    const response = await api.post<ApiResponse<KYCSubmission>>("/kyc/reject", {
      submissionId,
      reason,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to reject KYC");
  },
};

export default kycService;
