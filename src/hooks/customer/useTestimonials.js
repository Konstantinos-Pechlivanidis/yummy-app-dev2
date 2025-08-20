import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: `${API_BASE}/api/v1/testimonials`,
  withCredentials: true,
});

const fetchTestimonials = async (page = 1, pageSize = 10) => {
  // keep existing backend shape: /all?page=&limit=  (adjust if your server expects pageSize)
  const { data } = await axiosInstance.get(`/all?page=${page}&limit=${pageSize}`);
  return data.allTestimonials || [];
};

export const useTestimonials = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["testimonials", page, pageSize],
    queryFn: () => fetchTestimonials(page, pageSize),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
