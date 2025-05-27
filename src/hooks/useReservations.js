import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/reservations",
  withCredentials: true,
});

const translateReservationError = (error) => {
  const message =
    error?.response?.data?.message || error?.message || "Άγνωστο σφάλμα.";

  if (message.includes("No token")) return "Δεν είστε συνδεδεμένος.";
  if (message.includes("Invalid token")) return "Μη έγκυρο session.";
  if (message.includes("not confirmed"))
    return "Ο λογαριασμός δεν είναι επιβεβαιωμένος.";
  if (message.includes("Reservation not found"))
    return "Η κράτηση δεν βρέθηκε.";
  if (message.includes("Failed to create reservation"))
    return "Η κράτηση απέτυχε.";
  if (message.includes("Failed to cancel reservation"))
    return "Η ακύρωση απέτυχε.";
  if (message.includes("Failed to delete reservation"))
    return "Η διαγραφή απέτυχε.";

  return "Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά.";
};

export const useUserReservations = () => {
  return useQuery({
    queryKey: ["userReservations"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/");
      return data;
    },
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

export const useFilteredReservations = (
  date,
  status,
  page = 1,
  pageSize = 10
) => {
  const params = new URLSearchParams({
    ...(status && { status }),
    ...(date && { date }),
    page,
    pageSize,
  }).toString();

  return useQuery({
    queryKey: ["filteredReservations", date, status, page, pageSize],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/filtered?${params}`);
      return data;
    },
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

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

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationData) => {
      const { data } = await axiosInstance.post("/", reservationData);
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση δημιουργήθηκε επιτυχώς!");
      queryClient.invalidateQueries(["userReservations"]);
    },
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, reason }) => {
      const { data } = await axiosInstance.post(`/cancel/${reservationId}`, {
        reason,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση ακυρώθηκε.");
      queryClient.invalidateQueries(["userReservations"]);
    },
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

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

export const useOwnerConfirmReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      const { data } = await axiosInstance.post("/owner/confirm", {
        reservation_id: reservationId,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση επιβεβαιώθηκε.");
      queryClient.invalidateQueries(["ownerReservations"]);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        "Αποτυχία επιβεβαίωσης κράτησης.";
      toast.error(msg);
    },
  });
};

export const useOwnerCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      const { data } = await axiosInstance.post("/owner/cancel", {
        reservation_id: reservationId,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση ακυρώθηκε.");
      queryClient.invalidateQueries(["ownerReservations"]);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        "Αποτυχία ακύρωσης κράτησης.";
      toast.error(msg);
    },
  });
};

