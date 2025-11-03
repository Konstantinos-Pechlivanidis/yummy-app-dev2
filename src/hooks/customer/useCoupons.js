import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { couponApi } from "../../config/api";
import { queryKeys } from "../../config/queryKeys";
import { translateApiError } from "../../utils/apiErrorHandler";
import { useConfirmedUser } from "./useConfirmedUser";

/** Εστιατόρια στα οποία ο χρήστης έχει αγορασμένα κουπόνια */
export const useRestaurantsWithPurchasedCoupons = () => {
  return useQuery({
    queryKey: queryKeys.restaurantsWithPurchasedCoupons(),
    queryFn: async () => {
      const { data } = await couponApi.get("/purchased/restaurants");
      return data.restaurants || data.restaurantsWithPurchasedCoupons || [];
    },
    onError: (err) => toast.error(translateApiError(err, "coupon")),
  });
};

/** Τα κουπόνια του χρήστη με pagination */
export const useUserCoupons = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: queryKeys.userCoupons(page, pageSize),
    queryFn: async () => {
      const { data } = await couponApi.get(
        `/ownedByUser?page=${page}&pageSize=${pageSize}`
      );
      return data.userCoupons || [];
    },
    onError: (err) => toast.error(translateApiError(err, "coupon")),
  });
};

/** Διαθέσιμα κουπόνια για συγκεκριμένο εστιατόριο (pagination at outer query) */
export const useAvailableCoupons = (restaurantId, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: queryKeys.availableCoupons(restaurantId, page, pageSize),
    queryFn: async () => {
      const { data } = await couponApi.get(
        `/available?restaurant_id=${restaurantId}&page=${page}&pageSize=${pageSize}`
      );
      return data.coupons || data.availableCoupons || [];
    },
    enabled: !!restaurantId,
    onError: (err) => toast.error(translateApiError(err, "coupon")),
  });
};

/** Αγορά κουπονιού */
export const usePurchaseCoupon = () => {
  const queryClient = useQueryClient();
  const isConfirmed = useConfirmedUser();

  return useMutation({
    mutationFn: async (couponId) => {
      if (!isConfirmed) {
        throw new Error("confirmed_required");
      }
      const { data } = await couponApi.post("/purchase", {
        coupon_id: couponId,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success("Το κουπόνι αγοράστηκε επιτυχώς!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.restaurantsWithPurchasedCoupons(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.userCoupons() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.availableCoupons(),
      });
      // Update user points if returned
      if (data?.remaining_points !== undefined) {
        queryClient.invalidateQueries({ queryKey: queryKeys.userPoints() });
      }
    },
    onError: (err) => {
      if (err.message === "confirmed_required") {
        toast.error(
          "Πρέπει να επιβεβαιώσετε το email σας πριν αγοράσετε κουπόνια."
        );
      } else {
        toast.error(translateApiError(err, "coupon"));
      }
    },
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await couponApi.post("/creation", payload);
      return data.coupon || data;
    },
    onSuccess: () => {
      toast.success("Το κουπόνι δημιουργήθηκε!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerOverview(),
      });
    },
    onError: (err) => toast.error(translateApiError(err, "coupon")),
  });
};

export const useEditCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ couponId, ...patch }) => {
      const { data } = await couponApi.patch("/edit", {
        couponId,
        ...patch,
      });
      return data.coupon || data;
    },
    onSuccess: () => {
      toast.success("Το κουπόνι ενημερώθηκε!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerOverview(),
      });
    },
    onError: (err) => toast.error(translateApiError(err, "coupon")),
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (couponId) => {
      const { data } = await couponApi.delete("/delete", {
        data: { couponId },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Το κουπόνι διαγράφηκε!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerOverview(),
      });
    },
    onError: (err) => toast.error(translateApiError(err, "coupon")),
  });
};
