
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

// ------------------ AUTH ------------------

export const useOwnerLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await axiosInstance.post("/owner/login", { email, password });
      return data;
    },
    onSuccess: () => {
      toast.success("Συνδεθήκατε ως Ιδιοκτήτης.");
      queryClient.invalidateQueries(["ownerAuthStatus"]);
    },
    onError: () => toast.error("Αποτυχία σύνδεσης ιδιοκτήτη."),
  });
};

export const useOwnerLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await axiosInstance.post("/owner/logout"),
    onSuccess: () => {
      toast.success("Αποσυνδεθήκατε ως Ιδιοκτήτης.");
      queryClient.clear();
      window.location.href = "/";
    },
    onError: () => toast.error("Αποτυχία αποσύνδεσης ιδιοκτήτη."),
  });
};

export const useOwnerAuthStatus = () =>
  useQuery({
    queryKey: ["ownerAuthStatus"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/owner/auth/status");
      return data;
    },
    retry: false,
  });

// ------------------ OWNER PROFILE ------------------

export const useOwnerProfile = () =>
  useQuery({
    queryKey: ["ownerProfile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/owner/profile");
      return data;
    },
  });

export const useUpdateOwnerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await axiosInstance.patch("/owner/update", updates);
      return data;
    },
    onSuccess: () => {
      toast.success("Το προφίλ ενημερώθηκε επιτυχώς.");
      queryClient.invalidateQueries(["ownerProfile"]);
    },
    onError: () => toast.error("Αποτυχία ενημέρωσης προφίλ."),
  });
};

// ------------------ RESTAURANTS ------------------

export const useOwnerRestaurants = () =>
  useQuery({
    queryKey: ["ownerRestaurants"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/owner/my-restaurants");
      return data.restaurants;
    },
    onError: () => toast.error("Αποτυχία φόρτωσης καταστημάτων ιδιοκτήτη."),
  });

// ------------------ MENU ITEMS ------------------

export const useOwnerMenuItems = (restaurantId) =>
  useQuery({
    queryKey: ["ownerMenuItems", restaurantId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/menu-items/owner/all?restaurant_id=${restaurantId}`);
      return data.menu_items;
    },
    enabled: !!restaurantId,
    onError: () => toast.error("Αποτυχία φόρτωσης μενού."),
  });

export const useOwnerCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ restaurant_id, ...payload }) => {
      const { data } = await axiosInstance.post(`/menu-items`, { restaurant_id, ...payload });
      return data;
    },
    onSuccess: () => {
      toast.success("Το πιάτο προστέθηκε!");
      queryClient.invalidateQueries(["ownerMenuItems"]);
    },
    onError: () => toast.error("Αποτυχία προσθήκης πιάτου."),
  });
};

export const useOwnerUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data } = await axiosInstance.patch(`/menu-items/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      toast.success("Το πιάτο ενημερώθηκε.");
      queryClient.invalidateQueries(["ownerMenuItems"]);
    },
    onError: () => toast.error("Αποτυχία ενημέρωσης πιάτου."),
  });
};

export const useOwnerDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/menu-items/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Το πιάτο διαγράφηκε.");
      queryClient.invalidateQueries(["ownerMenuItems"]);
    },
    onError: () => toast.error("Αποτυχία διαγραφής πιάτου."),
  });
};

// ------------------ SPECIAL MENUS ------------------

export const useOwnerSpecialMenus = (restaurantId) =>
  useQuery({
    queryKey: ["ownerSpecialMenus", restaurantId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/special-menus/owner/all?restaurant_id=${restaurantId}`);
      return data.special_menus;
    },
    enabled: !!restaurantId,
    onError: () => toast.error("Αποτυχία φόρτωσης ειδικών μενού."),
  });

export const useOwnerCreateSpecialMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (specialMenu) => {
      const { data } = await axiosInstance.post(`/special-menus`, specialMenu);
      return data;
    },
    onSuccess: () => {
      toast.success("Το ειδικό μενού προστέθηκε.");
      queryClient.invalidateQueries(["ownerSpecialMenus"]);
    },
    onError: () => toast.error("Αποτυχία δημιουργίας ειδικού μενού."),
  });
};

export const useOwnerDeleteSpecialMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/special-menus/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Το ειδικό μενού διαγράφηκε.");
      queryClient.invalidateQueries(["ownerSpecialMenus"]);
    },
    onError: () => toast.error("Αποτυχία διαγραφής ειδικού μενού."),
  });
};

// ------------------ COUPONS ------------------

export const useOwnerCoupons = (restaurantId) =>
  useQuery({
    queryKey: ["ownerCoupons", restaurantId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/coupons/owner/all?restaurant_id=${restaurantId}`);
      return data.coupons;
    },
    enabled: !!restaurantId,
    onError: () => toast.error("Αποτυχία φόρτωσης κουπονιών."),
  });

export const useOwnerCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (coupon) => {
      const { data } = await axiosInstance.post(`/coupons/creation`, coupon);
      return data;
    },
    onSuccess: () => {
      toast.success("Το κουπόνι δημιουργήθηκε.");
      queryClient.invalidateQueries(["ownerCoupons"]);
    },
    onError: () => toast.error("Αποτυχία δημιουργίας κουπονιού."),
  });
};

export const useOwnerDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/coupons/delete`, { data: { coupon_id: id } });
      return data;
    },
    onSuccess: () => {
      toast.success("Το κουπόνι διαγράφηκε.");
      queryClient.invalidateQueries(["ownerCoupons"]);
    },
    onError: () => toast.error("Αποτυχία διαγραφής κουπονιού."),
  });
};

// ------------------ RESERVATIONS ------------------

export const useOwnerReservations = (restaurantId) =>
  useQuery({
    queryKey: ["ownerReservations", restaurantId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/reservations/owner/all?restaurant_id=${restaurantId}`);
      return data.reservations;
    },
    enabled: !!restaurantId,
    onError: () => toast.error("Αποτυχία φόρτωσης κρατήσεων."),
  });

export const useOwnerUpdateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data } = await axiosInstance.patch(`/reservations/owner`, {
        reservation_id: id,
        ...updates,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση ενημερώθηκε.");
      queryClient.invalidateQueries(["ownerReservations"]);
    },
    onError: () => toast.error("Αποτυχία ενημέρωσης κράτησης."),
  });
};

export const useOwnerDeleteReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/reservations/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Η κράτηση διαγράφηκε.");
      queryClient.invalidateQueries(["ownerReservations"]);
    },
    onError: () => toast.error("Αποτυχία διαγραφής κράτησης."),
  });
};

export const useOwnerOverview = (restaurantId) =>
  useQuery({
    queryKey: ["ownerOverview", restaurantId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/owner/overview?restaurant_id=${restaurantId}`);
      return data.overview;
    },
    enabled: !!restaurantId,
    onError: () => toast.error("Αποτυχία φόρτωσης στατιστικών εστιατορίου."),
  });
