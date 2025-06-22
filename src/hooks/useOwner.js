import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1/owner",
  withCredentials: true,
});

export const useOwner = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ Get Owner Auth Status
  const ownerAuthStatus = useQuery({
    queryKey: ["ownerAuthStatus"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/auth/status");
      return data;
    },
    retry: false,
  });

  // ✅ Get Owner Profile
  const ownerProfile = useQuery({
    queryKey: ["ownerProfile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/profile");
      return data;
    },
    retry: false,
  });

  // ✅ Login
  const ownerLogin = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await axiosInstance.post("/login", { email, password });
      return data;
    },
    onSuccess: () => {
      toast.success("Επιτυχής σύνδεση!");
      queryClient.invalidateQueries(["ownerAuthStatus"]);
      queryClient.invalidateQueries(["ownerProfile"]);
      navigate("/owner/dashboard");
    },
    onError: () => {
      toast.error("Λάθος email ή κωδικός.");
    },
  });

  // ✅ Logout
  const ownerLogout = useMutation({
    mutationFn: async () => {
      await axiosInstance.get("/logout");
    },
    onSuccess: () => {
      toast.success("Αποσυνδεθήκατε.");
      queryClient.clear();
      navigate("/owner/login");
    },
  });

  // ✅ Register
  const ownerRegister = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosInstance.post("/register", formData);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Επιτυχής εγγραφή!");
      navigate("/owner/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Σφάλμα κατά την εγγραφή.");
    },
  });

  // ✅ Update Profile
  const ownerUpdateProfile = useMutation({
    mutationFn: async (updates) => {
      const { data } = await axiosInstance.patch("/update", updates);
      return data;
    },
    onSuccess: () => {
      toast.success("Το προφίλ ενημερώθηκε.");
      queryClient.invalidateQueries(["ownerProfile"]);
    },
    onError: () => {
      toast.error("Αποτυχία ενημέρωσης προφίλ.");
    },
  });

  return {
    ownerAuthStatus,
    ownerProfile,
    ownerLogin,
    ownerLogout,
    ownerRegister,
    ownerUpdateProfile,
  };
};
