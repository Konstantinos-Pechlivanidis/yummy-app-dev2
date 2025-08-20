import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: `${API_BASE}/api/v1/restaurant`,
  withCredentials: true,
});

const translateRestaurantError = (error) => {
  const message =
    error?.response?.data?.message || error?.message || "Παρουσιάστηκε σφάλμα.";

  if (message.includes("Unauthorized")) return "Δεν είστε συνδεδεμένος.";
  if (message.includes("Forbidden")) return "Δεν έχετε δικαίωμα πρόσβασης.";
  if (message.includes("not found")) return "Δεν βρέθηκε το εστιατόριο.";
  return message;
};

/** GET: To εστιατόριο του ιδιοκτήτη (με όλα τα σχετικά: menu items, specials, coupons, reservations) */
export const useOwnerRestaurant = () => {
  return useQuery({
    queryKey: ["ownerRestaurant"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/owner");
      return data.restaurant;
    },
    retry: false,
    onError: (err) => toast.error(translateRestaurantError(err)),
  });
};

/** GET: Επισκόπηση ιδιοκτήτη (σύνολα + happy hours) */
export const useOwnerOverview = () => {
  return useQuery({
    queryKey: ["ownerOverview"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/owner/overview");
      return data.restaurants || [];
    },
    retry: false,
    onError: (err) => toast.error(translateRestaurantError(err)),
  });
};

/** PATCH: Ενημέρωση contact JSONB (μόνο) του εστιατορίου του ιδιοκτήτη */
export const useUpdateOwnerContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, contact }) => {
      const payload = { contact }; // controller δέχεται ΜΟΝΟ contact
      const { data } = await axiosInstance.patch(`/${id}`, payload);
      return data.restaurant;
    },
    onSuccess: () => {
      toast.success("Το προφίλ του εστιατορίου ενημερώθηκε.");
      queryClient.invalidateQueries({ queryKey: ["ownerRestaurant"] });
      queryClient.invalidateQueries({ queryKey: ["ownerOverview"] });
    },
    onError: (err) => toast.error(translateRestaurantError(err)),
  });
};
