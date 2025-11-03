import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { restaurantApi } from "../../config/api";
import { queryKeys } from "../../config/queryKeys";
import { translateApiError } from "../../utils/apiErrorHandler";

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

// Helper function to shuffle array and pick random items
const getRandomItems = (array, count) => {
  if (array.length === 0) return [];
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const useTrendingRestaurants = (page = 1, pageSize = 6) => {
  return useQuery({
    queryKey: queryKeys.trendingRestaurants(page, pageSize),
    queryFn: async () => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('[Trending] QueryFn called - starting fetch');
      }
      let usedTrendingEndpoint = false;
      
      try {
        // Try trending endpoint first
        const { data } = await restaurantApi.get(
          `/trending?page=${page}&pageSize=${pageSize}`
        );
        
        const restaurants = data.restaurants || [];
        
        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('[Trending API] Response:', {
            hasData: !!data,
            restaurantsCount: restaurants.length,
            fullResponse: data
          });
        }
        
        // If trending endpoint returns data, use it
        if (restaurants.length > 0) {
          const mappedRestaurants = restaurants.map(translateRestaurantWithExtras);
          usedTrendingEndpoint = true;
          return {
            ...data,
            restaurants: mappedRestaurants,
            allTrendingRestaurants: mappedRestaurants,
            Pagination: data.Pagination,
          };
        }
        
        // If trending endpoint returned empty, continue to fallback
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('[Trending API] Empty response, using fallback');
        }
      } catch (error) {
        // Trending endpoint doesn't exist or failed - fallback to all restaurants
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('[Trending API] Endpoint failed, using fallback:', {
            status: error.response?.status,
            message: error.message
          });
        }
      }
      
      // Fallback: Get all restaurants and pick random 6 (only if trending didn't work)
      if (!usedTrendingEndpoint) {
        try {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('[Trending Fallback] Fetching all restaurants...');
          }
          
          const { data } = await restaurantApi.get(`/?page=1&pageSize=100`);
          const allRestaurants = data.restaurants || [];
          
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('[Trending Fallback] Received:', {
              hasData: !!data,
              restaurantsCount: allRestaurants.length,
              response: data
            });
          }
          
          if (allRestaurants.length === 0) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[Trending Fallback] No restaurants found in database');
            }
            return {
              restaurants: [],
              allTrendingRestaurants: [],
              Pagination: { currentPage: 1, total: 0 },
            };
          }
          
          // Pick random 6 restaurants
          const randomRestaurants = getRandomItems(allRestaurants, 6);
          const mappedRestaurants = randomRestaurants.map(translateRestaurantWithExtras);
          
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('[Trending Fallback] Selected random restaurants:', mappedRestaurants.length);
          }
          
          return {
            restaurants: mappedRestaurants,
            allTrendingRestaurants: mappedRestaurants,
            Pagination: {
              currentPage: 1,
              recordsOnCurrentPage: mappedRestaurants.length,
              total: mappedRestaurants.length,
            },
          };
        } catch (fallbackError) {
          // Only log in development for debugging
          if (process.env.NODE_ENV === 'development') {
            console.error("Error in trending restaurants fallback:", {
              error: fallbackError,
              status: fallbackError.response?.status,
              message: fallbackError.message,
              url: fallbackError.config?.url
            });
          }
          return {
            restaurants: [],
            allTrendingRestaurants: [],
            Pagination: { currentPage: 1, total: 0 },
          };
        }
      }
      
      // Should not reach here, but return empty if we do
      return {
        restaurants: [],
        allTrendingRestaurants: [],
        Pagination: { currentPage: 1, total: 0 },
      };
    },
    staleTime: 0, // No cache - ensure fresh data and fallback execution
    onError: (err) => {
      // Don't show error toast for fallback scenarios
      if (err.response?.status !== 404) {
        toast.error(translateApiError(err, "restaurant"));
      }
    },
  });
};

export const useDiscountedRestaurants = (page = 1, pageSize = 6) => {
  return useQuery({
    queryKey: queryKeys.discountedRestaurants(page, pageSize),
    queryFn: async () => {
      try {
        // Try discounted endpoint first
        const { data } = await restaurantApi.get(
          `/discounted?page=${page}&pageSize=${pageSize}`
        );
        
        // Backend returns special_menus array with nested restaurant objects
        const menus = data.allDiscountedRestaurants ?? data.restaurants ?? (Array.isArray(data) ? data : []);
        
        // If discounted endpoint returns data, use it
        if (menus.length > 0) {
          return {
            allDiscountedRestaurants: menus,
            restaurants: menus, // Keep for compatibility
            Pagination: data.Pagination,
          };
        }
      } catch (error) {
        // Discounted endpoint doesn't exist or failed - fallback to restaurants with special menus
        // Silent fallback - no logging needed in production
      }
      
      // Fallback: Get all restaurants, filter those with special_menus, pick random 6
      try {
        const { data } = await restaurantApi.get(`/?page=1&pageSize=100`);
        const allRestaurants = data.restaurants || [];
        
        // Filter restaurants that have special_menus
        const restaurantsWithMenus = allRestaurants
          .filter((r) => r.special_menus && Array.isArray(r.special_menus) && r.special_menus.length > 0)
          .map((r) => {
            // Create menu objects with nested restaurant
            return r.special_menus.map((menu) => ({
              ...menu,
              restaurant: {
                ...r,
                special_menus: null, // Remove nested to avoid duplication
              },
            }));
          })
          .flat();
        
        if (restaurantsWithMenus.length === 0) {
          return {
            allDiscountedRestaurants: [],
            restaurants: [],
            Pagination: { currentPage: 1, total: 0 },
          };
        }
        
        // Pick random 6 special menus with restaurants
        const randomMenus = getRandomItems(restaurantsWithMenus, 6);
        
        return {
          allDiscountedRestaurants: randomMenus,
          restaurants: randomMenus, // Keep for compatibility
          Pagination: {
            currentPage: 1,
            recordsOnCurrentPage: randomMenus.length,
            total: randomMenus.length,
          },
        };
      } catch (fallbackError) {
        // Only log in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error("Error in discounted restaurants fallback:", fallbackError);
        }
        return {
          allDiscountedRestaurants: [],
          restaurants: [],
          Pagination: { currentPage: 1, total: 0 },
        };
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - matches backend cache
    onError: (err) => {
      // Don't show error toast for fallback scenarios
      if (err.response?.status !== 404) {
        toast.error(translateApiError(err, "restaurant"));
      }
    },
  });
};

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
    queryKey: queryKeys.filteredRestaurants(filters, page, pageSize),
    queryFn: async () => {
      try {
        const { data } = await restaurantApi.get(`/?${queryParams}`);

        if (!data?.restaurants || data.restaurants.length === 0) {
          return {
            ...data,
            restaurants: [],
          };
        }

        return {
          ...data,
          restaurants: data.restaurants.map(translateRestaurantWithExtras),
        };
      } catch (error) {
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
        throw error;
      }
    },
    keepPreviousData: true,
    staleTime: 15 * 60 * 1000, // 15 minutes - matches backend cache
    onError: (err) => toast.error(translateApiError(err, "restaurant")),
  });
};

export const useRestaurantDetails = (id) => {
  return useQuery({
    queryKey: queryKeys.restaurant(id),
    queryFn: async () => {
      // χρησιμοποιούμε το REST alias GET /:id
      const { data } = await restaurantApi.get(`/${id}`);
      return {
        ...data,
        restaurant: translateRestaurant(data.restaurant),
        menu_items: data.menu_items ?? [],
        special_menus: data.special_menus ?? [],
        coupons: data.coupons ?? [],
      };
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes - matches backend cache
    onError: (err) => toast.error(translateApiError(err, "restaurant")),
  });
};
