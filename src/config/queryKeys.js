/**
 * Centralized Query Keys Configuration
 * 
 * This file provides a single source of truth for all React Query keys.
 * Using centralized keys ensures consistency and prevents typos.
 */

export const queryKeys = {
  // Authentication
  authStatus: () => ["authStatus"],
  userProfile: () => ["userProfile"],
  ownerProfile: () => ["ownerProfile"],

  // Restaurants
  restaurant: (id) => ["restaurant", id],
  ownerRestaurant: () => ["ownerRestaurant"],
  ownerOverview: () => ["ownerOverview"],
  trendingRestaurants: (page = 1, pageSize = 10) => [
    "trendingRestaurants",
    page,
    pageSize,
  ],
  discountedRestaurants: (page = 1, pageSize = 10) => [
    "discountedRestaurants",
    page,
    pageSize,
  ],
  filteredRestaurants: (filters = {}, page = 1, pageSize = 10) => [
    "filteredRestaurants",
    filters,
    page,
    pageSize,
  ],

  // Reservations
  userReservations: () => ["userReservations"],
  filteredReservations: (date, status, page = 1, pageSize = 10) => [
    "filteredReservations",
    date,
    status,
    page,
    pageSize,
  ],
  reservation: (id) => ["reservation", id],
  ownerReservations: (date, status, page = 1, pageSize = 10) => [
    "ownerReservations",
    date,
    status,
    page,
    pageSize,
  ],

  // Coupons
  userCoupons: (page = 1, pageSize = 10) => ["userCoupons", page, pageSize],
  availableCoupons: (restaurantId, page = 1, pageSize = 10) => [
    "availableCoupons",
    restaurantId,
    page,
    pageSize,
  ],
  restaurantsWithPurchasedCoupons: () => [
    "restaurantsWithPurchasedCoupons",
  ],

  // Testimonials
  testimonials: (page = 1, pageSize = 10) => ["testimonials", page, pageSize],

  // User
  userPoints: () => ["userPoints"],
  favorites: (page = 1, pageSize = 10) => ["favorites", page, pageSize],
};

