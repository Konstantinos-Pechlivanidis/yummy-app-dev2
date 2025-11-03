import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { ownerApi, userApi } from "../../config/api";
import { queryKeys } from "../../config/queryKeys";
import { translateApiError } from "../../utils/apiErrorHandler";

// The unified useAuthStatus from `useAuth.js` should be used across the app.

export const useOwnerProfile = () =>
  useQuery({
    queryKey: queryKeys.ownerProfile(),
    queryFn: async () => {
      const { data } = await ownerApi.get("/profile");
      return data;
    },
    retry: false,
    onError: (err) => toast.error(translateApiError(err, "owner")),
  });

export const useOwnerLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await ownerApi.post("/login", { email, password });
      return data;
    },
    onSuccess: (data) => {
      toast.success("Επιτυχής σύνδεση.");

      // 1. Set the user in the Redux store IMMEDIATELY.
      dispatch(setUser(data.user || data.owner));

      // 2. Invalidate queries to ensure all data is fresh.
      queryClient.invalidateQueries({ queryKey: queryKeys.authStatus() });

      // 3. Now it's safe to navigate to the CORRECT path.
      navigate("/owner/dashboard");
    },
    onError: (err) => toast.error(translateApiError(err, "auth")),
  });
};

export const useOwnerLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // Owner logout endpoint - verify if it exists, otherwise use user/logout
      // Both should clear the same cookie since they share the same auth system
      try {
        await ownerApi.get("/logout");
      } catch (err) {
        // If owner logout doesn't exist, try user logout endpoint
        await userApi.get("/logout");
      }
    },
    onSuccess: () => {
      toast.success("Αποσυνδεθήκατε.");
      queryClient.clear(); // Clear all queries on logout
      navigate("/login-owner");
    },
    onError: (err) => toast.error(translateApiError(err, "auth")),
  });
};

export const useOwnerRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await ownerApi.post("/register", formData);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Επιτυχής εγγραφή. Έλεγχος email.");
      // Invalidate auth status in case user wants to login immediately
      queryClient.invalidateQueries({ queryKey: queryKeys.authStatus() });
      navigate("/login-owner");
    },
    onError: (err) => toast.error(translateApiError(err, "auth")),
  });
};

export const useUpdateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await ownerApi.patch("/update", updates);
      return data;
    },
    onSuccess: () => {
      toast.success("Το προφίλ ενημερώθηκε.");
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerProfile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.authStatus() });
    },
    onError: (err) => toast.error(translateApiError(err, "owner")),
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (email) => {
      // Owner might use same endpoint as user
      // Try owner endpoint first, fallback to user endpoint
      try {
        const { data } = await ownerApi.post("/resend-verification", { email });
        return data;
      } catch (err) {
        // If owner endpoint doesn't exist, try user endpoint
        const { data } = await userApi.post("/resend-verification", { email });
        return data;
      }
    },
    onSuccess: () => {
      toast.success("Στάλθηκε ξανά email επιβεβαίωσης.");
    },
    onError: (err) => {
      toast.error(translateApiError(err, "auth"));
    },
  });
};