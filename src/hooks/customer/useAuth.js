import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../store/authSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { userApi, authApi } from "../../config/api";
import { queryKeys } from "../../config/queryKeys";
import { translateApiError } from "../../utils/apiErrorHandler";

/**
 * Primary, unified auth status for the whole app.
 * Uses /api/v1/auth/status and works for both roles.
 */
export const useAuthStatus = () =>
  useQuery({
    queryKey: queryKeys.authStatus(),
    queryFn: async () => {
      const { data } = await authApi.get("/status");
      return data; // { loggedIn, user } or { authenticated, user, role }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

/* =============================== CUSTOMER ============================== */

export const useRegister = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await userApi.post("/register", formData);
      return data; // { message, user }
    },
    onSuccess: ({ message, user }) => {
      toast.success(message || "Επιτυχής εγγραφή.");
      if (user) {
        dispatch(setUser(user));
      }
      qc.invalidateQueries({ queryKey: queryKeys.authStatus() });
    },
    onError: (err) =>
      toast.error(translateApiError(err, "auth", "Η εγγραφή απέτυχε.")),
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await userApi.post("/login", { email, password });
      return data; // { user } or { message, user }
    },
    onSuccess: (data) => {
      const user = data.user || data;
      if (user) {
        dispatch(setUser(user));
      }
      toast.success(data.message || "Συνδεθήκατε επιτυχώς.");
      qc.invalidateQueries({ queryKey: queryKeys.authStatus() });
    },
    onError: (err) =>
      toast.error(translateApiError(err, "auth", "Η σύνδεση απέτυχε.")),
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await userApi.get("/logout");
    },
    onSuccess: () => {
      dispatch(clearUser());
      toast.success("Αποσυνδεθήκατε με επιτυχία.");
      qc.invalidateQueries({ queryKey: queryKeys.authStatus() });
      qc.clear(); // Clear all cached queries
      navigate("/");
    },
    onError: (err) => toast.error(translateApiError(err, "auth")),
  });
};

export const useUserProfile = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: queryKeys.userProfile(),
    queryFn: async () => {
      const { data } = await userApi.get("/profile");
      if (data) {
        dispatch(setUser(data));
      }
      return data;
    },
    retry: false,
    onError: (err) =>
      toast.error(translateApiError(err, "auth", "Αποτυχία φόρτωσης προφίλ.")),
  });
};

export const useUserPoints = () =>
  useQuery({
    queryKey: queryKeys.userPoints(),
    queryFn: async () => {
      const { data } = await userApi.get("/points");
      return data;
    },
    retry: false,
    onError: (err) =>
      toast.error(translateApiError(err, "auth", "Αποτυχία φόρτωσης πόντων.")),
  });

export const useVerifyEmail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (token) => {
      const { data } = await userApi.get(`/verify-email?token=${token}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Το email σου επιβεβαιώθηκε με επιτυχία.");
      qc.invalidateQueries({ queryKey: queryKeys.authStatus() });
    },
    onError: () =>
      toast.error("Η επιβεβαίωση email απέτυχε ή ο σύνδεσμος έχει λήξει."),
  });
};

export const useResendVerification = () =>
  useMutation({
    mutationFn: async (email) => {
      const { data } = await userApi.post("/resend-verification", { email });
      return data;
    },
    onSuccess: () =>
      toast.success(
        "Το email επιβεβαίωσης στάλθηκε ξανά. Έλεγξε τα εισερχόμενά σου."
      ),
    onError: () =>
      toast.error("Δεν ήταν δυνατή η αποστολή του email επιβεβαίωσης."),
  });

export const useFavoriteRestaurants = (page = 1, pageSize = 6) =>
  useQuery({
    queryKey: queryKeys.favorites(page, pageSize),
    queryFn: async () => {
      const { data } = await userApi.get("/favorites", {
        params: { page, pageSize },
      });
      return data;
    },
    retry: false,
    onError: (err) =>
      toast.error(translateApiError(err, "auth", "Αποτυχία φόρτωσης αγαπημένων.")),
  });

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (restaurantId) => {
      const { data } = await userApi.post("/favorites/toggle", {
        restaurant_id: restaurantId,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Ενημερώθηκε η λίστα αγαπημένων.");
      qc.invalidateQueries({ queryKey: queryKeys.favorites() });
      qc.invalidateQueries({ queryKey: queryKeys.userProfile() });
    },
    onError: () => toast.error("Αποτυχία ενημέρωσης αγαπημένων."),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({ updates }) => {
      const { data } = await userApi.patch(`/update`, updates);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Το προφίλ ενημερώθηκε.");
      // Update user in Redux if returned
      if (data.user) {
        dispatch(setUser(data.user));
      }
      qc.invalidateQueries({ queryKey: queryKeys.authStatus() });
      qc.invalidateQueries({ queryKey: queryKeys.userProfile() });
    },
    onError: (err) =>
      toast.error(translateApiError(err, "auth", "Η ενημέρωση προφίλ απέτυχε.")),
  });
};
