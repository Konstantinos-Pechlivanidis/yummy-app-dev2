/**
 * Environment Variable Validation
 * Validates that all required environment variables are set on app startup
 */

const requiredEnvVars = [
  // Add required environment variables here
  // Example: 'VITE_API_BASE_URL',
];

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variable is missing
 */
export const validateEnv = () => {
  const missing = requiredEnvVars.filter((varName) => {
    const hasInProcess = typeof process !== "undefined" && process.env && process.env[varName];
    const hasInImportMeta =
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env[varName];

    return !hasInProcess && !hasInImportMeta;
  });

  if (missing.length > 0 && process.env.NODE_ENV !== "test") {
    const errorMessage = `Missing required environment variables: ${missing.join(", ")}`;
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.error(errorMessage);
    }
    // In production, throw error
    if (process.env.NODE_ENV === "production") {
      throw new Error(errorMessage);
    }
  }
};

