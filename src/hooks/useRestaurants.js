import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

// Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/restaurant",
  withCredentials: true,
});

// 🌐 Μετάφραση σφαλμάτων σε ελληνικά
const translateRestaurantError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Παρουσιάστηκε άγνωστο σφάλμα.";

  if (message.includes("Unauthorized")) return "Δεν έχετε δικαίωμα πρόσβασης.";
  if (message.includes("not found")) return "Δεν βρέθηκαν δεδομένα.";
  if (message.includes("Failed to load restaurants"))
    return "Αποτυχία φόρτωσης εστιατορίων.";
  if (message.includes("Failed to load restaurant details"))
    return "Αποτυχία φόρτωσης στοιχείων εστιατορίου.";

  return "Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά.";
};

// ✨ Formatter: απλό restaurant
const translateRestaurant = (r) => ({
  id: r.id,
  name: r.name || "Χωρίς όνομα",
  cuisine: r.cuisine || "Άγνωστη κουζίνα",
  location: r.location || "Άγνωστη τοποθεσία",
  rating: r.rating || "Χωρίς αξιολόγηση",
  opening_hours: r.opening_hours
    ? `${r.opening_hours.open} - ${r.opening_hours.close}`
    : "Ώρες λειτουργίας μη διαθέσιμες",
  phone: r.contact?.phone || "Τηλέφωνο μη διαθέσιμο",
  email: r.contact?.email || "Email μη διαθέσιμο",
  socialMedia: {
    facebook: r.contact?.socialMedia?.facebook || null,
    instagram: r.contact?.socialMedia?.instagram || null,
  },
  image: r.image || r.photos?.[0] || "/images/wide10.jpg",
  special_menus: null,
  coupons: null,
});

// ✨ Formatter: restaurant με nested promo
const translateRestaurantWithExtras = (r) => ({
  id: r.id,
  name: r.name || "Χωρίς όνομα",
  cuisine: r.cuisine || "Άγνωστη κουζίνα",
  location: r.location || "Άγνωστη τοποθεσία",
  rating: r.rating || "Χωρίς αξιολόγηση",
  opening_hours: r.opening_hours
    ? `${r.opening_hours.open} - ${r.opening_hours.close}`
    : "Ώρες λειτουργίας μη διαθέσιμες",
  phone: r.contact?.phone || "Τηλέφωνο μη διαθέσιμο",
  email: r.contact?.email || "Email μη διαθέσιμο",
  socialMedia: {
    facebook: r.contact?.socialMedia?.facebook || null,
    instagram: r.contact?.socialMedia?.instagram || null,
  },
  image: r.image || r.photos?.[0] || "/images/wide10.jpg",
  special_menus: r.special_menus ?? null,
  coupons: r.coupons ?? null,
});

// 🔝 Trending (με promo)
export const useTrendingRestaurants = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["trendingRestaurants", page, pageSize],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/trending?page=${page}&pageSize=${pageSize}`
      );
      return {
        ...data,
        allTrendingRestaurants:
          data.allTrendingRestaurants.map(translateRestaurantWithExtras),
      };
    },
    onError: (err) => toast.error(translateRestaurantError(err)),
  });
};

// 💸 Discounted (special menu-centric)
export const useDiscountedRestaurants = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["discountedRestaurants", page, pageSize],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/discounted?page=${page}&pageSize=${pageSize}`
      );
      return data; // Δεν γίνεται mapping γιατί είναι special_menus με nested restaurant
    },
    onError: (err) => toast.error(translateRestaurantError(err)),
  });
};

// 🔍 Filtered (με promo)
export const useFilteredRestaurants = (
  filters = {},
  page = 1,
  pageSize = 10
) => {
  const queryParams = new URLSearchParams({
    ...filters,
    page,
    pageSize,
  }).toString();

  return useQuery({
    queryKey: ["filteredRestaurants", filters, page, pageSize],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/?${queryParams}`);

        // ✅ Αν δεν υπάρχουν αποτελέσματα, μην πετάξεις σφάλμα
        if (!data?.restaurants || data.restaurants.length === 0) {
          return {
            ...data,
            restaurants: [], // empty list
          };
        }

        return {
          ...data,
          restaurants: data.restaurants.map(translateRestaurantWithExtras),
        };
      } catch (error) {
        // ✅ Αν είναι 404 αλλά αφορά empty list — επέστρεψε κενό
        if (error?.response?.status === 404) {
          return {
            restaurants: [],
            Pagination: {
              currentPage: page,
              recordsOnCurrentPage: 0,
              viewedRecords: 0,
              remainingRecords: 0,
              total: 0,
            },
          };
        }

        // ❌ Αν είναι άλλο σφάλμα, πέτα το για να το πιάσει το onError
        throw error;
      }
    },
    keepPreviousData: true,
    onError: (err) => toast.error(translateRestaurantError(err)),
  });
};


// 📋 Restaurant details (χωρίς promo inline)
export const useRestaurantDetails = (id) => {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/id/${id}`);
      return {
        ...data,
        restaurant: translateRestaurant(data.restaurant),
        menu_items: data.menu_items ?? [],
        special_menus: data.special_menus ?? [],
        coupons: data.coupons ?? [],
      };
    },
    enabled: !!id,
    onError: (err) => toast.error(translateRestaurantError(err)),
  });
};
