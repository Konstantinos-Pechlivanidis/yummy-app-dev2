import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

// ✅ Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/reservations",
  withCredentials: true,
});

// ✅ Μετάφραση σφαλμάτων σε ελληνικά
const translateReservationError = (error) => {
  const message =
    error?.response?.data?.message || error?.message || "Άγνωστο σφάλμα.";

  if (message.includes("No token")) return "Δεν είστε συνδεδεμένος.";
  if (message.includes("Invalid token")) return "Μη έγκυρο session.";
  if (message.includes("not confirmed")) return "Ο λογαριασμός δεν είναι επιβεβαιωμένος.";
  if (message.includes("Reservation not found")) return "Η κράτηση δεν βρέθηκε.";
  if (message.includes("Failed to create reservation")) return "Η κράτηση απέτυχε.";
  if (message.includes("Failed to cancel reservation")) return "Η ακύρωση απέτυχε.";
  if (message.includes("Failed to delete reservation")) return "Η διαγραφή απέτυχε.";

  return "Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά.";
};

//
// 🔁 1. Όλες οι κρατήσεις χρήστη
//
export const useUserReservations = (userId) => {
  return useQuery({
    queryKey: ["userReservations", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user?user_id=${userId}`);
      return data.reservations;
    },
    enabled: !!userId,
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

//
// 🔎 2. Φιλτραρισμένες κρατήσεις χρήστη
//
export const useFilteredReservations = (userId, date, status, page = 1, pageSize = 10) => {
  const params = new URLSearchParams({
    user_id: userId,
    date: date ?? "",
    status: status ?? "",
    page,
    pageSize,
  }).toString();

  return useQuery({
    queryKey: ["filteredReservations", userId, date, status, page, pageSize],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/filtered?${params}`);
      return data;
    },
    enabled: !!userId,
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

//
// 🔍 3. Μία συγκεκριμένη κράτηση
//
export const useReservationDetails = (reservationId) => {
  return useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/${reservationId}`);
      return data;
    },
    enabled: !!reservationId,
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

//
// ➕ 4. Δημιουργία κράτησης
//
export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationData) => {
      const { data } = await axiosInstance.post("/", reservationData);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Η κράτηση δημιουργήθηκε επιτυχώς!");
      queryClient.invalidateQueries(["userReservations"]);
    },
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

//
// ❌ 5. Ακύρωση κράτησης
//
export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      const { data } = await axiosInstance.post(`/cancel/${reservationId}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση ακυρώθηκε.");
      queryClient.invalidateQueries(["userReservations"]);
    },
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

//
// 🗑️ 6. Διαγραφή κράτησης
//
export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      const { data } = await axiosInstance.delete(`/${reservationId}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση διαγράφηκε.");
      queryClient.invalidateQueries(["userReservations"]);
    },
    onError: (err) => toast.error(translateReservationError(err)),
  });
};
