// src/hooks/useYummyData.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { restaurants } from "../data/dummyData";

// ✅ Axios Instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 5000,
});

// ✅ Helper για pagination
const paginate = (array, page, perPage) =>
  array.slice((page - 1) * perPage, page * perPage);

// ✅ Testimonials (Dummy: fixed array)
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
        console.warn("Fallback to dummy testimonials");
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
        console.warn("Fallback to dummy trending restaurants");
        const sorted = [...restaurants].sort((a, b) => b.rating - a.rating);
        return paginate(sorted, page, perPage);
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
        console.warn("Fallback to dummy discounted restaurants");
        const filtered = restaurants.filter((r) => r.happyHours.length > 0);
        return paginate(filtered, page, perPage);
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
          console.warn("Fallback to dummy filtered restaurants");
  
          // Dummy filtering (προσοχή: υποστηρίζει μόνο basic filters για τώρα)
          return restaurants.filter((r) => {
            const matchesCuisine = !filters.cuisine || r.cuisine === filters.cuisine;
            const matchesLocation = !filters.location || r.location.includes(filters.location);
            const matchesGuests = !filters.guests || r.totalTables >= filters.guests;
            return matchesCuisine && matchesLocation && matchesGuests;
          });
        }
      },
      enabled: !!filters, // τρέχει μόνο όταν υπάρχουν filters
    });
  
