import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/coupons",
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
  if (message.includes("Failed to purchase coupon")) return "Αποτυχία αγοράς κουπονιού.";
  if (message.includes("coupon_id is required")) return "Δεν στάλθηκε το κουπόνι.";

  return "Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά.";
};

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

export const usePurchaseCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (couponId) => {
      const { data } = await axiosInstance.post("/purchase", {
        coupon_id: couponId,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Το κουπόνι αγοράστηκε με επιτυχία!");
      queryClient.invalidateQueries(["restaurantsWithPurchasedCoupons"]);
      queryClient.invalidateQueries(["userCoupons"]);
      queryClient.invalidateQueries(["availableCoupons"]);
    },
    onError: (err) => toast.error(translateCouponError(err)),
  });
};
