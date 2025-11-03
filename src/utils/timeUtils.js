/**
 * Time Utility Functions
 * Centralized time-related utilities
 */

import { TIME } from "../constants/times";

/**
 * Generate time slots for a given range
 * @param {number} openingHour - Opening hour (default: 10)
 * @param {number} closingHour - Closing hour (default: 24)
 * @param {number} interval - Interval in minutes (default: 30)
 * @returns {string[]} Array of time strings in HH:mm format
 */
export const generateTimeSlots = (
  openingHour = TIME.OPENING_HOUR,
  closingHour = TIME.CLOSING_HOUR,
  interval = TIME.SLOT_INTERVAL
) => {
  const slots = [];
  for (let h = openingHour; h < closingHour; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
    if (interval === 30) {
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

/**
 * Format time string
 * @param {string} time - Time string in HH:mm format
 * @returns {string} Formatted time string
 */
export const formatTime = (time) => {
  if (!time) return "";
  return time;
};

/**
 * Validate if a time string is in correct format
 * @param {string} time - Time string to validate
 * @returns {boolean} True if valid format (HH:mm)
 */
export const isValidTimeSlot = (time) => {
  if (!time || typeof time !== "string") return false;
  return /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(time);
};

