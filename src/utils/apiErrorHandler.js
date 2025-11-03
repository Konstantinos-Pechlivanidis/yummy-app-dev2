/**
 * Centralized API Error Handler
 * 
 * Provides consistent error message translation across the application.
 * Handles both HTTP status codes and backend-specific error messages.
 */

/**
 * Translates API errors to user-friendly Greek messages
 * @param {Error} error - The error object from axios
 * @param {string} context - Context for context-specific error messages ('auth', 'reservation', 'coupon', etc.)
 * @param {string} fallback - Fallback message if no specific translation is found
 * @returns {string} User-friendly error message
 */
export const translateApiError = (
  error,
  context = "",
  fallback = "Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά."
) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "";

  const status = error?.response?.status;

  // Status-based handling (highest priority)
  if (status === 401) {
    return "Δεν είστε συνδεδεμένος. Παρακαλώ συνδεθείτε ξανά.";
  }
  if (status === 403) {
    return "Δεν έχετε δικαίωμα πρόσβασης.";
  }
  if (status === 404) {
    return "Δεν βρέθηκε το ζητούμενο.";
  }
  if (status === 400) {
    // Will be handled by message-based handlers below
  }
  if (status === 429) {
    return "Πολλά αιτήματα. Παρακαλώ δοκιμάστε αργότερα.";
  }
  if (status >= 500) {
    return "Σφάλμα server. Παρακαλώ δοκιμάστε αργότερα.";
  }

  // Context-specific message handling
  const contextHandlers = {
    auth: () => {
      if (
        message.includes("Invalid credentials") ||
        message.includes("invalid credentials")
      ) {
        return "Λανθασμένα στοιχεία σύνδεσης.";
      }
      if (
        message.includes("User already exists") ||
        message.includes("user already exists")
      ) {
        return "Υπάρχει ήδη λογαριασμός με αυτό το email.";
      }
      if (
        message.includes("Owner already exists") ||
        message.includes("owner already exists")
      ) {
        return "Υπάρχει ήδη λογαριασμός ιδιοκτήτη με αυτό το email.";
      }
      if (message.includes("No token") || message.includes("Invalid token")) {
        return "Η συνεδρία έληξε. Παρακαλώ συνδεθείτε ξανά.";
      }
      return message || "Σφάλμα κατά την αυθεντικοποίηση.";
    },

    reservation: () => {
      if (
        message.includes("not confirmed") ||
        message.includes("Not confirmed")
      ) {
        return "Ο λογαριασμός σας δεν είναι επιβεβαιωμένος. Παρακαλώ επιβεβαιώστε το email σας.";
      }
      if (message.includes("Reservation not found")) {
        return "Η κράτηση δεν βρέθηκε.";
      }
      if (
        message.includes("Failed to create reservation") ||
        message.includes("failed to create")
      ) {
        return "Η δημιουργία κράτησης απέτυχε. Παρακαλώ δοκιμάστε ξανά.";
      }
      if (
        message.includes("Failed to cancel reservation") ||
        message.includes("failed to cancel")
      ) {
        return "Η ακύρωση κράτησης απέτυχε.";
      }
      if (
        message.includes("Failed to delete reservation") ||
        message.includes("failed to delete")
      ) {
        return "Η διαγραφή κράτησης απέτυχε.";
      }
      if (message.includes("Invalid status transition")) {
        return "Μη έγκυρη μετάβαση κατάστασης.";
      }
      if (
        message.includes("Coupon is not available") ||
        message.includes("coupon has already been used")
      ) {
        return "Το κουπόνι δεν είναι διαθέσιμο ή έχει ήδη χρησιμοποιηθεί.";
      }
      if (
        message.includes("does not belong to the selected restaurant") ||
        message.includes("Special menu or coupon does not belong")
      ) {
        return "Το κουπόνι ή το special menu δεν ανήκει στο επιλεγμένο εστιατόριο.";
      }
      return message || "Σφάλμα κατά την επεξεργασία κράτησης.";
    },

    coupon: () => {
      if (
        message.includes("not confirmed") ||
        message.includes("Not confirmed")
      ) {
        return "Ο λογαριασμός σας δεν είναι επιβεβαιωμένος. Παρακαλώ επιβεβαιώστε το email σας.";
      }
      if (message.includes("Insufficient points")) {
        return "Δεν έχετε αρκετούς πόντους για να αγοράσετε αυτό το κουπόνι.";
      }
      if (message.includes("Coupon not found")) {
        return "Το κουπόνι δεν βρέθηκε.";
      }
      if (
        message.includes("already purchased") ||
        message.includes("Coupon already purchased")
      ) {
        return "Έχετε ήδη αγοράσει αυτό το κουπόνι.";
      }
      if (
        message.includes("Cannot delete coupon") ||
        message.includes("unused or locked purchases")
      ) {
        return "Δεν μπορείτε να διαγράψετε το κουπόνι: υπάρχουν μη χρησιμοποιημένες ή κλειδωμένες αγορές.";
      }
      if (
        message.includes("Failed to fetch user coupons") ||
        message.includes("No coupons found")
      ) {
        return "Αποτυχία φόρτωσης κουπονιών.";
      }
      if (message.includes("coupon_id is required")) {
        return "Το κουπόνι είναι υποχρεωτικό.";
      }
      return message || "Σφάλμα κατά την επεξεργασία κουπονιού.";
    },

    restaurant: () => {
      if (message.includes("not found")) {
        return "Το εστιατόριο δεν βρέθηκε.";
      }
      if (
        message.includes("Failed to load restaurants") ||
        message.includes("Failed to load restaurant")
      ) {
        return "Αποτυχία φόρτωσης εστιατορίων.";
      }
      return message || "Σφάλμα κατά τη φόρτωση εστιατορίου.";
    },

    owner: () => {
      if (message.includes("Owner not found")) {
        return "Ο ιδιοκτήτης δεν βρέθηκε.";
      }
      if (message.includes("Not the owner")) {
        return "Δεν είστε ο ιδιοκτήτης αυτού του εστιατορίου.";
      }
      if (message.includes("Owner has no restaurant")) {
        return "Δεν έχετε εστιατόριο.";
      }
      return message || "Σφάλμα κατά την επεξεργασία δεδομένων ιδιοκτήτη.";
    },
  };

  // Try context-specific handler first
  if (context && contextHandlers[context]) {
    const contextMessage = contextHandlers[context]();
    if (contextMessage && contextMessage !== message) {
      return contextMessage;
    }
  }

  // If message exists and is meaningful, return it
  if (message && message.length > 0) {
    return message;
  }

  // Final fallback
  return fallback;
};

