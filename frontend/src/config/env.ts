/**
 * Environment configuration with type-safe access to environment variables
 */

export const env = {
  // Prefer VITE_API_BASE_URL (your .env), fallback to VITE_API_URL, then default localhost
  apiUrl:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api/v1",
  wsUrl: import.meta.env.VITE_WS_URL || "ws://localhost:3000",
} as const;

export default env;
