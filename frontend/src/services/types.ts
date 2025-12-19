/**
 * API Response Types
 * These types match the backend response structure
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Authentication Types
 */
export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterRequest {
  email?: string;
  phone?: string;
  password?: string;
  provider: "email" | "google" | "apple";
}

export interface VerifyOTPRequest {
  code: string;
  email?: string;
  phone?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email?: string;
  phone?: string;
}

export interface ResetPasswordRequest {
  code: string;
  newPassword: string;
  email?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  message?: string;
}

/**
 * User Types
 */
export interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  role: "user" | "vendor" | "sub-admin" | "super-admin";
  lang?: "en" | "ar";
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  phone?: string;
  lang?: "en" | "ar";
}

/**
 * Product Types
 */
export interface Product {
  id: string;
  title: string;
  description?: string;
  priceMinor: number;
  currency: string;
  stock: number;
  sku?: string;
  status: "draft" | "active" | "inactive";
  categoryIds?: string[];
  attributes?: Record<string, any>;
  langData?: Record<string, { title?: string; description?: string }>;
  vendorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category_id?: string;
  vendor_id?: string;
  status?: string;
  filters?: string; // JSON string
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  priceMinor: number;
  currency?: string;
  stock: number;
  sku?: string;
  categoryIds?: string[];
  attributes?: Record<string, any>;
  langData?: Record<string, { title?: string; description?: string }>;
}

/**
 * Order Types
 */
export interface Order {
  id: string;
  userId: string;
  vendorId: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  totalMinor: number;
  currency: string;
  items: OrderItem[];
  shippingAddress?: Address;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceMinor: number;
  product?: Product;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
}

export interface CreateOrderRequest {
  vendorId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress?: Address;
  paymentMethod?: string;
}

export interface UpdateOrderStatusRequest {
  status: Order["status"];
}

/**
 * Wallet Types
 */
export interface Wallet {
  id: string;
  userId: string;
  balanceMinor: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal" | "refund" | "payment";
  amountMinor: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  refId?: string;
  description?: string;
  createdAt: string;
}

export interface DepositRequest {
  amountMinor: number;
  refId?: string;
}

/**
 * Vendor Types
 */
export interface Vendor {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  commissionRate?: number;
  createdAt: string;
  updatedAt: string;
  profileImageUrl?: string;
  companyDocs?: any;
}

export interface CreateVendorRequest {
  userId: string;
  name: string;
  email?: string;
}

export interface RejectVendorRequest {
  reason: string;
}

/**
 * Category Types
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTree {
  categories: Category[];
}

/**
 * Filter Types
 */
export interface Filter {
  id: string;
  key: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "range"
    | "select"
    | "multi-select"
    | "boolean"
    | "date"
    | "rating";
  label?: Record<string, string>;
  options?: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Types
 */
export interface DashboardStats {
  totalUsers?: number;
  totalVendors?: number;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  recentOrders?: Order[];
}

export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  byRole?: Record<string, number>;
}

export interface SalesStatistics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  period?: string;
}

/**
 * Auction Types
 */
export interface Auction {
  id: string;
  productId: string;
  type: "standard" | "reverse";
  state: "draft" | "scheduled" | "active" | "ended" | "cancelled";
  startAt: string;
  endAt: string;
  currentBidMinor?: number;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuctionRequest {
  productId: string;
  type: "standard" | "reverse";
  startAt: string;
  endAt: string;
}

export interface PlaceBidRequest {
  amountMinor: number;
}

/**
 * KYC Types
 */
export interface KYCSubmission {
  id: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  docsUrls: string[];
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface SubmitKYCRequest {
  docsUrls: string[];
}
