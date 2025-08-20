import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../store/authSlice";
import { toast } from "react-hot-toast";
import { translateError } from "../../utils/translateError";
import { useNavigate } from "react-router-dom";

/* ----------------------------- axios setup ----------------------------- */
const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000";

const userAxios = axios.create({
  baseURL: `${API_BASE}/api/v1/user`,
  withCredentials: true,
});

const authAxios = axios.create({
  baseURL: `${API_BASE}/api/v1/auth`,
  withCredentials: true,
});

/* --------------------------- shared helpers ---------------------------- */
const errToast = (err, fallback = "Παρουσιάστηκε σφάλμα.") =>
  toast.error(
    err?.response?.data?.message || err?.message || translateError?.(err) || fallback
  );

/**
 * Primary, unified auth status for the whole app.
 * Uses /api/v1/auth/status and works for both roles.
 */
export const useAuthStatus = () =>
  useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      const { data } = await authAxios.get("/status");
      return data; // { authenticated, user, role }
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
      const { data } = await userAxios.post("/register", formData);
      return data; // { message, user }
    },
    onSuccess: ({ message, user }) => {
      toast.success(message || "Επιτυχής εγγραφή.");
      dispatch(setUser(user));
      qc.invalidateQueries({ queryKey: ["authStatus"] });
    },
    onError: (err) => errToast(err, "Η εγγραφή απέτυχε."),
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await userAxios.post("/login", { email, password });
      return data; // { user }
    },
    onSuccess: ({ user }) => {
      dispatch(setUser(user));
      toast.success("Συνδεθήκατε επιτυχώς.");
      qc.invalidateQueries({ queryKey: ["authStatus"] });
    },
    onError: (err) => errToast(err, "Η σύνδεση απέτυχε."),
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await userAxios.get("/logout");
    },
    onSuccess: () => {
      dispatch(clearUser());
      toast.success("Αποσυνδεθήκατε με επιτυχία.");
      qc.invalidateQueries({ queryKey: ["authStatus"] });
      navigate("/");
    },
    onError: (err) => errToast(err),
  });
};

export const useUserProfile = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await userAxios.get("/profile");
      dispatch(setUser(data));
      return data;
    },
    retry: false,
    onError: (err) => errToast(err, "Αποτυχία φόρτωσης προφίλ."),
  });
};

export const useUserPoints = () =>
  useQuery({
    queryKey: ["userPoints"],
    queryFn: async () => {
      const { data } = await userAxios.get("/points");
      return data;
    },
    retry: false,
    onError: (err) => errToast(err, "Αποτυχία φόρτωσης πόντων."),
  });

export const useVerifyEmail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (token) => {
      const { data } = await userAxios.get(`/verify-email?token=${token}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Το email σου επιβεβαιώθηκε με επιτυχία.");
      qc.invalidateQueries({ queryKey: ["authStatus"] });
    },
    onError: () =>
      toast.error("Η επιβεβαίωση email απέτυχε ή ο σύνδεσμος έχει λήξει."),
  });
};

export const useResendVerification = () =>
  useMutation({
    mutationFn: async (email) => {
      const { data } = await userAxios.post("/resend-verification", { email });
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
    queryKey: ["favorites", page, pageSize],
    queryFn: async () => {
      const { data } = await userAxios.get("/favorites", {
        params: { page, pageSize },
      });
      return data;
    },
    retry: false,
    onError: (err) => errToast(err, "Αποτυχία φόρτωσης αγαπημένων."),
  });

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (restaurantId) => {
      const { data } = await userAxios.post("/favorites/toggle", {
        restaurant_id: restaurantId,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Ενημερώθηκε η λίστα αγαπημένων.");
      qc.invalidateQueries({ queryKey: ["favorites"] });
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: () => toast.error("Αποτυχία ενημέρωσης αγαπημένων."),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ updates }) => {
      const { data } = await userAxios.patch(`/update`, updates);
      return data;
    },
    onSuccess: () => {
      toast.success("Το προφίλ ενημερώθηκε.");
      qc.invalidateQueries({ queryKey: ["authStatus"] });
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (err) => errToast(err, "Η ενημέρωση προφίλ απέτυχε."),
  });
};
