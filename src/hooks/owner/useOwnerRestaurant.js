import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { restaurantApi } from "../../config/api";
import { queryKeys } from "../../config/queryKeys";
import { translateApiError } from "../../utils/apiErrorHandler";

/** GET: To εστιατόριο του ιδιοκτήτη (με όλα τα σχετικά: menu items, specials, coupons, reservations) */
export const useOwnerRestaurant = () => {
  return useQuery({
    queryKey: queryKeys.ownerRestaurant(),
    queryFn: async () => {
      const { data } = await restaurantApi.get("/owner");
      return data.restaurant || data;
    },
    retry: false,
    onError: (err) => toast.error(translateApiError(err, "owner")),
  });
};

/** GET: Επισκόπηση ιδιοκτήτη (σύνολα + happy hours) */
export const useOwnerOverview = () => {
  return useQuery({
    queryKey: queryKeys.ownerOverview(),
    queryFn: async () => {
      const { data } = await restaurantApi.get("/owner/overview");
      // Backend returns: { restaurant: {...}, statistics: {...} }
      // Handle both object response and legacy array response (for compatibility)
      if (data.restaurant && data.statistics) {
        return {
          restaurant: data.restaurant,
          statistics: data.statistics || {},
        };
      }
      // Legacy support: if backend returns array
      if (Array.isArray(data.restaurants)) {
        return {
          restaurant: data.restaurants[0] || null,
          statistics: data.statistics || {},
        };
      }
      // Fallback: return data as-is
      return {
        restaurant: data.restaurant || null,
        statistics: data.statistics || {},
      };
    },
    retry: false,
    onError: (err) => toast.error(translateApiError(err, "owner")),
  });
};

/** PATCH: Ενημέρωση contact JSONB (μόνο) του εστιατορίου του ιδιοκτήτη */
export const useUpdateOwnerContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, contact }) => {
      const payload = { contact }; // controller δέχεται ΜΟΝΟ contact
      const { data } = await restaurantApi.patch(`/${id}`, payload);
      return data.restaurant || data;
    },
    onSuccess: () => {
      toast.success("Το προφίλ του εστιατορίου ενημερώθηκε.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerOverview(),
      });
    },
    onError: (err) => toast.error(translateApiError(err, "owner")),
  });
};
