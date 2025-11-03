/**
 * Status Utility Functions
 * Centralized status color/label mappings and helpers
 */

import { RESERVATION_STATUS } from "../constants/statuses";

/**
 * Get color class for reservation status badge
 * @param {string} status - Reservation status
 * @returns {string} Tailwind CSS classes
 */
export const getReservationStatusColor = (status) => {
  const colorMap = {
    [RESERVATION_STATUS.PENDING]: "bg-yellow-500",
    [RESERVATION_STATUS.CONFIRMED]: "bg-green-500",
    [RESERVATION_STATUS.COMPLETED]: "bg-blue-500",
    [RESERVATION_STATUS.CANCELLED]: "bg-red-500",
    [RESERVATION_STATUS.SEATED]: "bg-purple-500",
  };
  return colorMap[status] || "bg-gray-500";
};

/**
 * Get Greek label for reservation status
 * @param {string} status - Reservation status
 * @returns {string} Greek label
 */
export const getReservationStatusLabel = (status) => {
  const labelMap = {
    [RESERVATION_STATUS.PENDING]: "Εκκρεμεί",
    [RESERVATION_STATUS.CONFIRMED]: "Επιβεβαιωμένη",
    [RESERVATION_STATUS.COMPLETED]: "Ολοκληρωμένη",
    [RESERVATION_STATUS.CANCELLED]: "Ακυρωμένη",
    [RESERVATION_STATUS.SEATED]: "Καθισμένη",
  };
  return labelMap[status] || "Άγνωστο";
};

/**
 * Get badge configuration for owner reservation management
 * @param {string} status - Reservation status
 * @returns {Object} Badge config with text and className
 */
export const getReservationBadgeConfig = (status) => {
  const configMap = {
    [RESERVATION_STATUS.CONFIRMED]: {
      text: "✅ Εγκεκριμένη",
      className: "bg-blue-500 text-white",
    },
    [RESERVATION_STATUS.PENDING]: {
      text: "⏳ Αναμονή",
      className: "bg-yellow-500 text-black",
    },
    [RESERVATION_STATUS.COMPLETED]: {
      text: "🏁 Ολοκληρωμένη",
      className: "bg-green-500 text-white",
    },
    [RESERVATION_STATUS.CANCELLED]: {
      text: "❌ Ακυρωμένη",
      className: "bg-red-500 text-white",
    },
    [RESERVATION_STATUS.SEATED]: {
      text: "🪑 Καθισμένη",
      className: "bg-purple-500 text-white",
    },
  };
  return (
    configMap[status] || { text: "Άγνωστο", className: "bg-gray-500 text-white" }
  );
};

