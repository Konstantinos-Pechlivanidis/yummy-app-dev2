import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../store/authSlice";
import { toast } from "react-hot-toast";
import { translateError } from "../utils/translateError";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/user",
  withCredentials: true,
});

export const useAuthStatus = () =>
  useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/auth/status");
      return data;
    },
    retry: false,
  });

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosInstance.post("/register", formData);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["authStatus"]);
    },
    onError: (err) => toast.error(translateError(err)),
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await axiosInstance.post("/login", { email, password });
      return data;
    },
    onSuccess: ({ user }) => {
      dispatch(setUser(user));
      toast.success("Συνδεθήκατε επιτυχώς");
      queryClient.invalidateQueries(["authStatus"]);
    },
    onError: (err) => toast.error(translateError(err)),
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.get("/logout");
    },
    onSuccess: () => {
      dispatch(clearUser());
      toast.success("Αποσυνδεθήκατε με επιτυχία.");
      queryClient.invalidateQueries(["authStatus"]);
      navigate("/");
    },
  });
};

export const useUserProfile = () =>
  useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/profile");
      return data;
    },
    retry: false,
  });

export const useUserPoints = () =>
  useQuery({
    queryKey: ["userPoints"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/points");
      return data;
    },
    retry: false,
  });

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token) => {
      const { data } = await axiosInstance.get(`/verify-email?token=${token}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Το email σου επιβεβαιώθηκε με επιτυχία.");
      queryClient.invalidateQueries(["authStatus"]);
    },
    onError: () => {
      toast.error("Η επιβεβαίωση email απέτυχε ή ο σύνδεσμος έχει λήξει.");
    },
  });
};

export const useResendVerification = () =>
  useMutation({
    mutationFn: async (email) => {
      const { data } = await axiosInstance.post("/resend-verification", {
        email,
      });
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
    queryKey: ["favorites", page],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/favorites", {
        params: { page, pageSize },
      });
      return data;
    },
    retry: false,
  });

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (restaurant_id) => {
      const { data } = await axiosInstance.post("/favorites/toggle", {
        restaurant_id,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Ενημερώθηκε η λίστα αγαπημένων.");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] }); // optional
    },
    onError: (err) => toast.error(translateError(err)),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, updates }) => {
      const { data } = await axiosInstance.put(`/update`, updates); // προσοχή εδώ
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Το προφίλ ενημερώθηκε");
      queryClient.invalidateQueries(["authStatus"]);
      queryClient.invalidateQueries(["userProfile"]);
    },
    onError: (err) => toast.error(translateError(err)),
  });
};
