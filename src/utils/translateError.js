export const translateError = (err) => {
  if (!err?.response?.data) return "Κάτι πήγε στραβά. Προσπαθήστε ξανά.";

  const { message, error } = err.response.data;
  const msg = message || error;

  if (!msg || typeof msg !== "string") return "Άγνωστο σφάλμα.";

  // ✅ Αντιστοιχίσεις backend + Joi errors
  const translations = {
    "User already exists": "Ο χρήστης υπάρχει ήδη.",
    "Invalid credentials": "Λανθασμένο email ή κωδικός.",
    "Unauthorized - No token found": "Δεν είστε συνδεδεμένοι.",
    "Unauthorized - Invalid token": "Η συνεδρία έχει λήξει.",
    "User is already verified.": "Ο χρήστης έχει ήδη επιβεβαιωθεί.",
    "User not found.": "Ο χρήστης δεν βρέθηκε.",
    "Email is required.": "Το email είναι υποχρεωτικό.",
    "restaurantId is required in the body": "Δεν επιλέχθηκε εστιατόριο.",
    "No valid fields provided for update": "Δεν δόθηκαν στοιχεία για ενημέρωση.",
    "Invalid or expired token": "Ο σύνδεσμος επιβεβαίωσης δεν είναι έγκυρος ή έχει λήξει.",
    "Internal Server Error": "Προέκυψε σφάλμα στον διακομιστή.",
    "Server error": "Σφάλμα στον διακομιστή.",
  };

  // ✅ Προσπάθεια απλής αντιστοίχισης
  if (translations[msg]) return translations[msg];

  // ✅ Αντιμετώπιση Joi patterns
  if (msg.includes("must be a valid email")) return "Το email δεν είναι έγκυρο.";
  if (msg.includes("is required")) return "Όλα τα υποχρεωτικά πεδία πρέπει να συμπληρωθούν.";
  if (msg.includes("must be at least")) return "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.";
  if (msg.includes("must be a string")) return "Μη έγκυρη μορφή δεδομένων.";
  if (msg.includes("not allowed to be empty")) return "Το πεδίο δεν μπορεί να είναι κενό.";

  return msg; // fallback
};