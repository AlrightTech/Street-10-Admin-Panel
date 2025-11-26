/**
 * Environment configuration with type-safe access to environment variables
 */

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  wsUrl: import.meta.env.VITE_WS_URL || "ws://localhost:3000",
} as const;

export default env;
