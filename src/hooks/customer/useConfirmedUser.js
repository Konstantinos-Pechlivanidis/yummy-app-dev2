import { useAuthStatus } from "./useAuth";

/**
 * Hook to check if the current user is confirmed (email verified)
 * @returns {boolean} True if user is confirmed, false otherwise
 */
export const useConfirmedUser = () => {
  const { data: authStatus } = useAuthStatus();
  return authStatus?.user?.confirmed_user === true;
};

