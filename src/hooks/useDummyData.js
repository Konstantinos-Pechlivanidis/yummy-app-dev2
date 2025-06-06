import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  restaurants,
  reservations,
  menuItems,
  specialMenus,
  coupons,
  purchasedCoupons,
  users,
} from "../data/dummyData";
import { toast } from "react-hot-toast";

// ✅ Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 5000,
});

// ✅ Helper για pagination
const paginate = (array, page, perPage) =>
  array.slice((page - 1) * perPage, page * perPage);

// ✅ Dummy Testimonials
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
          const specialMenu = specialMenus.find(
            (menu) => menu.restaurantId === resto.id
          );
          const coupon = coupons.find((c) => c.restaurantId === resto.id);

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
        return data; // { data: [...], total: number }
      } catch (error) {
        console.warn("⚠️ Discounted restaurants fallback to special menus");

        // Map special menus with their restaurant
        const enrichedMenus = specialMenus
          .map((menu) => {
            const restaurant = restaurants.find(
              (r) => r.id === menu.restaurantId
            );
            return restaurant ? { ...menu, restaurant } : null;
          })
          .filter(Boolean);

        // Pagination
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

        // Enrich with specialMenu and coupon
        return filtered.map((resto) => {
          const specialMenu = specialMenus.find(
            (menu) => menu.restaurantId === resto.id
          );
          const coupon = coupons.find((c) => c.restaurantId === resto.id);

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

export const useUserReservations = (userId) =>
  useQuery({
    queryKey: ["reservations", userId],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `/reservations/user/${userId}`
        );
        return data;
      } catch (error) {
        console.warn("⚠️ User reservations fallback to dummy");
        return reservations.filter((r) => r.userId === userId);
      }
    },
    enabled: !!userId,
  });

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, reason }) => {
      console.log("📡 Cancelling reservation...");

      // Fake delay (simulate backend)
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
      console.log("✅ Reservation cancelled:", reservationId);
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
          menuItems: menuItems.filter((item) => item.restaurantId === id),
          specialMenus: specialMenus.filter((menu) => menu.restaurantId === id),
          coupons: coupons.filter((coupon) => coupon.restaurantId === id),
        };
      }
    },
    enabled: !!id,
  });

export const useUserCoupons = (userId) =>
  useQuery({
    queryKey: ["userCoupons", userId],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/coupons/user/${userId}`);
        return data;
      } catch (error) {
        console.warn("⚠️ API fallback: useUserCoupons()");
        return purchasedCoupons
          .filter((entry) => entry.userId === userId)
          .map((entry) =>
            coupons.find((coupon) => coupon.id === entry.couponId)
          );
      }
    },
    enabled: !!userId,
  });

export const usePurchaseCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, couponId, points }) => {
      try {
        // 🔁 Real API Call
        await axiosInstance.post("/coupons/purchase", {
          userId,
          couponId,
          points,
        });
        return { userId, couponId };
      } catch (error) {
        console.warn("⚠️ Backend unreachable. Using dummy fallback.");

        const alreadyPurchased = purchasedCoupons.some(
          (p) => p.userId === userId && p.couponId === couponId
        );
        if (alreadyPurchased) throw new Error("Already purchased");

        // ➕ Add to dummy
        purchasedCoupons.push({
          userId,
          couponId,
          purchasedAt: new Date().toISOString(),
        });

        // ➖ Subtract points
        const user = users.find((u) => u.id === userId);
        if (user) {
          user.loyaltyPoints = Math.max(0, user.loyaltyPoints - points);
        }

        return { userId, couponId };
      }
    },

    onSuccess: (_data, variables) => {
      toast.success("Κουπόνι αγοράστηκε!");
      queryClient.invalidateQueries(["userCoupons", variables.userId]);
      queryClient.invalidateQueries([
        "availableCoupons",
        variables.couponId,
        variables.userId,
      ]);
      queryClient.invalidateQueries(["loyaltyPoints", variables.userId]);
    },

    onError: (error) => {
      console.error("❌ Αποτυχία αγοράς κουπονιού:", error);
      toast.error("Η αγορά απέτυχε!");
    },
  });
};

export const useUserById = (userId) =>
  useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${userId}`);
        return data;
      } catch (error) {
        console.warn("🧪 Fallback to dummy user");
        return users.find((u) => u.id === userId);
      }
    },
    enabled: !!userId,
  });

export const useUserLoyaltyPoints = (userId) =>
  useQuery({
    queryKey: ["loyaltyPoints", userId],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${userId}/points`);
        return data.points;
      } catch (error) {
        const user = users.find((u) => u.id === userId);
        return user?.loyaltyPoints || 0;
      }
    },
    enabled: !!userId,
  });
export const useAvailableCouponsForRestaurant = (restaurantId, userId) =>
  useQuery({
    queryKey: ["availableCoupons", restaurantId, userId],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `/coupons/available?restaurantId=${restaurantId}&userId=${userId}`
        );
        return data;
      } catch (error) {
        const all = coupons.filter((c) => c.restaurantId === restaurantId);
        const purchased = purchasedCoupons
          .filter((p) => p.userId === userId)
          .map((p) => p.couponId);

        return all.filter((c) => !purchased.includes(c.id));
      }
    },
    enabled: !!restaurantId && !!userId,
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
    mutationFn: async ({ userId, updates }) => {
      try {
        const { data } = await axiosInstance.patch(`/users/${userId}`, updates);
        return data;
      } catch (error) {
        console.warn("⚠️ Backend unreachable. Using dummy fallback.");
        const user = users.find((u) => u.id === userId);
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

export const useFavoriteRestaurants = (userId, page = 1, limit = 6) =>
  useQuery({
    queryKey: ["favoriteRestaurants", userId, page],
    enabled: !!userId,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${userId}/favorites`, {
          params: { page, limit },
        });

        return data; // expected shape: { data: [...], total }
      } catch (error) {
        console.warn("⚠️ Backend unreachable. Using dummy fallback.");

        const user = users.find((u) => u.id === userId);
        if (!user) throw new Error("User not found");

        const fullFavorites = restaurants
          .filter((r) => user.favoriteRestaurants.includes(r.id))
          .map((r) => {
            const specialMenu = specialMenus.find(
              (m) => m.restaurantId === r.id
            );
            const coupon = coupons.find((c) => c.restaurantId === r.id);
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
    mutationFn: async ({ userId, restaurantId }) => {
      try {
        const { data } = await axiosInstance.post(
          `/users/${userId}/favorites/toggle`,
          { restaurantId }
        );
        return data; // expected: updated favorite list or success flag
      } catch (error) {
        console.warn("⚠️ Backend unreachable. Using dummy fallback.");
        const user = users.find((u) => u.id === userId);
        if (!user) throw new Error("User not found");

        const index = user.favoriteRestaurants.indexOf(restaurantId);
        if (index > -1) {
          user.favoriteRestaurants.splice(index, 1); // remove
        } else {
          user.favoriteRestaurants.push(restaurantId); // add
        }
        return user.favoriteRestaurants;
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(["favoriteRestaurants", userId]);
    },
    onError: () => {
      toast.error("⚠️ Δεν ήταν δυνατή η αλλαγή στη Watchlist");
    },
  });
};

export const useRestaurantsWithPurchasedCoupons = (userId) =>
  useQuery({
    queryKey: ["restaurantsWithPurchasedCoupons", userId],
    queryFn: async () => {
      try {
        // 🔁 Πραγματικό API call (υποθέτουμε endpoint όπως `/restaurants/coupons/user/:id`)
        const { data } = await axiosInstance.get(
          `/restaurants/coupons/user/${userId}`
        );
        return data;
      } catch (error) {
        console.warn(
          "⚠️ Backend unreachable. Using dummy fallback for coupon restaurants"
        );

        // Dummy fallback
        const userPurchases = purchasedCoupons.filter(
          (p) => p.userId === userId
        );
        const purchasedCouponIds = userPurchases.map((p) => p.couponId);

        const result = restaurants
          .map((resto) => {
            const matchingCoupon = resto.coupons
              ?.map((couponId) =>
                coupons.find(
                  (c) => c.id === couponId && purchasedCouponIds.includes(c.id)
                )
              )
              .find(Boolean);

            return matchingCoupon ? { ...resto, coupon: matchingCoupon } : null;
          })
          .filter(Boolean);

        return result;
      }
    },
    enabled: !!userId,
  });

export const useFilteredReservations = (
  userId,
  date,
  status = "all",
  page = 1,
  limit = 6
) => {
  return useQuery({
    queryKey: ["reservations", userId, date, status, page],
    enabled: !!userId,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `/reservations/user/${userId}`,
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
        let filtered = reservations.filter((res) => res.userId === userId);

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
            const specialMenu = res.specialMenuId
              ? specialMenus.find((menu) => menu.id === res.specialMenuId)
              : null;

            const coupon = res.couponId
              ? coupons.find((c) => c.id === res.couponId)
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
