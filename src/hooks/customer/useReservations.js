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
  baseURL: `${API_BASE}/api/v1/reservations`,
  withCredentials: true,
});

const translateReservationError = (error) => {
  const message =
    error?.response?.data?.message || error?.message || "Άγνωστο σφάλμα.";

  if (message.includes("No token")) return "Δεν είστε συνδεδεμένος.";
  if (message.includes("Invalid token")) return "Μη έγκυρο session.";
  if (message.includes("Reservation not found")) return "Η κράτηση δεν βρέθηκε.";
  if (message.includes("Failed to create reservation")) return "Η κράτηση απέτυχε.";
  if (message.includes("Failed to cancel reservation")) return "Η ακύρωση απέτυχε.";
  if (message.includes("Failed to delete reservation")) return "Η διαγραφή απέτυχε.";
  return "Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά.";
};

/* ----------------------- User side ----------------------- */

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
      const { data } = await axiosInstance.get(`/filter?${params}`);
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
      queryClient.invalidateQueries({ queryKey: ["userReservations"] });
      queryClient.invalidateQueries({ queryKey: ["filteredReservations"] });
    },
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, reason }) => {
      const { data } = await axiosInstance.post(`/${reservationId}/cancel`, {
        reason,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση ακυρώθηκε.");
      queryClient.invalidateQueries({ queryKey: ["userReservations"] });
      queryClient.invalidateQueries({ queryKey: ["filteredReservations"] });
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
      queryClient.invalidateQueries({ queryKey: ["userReservations"] });
      queryClient.invalidateQueries({ queryKey: ["filteredReservations"] });
    },
    onError: (err) => toast.error(translateReservationError(err)),
  });
};

/* ----------------------- Owner side ----------------------- */

/** Λίστα κρατήσεων ιδιοκτήτη με φίλτρα + pagination */
export const useOwnerFilteredReservations = (
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
    queryKey: ["ownerReservations", date, status, page, pageSize],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/owner?${params}`);
      return data;
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || "Αποτυχία φόρτωσης κρατήσεων ιδιοκτήτη.";
      toast.error(msg);
    },
  });
};

/** Επιβεβαίωση κράτησης από ιδιοκτήτη */
export const useOwnerConfirmReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      const { data } = await axiosInstance.patch(`/${reservationId}/status`, {
        status: "confirmed",
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση επιβεβαιώθηκε.");
      queryClient.invalidateQueries({ queryKey: ["ownerReservations"] });
      queryClient.invalidateQueries({ queryKey: ["ownerRestaurant"] });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || "Αποτυχία επιβεβαίωσης κράτησης.";
      toast.error(msg);
    },
  });
};

/** Ακύρωση κράτησης από ιδιοκτήτη (με λόγο) */
export const useOwnerCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, reason }) => {
      const { data } = await axiosInstance.patch(`/${reservationId}/status`, {
        status: "cancelled",
        cancellation_reason: reason || "Ακύρωση από τον ιδιοκτήτη.",
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση ακυρώθηκε.");
      queryClient.invalidateQueries({ queryKey: ["ownerReservations"] });
      queryClient.invalidateQueries({ queryKey: ["ownerRestaurant"] });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || "Αποτυχία ακύρωσης κράτησης.";
      toast.error(msg);
    },
  });
};

/** Ολοκλήρωση κράτησης από ιδιοκτήτη (award points, lock coupon κλπ—backend handles) */
export const useOwnerCompleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      const { data } = await axiosInstance.patch(`/${reservationId}/status`, {
        status: "completed",
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση ολοκληρώθηκε.");
      queryClient.invalidateQueries({ queryKey: ["ownerReservations"] });
      queryClient.invalidateQueries({ queryKey: ["ownerRestaurant"] });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || "Αποτυχία ολοκλήρωσης κράτησης.";
      toast.error(msg);
    },
  });
};
