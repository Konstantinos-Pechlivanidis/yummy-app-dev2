import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchTestimonials = async (page = 1, limit = 10) => {
  const { data } = await axios.get(
    `http://localhost:5000/api/v1/testimonials/all?page=${page}&limit=${limit}`,
    { withCredentials: true }
  );
  return data.allTestimonials;
};

export const useTestimonials = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["testimonials", page, limit],
    queryFn: () => fetchTestimonials(page, limit),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};