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
  baseURL: `${API_BASE}/api/v1/coupons`,
  withCredentials: true,
});

const translateCouponError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Παρουσιάστηκε άγνωστο σφάλμα.";

  if (message.includes("No token")) return "Δεν είστε συνδεδεμένος.";
  if (message.includes("Invalid token")) return "Μη έγκυρο session. Συνδεθείτε ξανά.";
  if (message.includes("not confirmed")) return "Ο λογαριασμός σας δεν είναι επιβεβαιωμένος.";
  if (message.includes("No coupons found")) return "Δεν βρέθηκαν κουπόνια.";
  if (message.includes("Failed to fetch user coupons")) return "Αποτυχία φόρτωσης κουπονιών.";
  if (message.includes("Failed to load available coupons")) return "Δεν ήταν δυνατή η ανάκτηση διαθέσιμων κουπονιών.";
  if (message.includes("Αποτυχία αγοράς")) return "Αποτυχία αγοράς κουπονιού.";
  if (message.includes("coupon_id is required")) return "Δεν στάλθηκε το κουπόνι.";
  return "Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά.";
};

/** Εστιατόρια στα οποία ο χρήστης έχει αγορασμένα κουπόνια */
export const useRestaurantsWithPurchasedCoupons = () => {
  return useQuery({
    queryKey: ["restaurantsWithPurchasedCoupons"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/purchased/restaurants");
      return data.restaurantsWithPurchasedCoupons;
    },
    onError: (err) => toast.error(translateCouponError(err)),
  });
};

/** Τα κουπόνια του χρήστη με pagination */
export const useUserCoupons = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["userCoupons", page, pageSize],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/ownedByUser?page=${page}&pageSize=${pageSize}`
      );
      return data.userCoupons;
    },
    onError: (err) => toast.error(translateCouponError(err)),
  });
};

/** Διαθέσιμα κουπόνια για συγκεκριμένο εστιατόριο (pagination at outer query) */
export const useAvailableCoupons = (restaurantId, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["availableCoupons", restaurantId, page, pageSize],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/available?restaurant_id=${restaurantId}&page=${page}&pageSize=${pageSize}`
      );
      return data.availableCoupons;
    },
    enabled: !!restaurantId,
    onError: (err) => toast.error(translateCouponError(err)),
  });
};

/** Αγορά κουπονιού (REST alias) */
export const usePurchaseCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (couponId) => {
      // New REST-style alias. If you prefer the old route, call POST /purchase with { coupon_id }.
      const { data } = await axiosInstance.post(`/${couponId}/purchase`);
      return data;
    },
    onSuccess: () => {
      toast.success("Αγοράστηκε!");
      queryClient.invalidateQueries({ queryKey: ["restaurantsWithPurchasedCoupons"] });
      queryClient.invalidateQueries({ queryKey: ["userCoupons"] });
      queryClient.invalidateQueries({ queryKey: ["availableCoupons"] });
    },
    onError: (err) => toast.error(translateCouponError(err)),
  });
};

export const useCreateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post("/creation", payload);
      return data.coupon;
    },
    onSuccess: () => {
      toast.success("Δημιουργήθηκε!");
      qc.invalidateQueries({ queryKey: ["ownerRestaurant"] });
    },
    onError: (err) => toast.error(translateCouponError(err)),
  });
};

export const useEditCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ couponId, ...patch }) => {
      const { data } = await axiosInstance.patch(`/${couponId}`, patch);
      return data.coupon;
    },
    onSuccess: () => {
      toast.success("Αποθηκεύτηκε!");
      qc.invalidateQueries({ queryKey: ["ownerRestaurant"] });
    },
    onError: (err) => toast.error(translateCouponError(err)),
  });
};

export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (couponId) => {
      const { data } = await axiosInstance.delete(`/${couponId}`);
      return data.coupon;
    },
    onSuccess: () => {
      toast.success("Διαγράφηκε!");
      qc.invalidateQueries({ queryKey: ["ownerRestaurant"] });
    },
    onError: (err) => toast.error(translateCouponError(err)),
  });
};
