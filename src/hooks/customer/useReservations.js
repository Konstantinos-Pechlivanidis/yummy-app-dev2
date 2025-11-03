import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { reservationApi } from "../../config/api";
import { queryKeys } from "../../config/queryKeys";
import { translateApiError } from "../../utils/apiErrorHandler";
import { useConfirmedUser } from "./useConfirmedUser";

/* ----------------------- User side ----------------------- */

export const useUserReservations = () => {
  return useQuery({
    queryKey: queryKeys.userReservations(),
    queryFn: async () => {
      const { data } = await reservationApi.get("/");
      return data;
    },
    onError: (err) => toast.error(translateApiError(err, "reservation")),
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
    queryKey: queryKeys.filteredReservations(date, status, page, pageSize),
    queryFn: async () => {
      const { data } = await reservationApi.get(`/filter?${params}`);
      return data;
    },
    onError: (err) => toast.error(translateApiError(err, "reservation")),
  });
};

export const useReservationDetails = (reservationId) => {
  return useQuery({
    queryKey: queryKeys.reservation(reservationId),
    queryFn: async () => {
      const { data } = await reservationApi.get(`/${reservationId}`);
      return data;
    },
    enabled: !!reservationId,
    onError: (err) => toast.error(translateApiError(err, "reservation")),
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const isConfirmed = useConfirmedUser();

  return useMutation({
    mutationFn: async (reservationData) => {
      if (!isConfirmed) {
        throw new Error("confirmed_required");
      }
      const { data } = await reservationApi.post("/", reservationData);
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση δημιουργήθηκε επιτυχώς!");
      queryClient.invalidateQueries({ queryKey: queryKeys.userReservations() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.filteredReservations(),
      });
    },
    onError: (err) => {
      if (err.message === "confirmed_required") {
        toast.error(
          "Πρέπει να επιβεβαιώσετε το email σας πριν κάνετε κράτηση."
        );
      } else {
        toast.error(translateApiError(err, "reservation"));
      }
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, reason }) => {
      const { data } = await reservationApi.post(`/${reservationId}/cancel`, {
        reason,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση ακυρώθηκε.");
      queryClient.invalidateQueries({ queryKey: queryKeys.userReservations() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.filteredReservations(),
      });
    },
    onError: (err) => toast.error(translateApiError(err, "reservation")),
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      const { data } = await reservationApi.delete(`/${reservationId}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση διαγράφηκε.");
      queryClient.invalidateQueries({ queryKey: queryKeys.userReservations() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.filteredReservations(),
      });
    },
    onError: (err) => toast.error(translateApiError(err, "reservation")),
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
    queryKey: queryKeys.ownerReservations(date, status, page, pageSize),
    queryFn: async () => {
      const { data } = await reservationApi.get(`/owner?${params}`);
      return data;
    },
    onError: (err) => {
      toast.error(translateApiError(err, "owner"));
    },
  });
};

/**
 * Unified hook for owner to update reservation status
 * Supports: pending, confirmed, cancelled, seated, completed
 */
export const useOwnerUpdateReservationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservation_id, status, cancellation_reason = null }) => {
      const { data } = await reservationApi.patch("/owner/status", {
        reservation_id,
        status,
        cancellation_reason,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      const statusMessages = {
        confirmed: "Η κράτηση επιβεβαιώθηκε.",
        cancelled: "Η κράτηση ακυρώθηκε.",
        completed: "Η κράτηση ολοκληρώθηκε.",
        seated: "Οι πελάτες κάθισαν.",
      };
      toast.success(statusMessages[variables.status] || "Η κράτηση ενημερώθηκε.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerReservations(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerOverview(),
      });
    },
    onError: (err) => {
      toast.error(translateApiError(err, "reservation"));
    },
  });
};

/** Επιβεβαίωση κράτησης από ιδιοκτήτη (Convenience wrapper) */
export const useOwnerConfirmReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      const { data } = await reservationApi.patch("/owner/status", {
        reservation_id: reservationId,
        status: "confirmed",
        cancellation_reason: null,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση επιβεβαιώθηκε.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerReservations(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerOverview(),
      });
    },
    onError: (err) => {
      toast.error(translateApiError(err, "reservation"));
    },
  });
};

/** Ακύρωση κράτησης από ιδιοκτήτη (Convenience wrapper) */
export const useOwnerCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, reason }) => {
      const { data } = await reservationApi.patch("/owner/status", {
        reservation_id: reservationId,
        status: "cancelled",
        cancellation_reason: reason || "Ακύρωση από τον ιδιοκτήτη.",
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση ακυρώθηκε.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerReservations(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerOverview(),
      });
    },
    onError: (err) => {
      toast.error(translateApiError(err, "reservation"));
    },
  });
};

/** Ολοκλήρωση κράτησης από ιδιοκτήτη (Convenience wrapper) */
export const useOwnerCompleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      const { data } = await reservationApi.patch("/owner/status", {
        reservation_id: reservationId,
        status: "completed",
        cancellation_reason: null,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση ολοκληρώθηκε.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerReservations(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerOverview(),
      });
    },
    onError: (err) => {
      toast.error(translateApiError(err, "reservation"));
    },
  });
};
