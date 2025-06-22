import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1/owner",
  withCredentials: true,
});

const translateOwnerError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Παρουσιάστηκε άγνωστο σφάλμα.";

  if (message.includes("No token")) return "Δεν είστε συνδεδεμένος.";
  if (message.includes("Invalid token")) return "Η συνεδρία έληξε. Παρακαλώ συνδεθείτε ξανά.";
  if (message.includes("Owner already exists")) return "Υπάρχει ήδη λογαριασμός με αυτό το email.";
  if (message.includes("Owner not found")) return "Ο ιδιοκτήτης δεν βρέθηκε.";
  if (message.includes("Unauthorized")) return "Δεν έχετε πρόσβαση.";
  if (message.includes("Invalid credentials")) return "Λανθασμένα στοιχεία σύνδεσης.";

  return "Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά.";
};

export const useOwnerAuthStatus = () =>
  useQuery({
    queryKey: ["ownerAuthStatus"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/auth/status");
      return data;
    },
    retry: false,
    onError: (err) => toast.error(translateOwnerError(err)),
  });

export const useOwnerProfile = () =>
  useQuery({
    queryKey: ["ownerProfile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/profile");
      return data;
    },
    retry: false,
    onError: (err) => toast.error(translateOwnerError(err)),
  });

export const useOwnerLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await axiosInstance.post("/login", { email, password });
      return data;
    },
    onSuccess: () => {
      toast.success("Επιτυχής σύνδεση.");
      queryClient.invalidateQueries(["ownerAuthStatus"]);
      queryClient.invalidateQueries(["ownerProfile"]);
      navigate("/owner/dashboard");
    },
    onError: (err) => toast.error(translateOwnerError(err)),
  });
};

export const useOwnerLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.get("/logout");
    },
    onSuccess: () => {
      toast.success("Αποσυνδεθήκατε.");
      queryClient.clear();
      navigate("/owner/login");
    },
    onError: (err) => toast.error(translateOwnerError(err)),
  });
};

export const useOwnerRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosInstance.post("/register", formData);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Επιτυχής εγγραφή. Έλεγχος email.");
      navigate("/owner/login");
    },
    onError: (err) => toast.error(translateOwnerError(err)),
  });
};

export const useUpdateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await axiosInstance.patch("/update", updates);
      return data;
    },
    onSuccess: () => {
      toast.success("Το προφίλ ενημερώθηκε.");
      queryClient.invalidateQueries(["ownerProfile"]);
    },
    onError: (err) => toast.error(translateOwnerError(err)),
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (email) => {
      const { data } = await axiosInstance.post("/resend-verification", { email });
      return data;
    },
    onSuccess: () => {
      toast.success("Στάλθηκε ξανά email επιβεβαίωσης.");
    },
    onError: (err) => {
      toast.error(translateOwnerError(err));
    },
  });
};

