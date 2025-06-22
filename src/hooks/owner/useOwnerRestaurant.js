import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1/restaurant",
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

// GET: Φέρνει το εστιατόριο του ιδιοκτήτη (μέσω JWT)
export const useOwnerRestaurant = () => {
  return useQuery({
    queryKey: ["ownerRestaurant"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/owner"); // ή π.χ. `/my-restaurant`
      return data.restaurant;
    },
    retry: false,
    onError: (err) => toast.error(translateRestaurantError(err)),
  });
};

// PATCH: Ενημερώνει το εστιατόριο του ιδιοκτήτη
export const useUpdateOwnerRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data } = await axiosInstance.patch(`/${id}`, updates);
      return data.restaurant;
    },
    onSuccess: () => {
      toast.success("Το προφίλ του εστιατορίου ενημερώθηκε.");
      queryClient.invalidateQueries(["ownerRestaurant"]);
    },
    onError: (err) => toast.error(translateRestaurantError(err)),
  });
};
