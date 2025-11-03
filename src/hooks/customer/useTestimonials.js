import { useQuery } from "@tanstack/react-query";
import { testimonialApi } from "../../config/api";
import { queryKeys } from "../../config/queryKeys";

const fetchTestimonials = async (page = 1, pageSize = 10) => {
  // Backend uses 'limit' parameter, not 'pageSize'
  const { data } = await testimonialApi.get(`/all?page=${page}&limit=${pageSize}`);
  return data.testimonials || data.allTestimonials || [];
};

export const useTestimonials = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: queryKeys.testimonials(page, pageSize),
    queryFn: () => fetchTestimonials(page, pageSize),
    keepPreviousData: true,
    staleTime: 15 * 60 * 1000, // 15 minutes - public data, matches backend cache
    retry: false,
  });
