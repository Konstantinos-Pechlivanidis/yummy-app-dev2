import axios from "axios";

/**
 * Centralized API Configuration
 * 
 * This file provides a single source of truth for all API configuration
 * and pre-configured axios instances for different API resources.
 */

// Get API base URL from environment variables
const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000";

export const API_VERSION = "v1";
export const API_BASE_URL = `${API_BASE}/api/${API_VERSION}`;

/**
 * Creates a configured axios instance for a specific API resource
 * @param {string} basePath - The API path (e.g., '/user', '/restaurant')
 * @returns {AxiosInstance} Configured axios instance
 */
export const createApiClient = (basePath) => {
  const instance = axios.create({
    baseURL: `${API_BASE_URL}${basePath}`,
    withCredentials: true, // Required for HTTP-only cookie authentication
    timeout: 30000, // 30 seconds
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Response interceptor for common error handling
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        // Only redirect if not already on login page
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/login") && !currentPath.includes("/login-owner")) {
          // Clear any auth state
          localStorage.clear();
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Pre-configured API clients for each resource
export const userApi = createApiClient("/user");
export const authApi = createApiClient("/auth");
export const restaurantApi = createApiClient("/restaurant");
export const reservationApi = createApiClient("/reservations");
export const couponApi = createApiClient("/coupons");
export const menuItemApi = createApiClient("/menuItems");
export const specialMenuApi = createApiClient("/specialMenus");
export const ownerApi = createApiClient("/owner");
export const testimonialApi = createApiClient("/testimonials");
export const specialMenuItemApi = createApiClient("/special-menu-items");

// Export API base URL for OAuth redirects and other uses
export { API_BASE };

// Helper to get full OAuth URL
export const getOAuthUrl = (provider, userType = "user") => {
  const basePath = userType === "owner" ? "/owner" : "/user";
  return `${API_BASE_URL}${basePath}/auth/${provider}`;
};

