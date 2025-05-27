import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  restaurants,
  reservations,
  menu_items,
  special_menus,
  coupons,
  purchased_coupons,
  users,
} from "../data/dummyData";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 5000,
});

const paginate = (array, page, perPage) =>
  array.slice((page - 1) * perPage, page * perPage);

const dummyTestimonials = [
  { id: 1, message: "Καταπληκτική εμπειρία!" },
  { id: 2, message: "Γρήγορες κρατήσεις!" },
  { id: 3, message: "Εξαιρετικές προσφορές!" },
  { id: 4, message: "Άψογο προσωπικό!" },
  { id: 5, message: "Θα ξαναέρθουμε!" },
  { id: 6, message: "Υπέροχο φαγητό!" },
];

export const useTestimonials = (page = 1, perPage = 3) =>
  useQuery({
    queryKey: ["testimonials", page, perPage],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `/testimonials?page=${page}&limit=${perPage}`
        );
        return data;
      } catch (error) {
        console.warn("⚠️ Testimonials API fallback to dummy");
        return paginate(dummyTestimonials, page, perPage);
      }
    },
  });

export const useTrendingRestaurants = (page = 1, perPage = 5) =>
  useQuery({
    queryKey: ["trendingRestaurants", page, perPage],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `/restaurants/trending?page=${page}&limit=${perPage}`
        );
        return data;
      } catch (error) {
        console.warn("⚠️ Trending restaurants fallback to dummy");

        // Sort by rating
        const sorted = [...restaurants].sort((a, b) => b.rating - a.rating);

        // Paginate
        const paginated = sorted.slice((page - 1) * perPage, page * perPage);

        // Enrich with specialMenu and coupon
        const enriched = paginated.map((resto) => {
          const specialMenu = special_menus.find(
            (menu) => menu.restaurant_id === resto.id
          );
          const coupon = coupons.find((c) => c.restaurant_id === resto.id);

          return {
            ...resto,
            specialMenu,
            coupon,
          };
        });

        return enriched;
      }
    },
  });

export const useDiscountedRestaurants = (page = 1, perPage = 5) =>
  useQuery({
    queryKey: ["discountedRestaurants", page, perPage],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `/restaurants/discounted?page=${page}&limit=${perPage}`
        );
        return data;
      } catch (error) {
        console.warn("⚠️ Discounted restaurants fallback to special menus");

        const enrichedMenus = special_menus
          .map((menu) => {
            const restaurant = restaurants.find(
              (r) => r.id === menu.restaurant_id
            );
            return restaurant ? { ...menu, restaurant } : null;
          })
          .filter(Boolean);

        const start = (page - 1) * perPage;
        const paginated = enrichedMenus.slice(start, start + perPage);

        return {
          data: paginated,
          total: enrichedMenus.length,
        };
      }
    },
  });

export const useFilteredRestaurants = (filters = {}) =>
  useQuery({
    queryKey: ["filteredRestaurants", filters],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get("/restaurants", {
          params: filters,
        });
        return data;
      } catch (error) {
        console.warn("⚠️ Filtered restaurants fallback to dummy");

        const filtered = restaurants.filter((r) => {
          const matchesCuisine =
            !filters.cuisine || r.cuisine === filters.cuisine;
          const matchesLocation =
            !filters.location || r.location.includes(filters.location);
          const matchesGuests =
            !filters.guests || r.totalTables >= filters.guests;
          return matchesCuisine && matchesLocation && matchesGuests;
        });

        return filtered.map((resto) => {
          const specialMenu = special_menus.find(
            (menu) => menu.restaurant_id === resto.id
          );
          const coupon = coupons.find((c) => c.restaurant_id === resto.id);

          return {
            ...resto,
            specialMenu,
            coupon,
          };
        });
      }
    },
    enabled: !!filters,
  });

export const useUserReservations = (user_id) =>
  useQuery({
    queryKey: ["reservations", user_id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `/reservations/user/${user_id}`
        );
        return data;
      } catch (error) {
        console.warn("⚠️ User reservations fallback to dummy");
        return reservations.filter((r) => r.user_id === user_id);
      }
    },
    enabled: !!user_id,
  });

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, reason }) => {
      await new Promise((res) => setTimeout(res, 1000));

      const reservation = reservations.find((r) => r.id === reservationId);
      if (reservation) {
        reservation.status = "cancelled";
        reservation.cancellationReason = reason;
        reservation.updatedAt = new Date().toISOString();
      } else {
        throw new Error("Reservation not found");
      }

      return reservationId;
    },

    onSuccess: (reservationId) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },

    onError: (error) => {
      console.error("❌ Cancellation failed:", error.message);
    },
  });
};

export const useReservationDetails = (id) =>
  useQuery({
    queryKey: ["reservation", id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/reservations/${id}`);
        return data;
      } catch (error) {
        console.warn("⚠️ Reservation details fallback to dummy");
        return reservations.find((r) => r.id === id);
      }
    },
    enabled: !!id,
  });

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newReservation) => {
      try {
        const { data } = await axiosInstance.post(
          "/reservations",
          newReservation
        );
        return data;
      } catch (error) {
        console.warn("⚠️ Backend unreachable. Using dummy fallback.");

        // Fallback dummy logic:
        const newDummy = {
          ...newReservation,
          id: `reservation${reservations.length + 1}`,
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        reservations.push(newDummy);
        return newDummy;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (error) => {
      console.error("❌ Error creating reservation:", error);
    },
  });
};

export const useRestaurantDetails = (id) =>
  useQuery({
    queryKey: ["restaurantDetails", id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/restaurants/${id}`);
        return data;
      } catch (error) {
        console.warn("⚠️ Backend unreachable. Using dummy fallback.");

        const restaurant = restaurants.find((r) => r.id === id);

        if (!restaurant) throw new Error("Restaurant not found");

        return {
          ...restaurant,
          menu_items: menu_items.filter((item) => item.restaurant_id === id),
          special_menus: special_menus.filter((menu) => menu.restaurant_id === id),
          coupons: coupons.filter((coupon) => coupon.restaurant_id === id),
        };
      }
    },
    enabled: !!id,
  });

export const useUserCoupons = (user_id) =>
  useQuery({
    queryKey: ["userCoupons", user_id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/coupons/user/${user_id}`);
        return data;
      } catch (error) {
        console.warn("⚠️ API fallback: useUserCoupons()");
        return purchased_coupons
          .filter((entry) => entry.user_id === user_id)
          .map((entry) =>
            coupons.find((coupon) => coupon.id === entry.coupon_id)
          );
      }
    },
    enabled: !!user_id,
  });

export const usePurchaseCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, coupon_id, points }) => {
      try {
        await axiosInstance.post("/coupons/purchase", {
          user_id,
          coupon_id,
          points,
        });
        return { user_id, coupon_id };
      } catch (error) {
        console.warn("⚠️ Backend unreachable. Using dummy fallback.");

        const alreadyPurchased = purchased_coupons.some(
          (p) => p.user_id === user_id && p.coupon_id === coupon_id
        );
        if (alreadyPurchased) throw new Error("Already purchased");

        purchased_coupons.push({
          user_id,
          coupon_id,
          purchasedAt: new Date().toISOString(),
        });

        const user = users.find((u) => u.id === user_id);
        if (user) {
          user.loyalty_points = Math.max(0, user.loyalty_points - points);
        }

        return { user_id, coupon_id };
      }
    },

    onSuccess: (_data, variables) => {
      toast.success("Κουπόνι αγοράστηκε!");
      queryClient.invalidateQueries(["userCoupons", variables.user_id]);
      queryClient.invalidateQueries([
        "availableCoupons",
        variables.coupon_id,
        variables.user_id,
      ]);
      queryClient.invalidateQueries(["loyalty_points", variables.user_id]);
    },

    onError: (error) => {
      console.error("❌ Αποτυχία αγοράς κουπονιού:", error);
      toast.error("Η αγορά απέτυχε!");
    },
  });
};

export const useUserById = (user_id) =>
  useQuery({
    queryKey: ["user", user_id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${user_id}`);
        return data;
      } catch (error) {
        console.warn("🧪 Fallback to dummy user");
        return users.find((u) => u.id === user_id);
      }
    },
    enabled: !!user_id,
  });

export const useUserloyalty_points = (user_id) =>
  useQuery({
    queryKey: ["loyalty_points", user_id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${user_id}/points`);
        return data.points;
      } catch (error) {
        const user = users.find((u) => u.id === user_id);
        return user?.loyalty_points || 0;
      }
    },
    enabled: !!user_id,
  });
export const useAvailableCouponsForRestaurant = (restaurant_id, user_id) =>
  useQuery({
    queryKey: ["availableCoupons", restaurant_id, user_id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `/coupons/available?restaurant_id=${restaurant_id}&user_id=${user_id}`
        );
        return data;
      } catch (error) {
        const all = coupons.filter((c) => c.restaurant_id === restaurant_id);
        const purchased = purchased_coupons
          .filter((p) => p.user_id === user_id)
          .map((p) => p.coupon_id);

        return all.filter((c) => !purchased.includes(c.id));
      }
    },
    enabled: !!restaurant_id && !!user_id,
  });

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId) => {
      try {
        await axiosInstance.delete(`/reservations/${reservationId}`);
        return reservationId;
      } catch (error) {
        const index = reservations.findIndex((r) => r.id === reservationId);
        if (index !== -1) reservations.splice(index, 1);
        return reservationId;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (err) => {
      console.error("❌ Error deleting reservation:", err);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, updates }) => {
      try {
        const { data } = await axiosInstance.patch(`/users/${user_id}`, updates);
        return data;
      } catch (error) {
        console.warn("⚠️ Backend unreachable. Using dummy fallback.");
        const user = users.find((u) => u.id === user_id);
        if (!user) throw new Error("User not found");
        Object.assign(user, updates);
        user.updatedAt = new Date().toISOString();
        return user;
      }
    },
    onSuccess: (data) => {
      toast.success("Το προφίλ ενημερώθηκε");
      queryClient.invalidateQueries(["user", data.id]);
    },
    onError: () => {
      toast.error("Σφάλμα κατά την ενημέρωση προφίλ");
    },
  });
};

export const useFavoriteRestaurants = (user_id, page = 1, limit = 6) =>
  useQuery({
    queryKey: ["favoriteRestaurants", user_id, page],
    enabled: !!user_id,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${user_id}/favorites`, {
          params: { page, limit },
        });

        return data; // expected shape: { data: [...], total }
      } catch (error) {
        console.warn("⚠️ Backend unreachable. Using dummy fallback.");

        const user = users.find((u) => u.id === user_id);
        if (!user) throw new Error("User not found");

        const fullFavorites = restaurants
          .filter((r) => user.favoriteRestaurants.includes(r.id))
          .map((r) => {
            const specialMenu = special_menus.find(
              (m) => m.restaurant_id === r.id
            );
            const coupon = coupons.find((c) => c.restaurant_id === r.id);
            return {
              ...r,
              specialMenu: specialMenu || null,
              coupon: coupon || null,
            };
          });

        const total = fullFavorites.length;
        const start = (page - 1) * limit;
        const paginated = fullFavorites.slice(start, start + limit);

        return {
          data: paginated,
          total,
        };
      }
    },
  });

export const useToggleWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, restaurant_id }) => {
      try {
        const { data } = await axiosInstance.post(
          `/users/${user_id}/favorites/toggle`,
          { restaurant_id }
        );
        return data; // expected: updated favorite list or success flag
      } catch (error) {
        console.warn("⚠️ Backend unreachable. Using dummy fallback.");
        const user = users.find((u) => u.id === user_id);
        if (!user) throw new Error("User not found");

        const index = user.favoriteRestaurants.indexOf(restaurant_id);
        if (index > -1) {
          user.favoriteRestaurants.splice(index, 1); // remove
        } else {
          user.favoriteRestaurants.push(restaurant_id); // add
        }
        return user.favoriteRestaurants;
      }
    },
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries(["favoriteRestaurants", user_id]);
    },
    onError: () => {
      toast.error("⚠️ Δεν ήταν δυνατή η αλλαγή στη Watchlist");
    },
  });
};

export const useRestaurantsWithPurchasedCoupons = (user_id) =>
  useQuery({
    queryKey: ["restaurantsWithPurchasedCoupons", user_id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `/restaurants/coupons/user/${user_id}`
        );
        return data;
      } catch (error) {
        console.warn(
          "⚠️ Backend unreachable. Using dummy fallback for coupon restaurants"
        );
        const userPurchases = purchased_coupons.filter(
          (p) => p.user_id === user_id
        );
        const purchasedcoupon_ids = userPurchases.map((p) => p.coupon_id);

        const result = restaurants
          .map((resto) => {
            const matchingCoupon = resto.coupons
              ?.map((coupon_id) =>
                coupons.find(
                  (c) => c.id === coupon_id && purchasedcoupon_ids.includes(c.id)
                )
              )
              .find(Boolean);

            return matchingCoupon ? { ...resto, coupon: matchingCoupon } : null;
          })
          .filter(Boolean);

        return result;
      }
    },
    enabled: !!user_id,
  });

export const useFilteredReservations = (
  user_id,
  date,
  status = "all",
  page = 1,
  limit = 6
) => {
  return useQuery({
    queryKey: ["reservations", user_id, date, status, page],
    enabled: !!user_id,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `/reservations/user/${user_id}`,
          {
            params: {
              ...(status !== "all" && { status }),
              ...(date && { date }),
              page,
              limit,
            },
          }
        );

        return data; // { data: [...], total }
      } catch (error) {
        console.warn("⚠️ Backend failed. Using dummy data fallback.");

        // 1. Φιλτράρισμα μόνο για τον συγκεκριμένο χρήστη
        let filtered = reservations.filter((res) => res.user_id === user_id);

        // 2. Φιλτράρισμα κατά κατάσταση (status)
        if (status && status !== "all") {
          filtered = filtered.filter((res) => res.status === status);
        }

        // 3. Φιλτράρισμα κατά ημερομηνία με απλή string σύγκριση
        if (date) {
          filtered = filtered.filter((res) => res.date === date);
        }

        // 4. Pagination
        const total = filtered.length;

        const enriched = filtered
          .slice((page - 1) * limit, (page - 1) * limit + limit)
          .map((res) => {
            const specialMenu = res.special_menu_id
              ? special_menus.find((menu) => menu.id === res.special_menu_id)
              : null;

            const coupon = res.coupon_id
              ? coupons.find((c) => c.id === res.coupon_id)
              : null;

            return {
              ...res,
              specialMenu,
              coupon,
            };
          });

        return {
          data: enriched,
          total,
        };
      }
    },
  });
};

export const useRestaurants = () =>
  useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get("/restaurants");
        return data; // expected: full list of restaurant objects
      } catch (error) {
        console.warn("⚠️ Backend unavailable. Using dummy restaurants.");
        return restaurants; // fallback from dummyData.js
      }
    },
  });
