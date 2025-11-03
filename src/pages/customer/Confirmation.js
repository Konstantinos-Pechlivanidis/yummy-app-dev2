import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { CalendarIcon, Users, Mail, Clock } from "lucide-react";
import { useReservationDetails } from "../../hooks/customer/useReservations";
import { useRestaurantDetails } from "../../hooks/customer/useRestaurants";
import Loading from "../../components/Loading";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { el } from "date-fns/locale";
import SEOHelmet from "../../components/SEOHelmet";
import { fadeIn } from "../../constants/animations";

const ConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: reservation,
    isLoading: isLoadingRes,
    isError: isErrorRes,
  } = useReservationDetails(id);

  const restaurantId = reservation?.restaurant_id;

  const {
    data: restaurant,
    isLoading: isLoadingRest,
    isError: isErrorRest,
  } = useRestaurantDetails(restaurantId);

  useEffect(() => {
    if (!id) toast.error("Δεν βρέθηκε το ID της κράτησης.");
  }, [id]);

  if (!id || isErrorRes || isErrorRest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
        <p className="text-red-500 text-lg">
          ❌ Σφάλμα κατά τη φόρτωση των στοιχείων.
        </p>
        <Button
          className="mt-4 bg-gray-500 text-white"
          onClick={() => navigate("/")}
        >
          Επιστροφή στην Αρχική
        </Button>
      </div>
    );
  }

  if (isLoadingRes || isLoadingRest || !reservation || !restaurant) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <Loading />
      </section>
    );
  }

  const formattedDate = format(parseISO(reservation.date), "dd/MM/yyyy", {
    locale: el,
  });

  let formattedTime = reservation.time;
  try {
    const fullDateTime = new Date(`${reservation.date}T${reservation.time}`);
    if (!isNaN(fullDateTime)) {
      formattedTime = format(fullDateTime, "HH:mm");
    }
  } catch (err) {
    // Invalid time format - using original value
  }

  return (
    <>
      <SEOHelmet
        title="Επιβεβαίωση Κράτησης | Yummy App"
        description="Η κράτησή σας υποβλήθηκε επιτυχώς! Δείτε τα στοιχεία κράτησης και πότε θα επιβεβαιωθεί από το εστιατόριο."
        url="https://yummy-app.gr/confirmation"
        image="https://yummy-app.gr/images/yummyLogo-2.png"
      />
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Background Image */}
        <img
          src="/images/wide14.jpg"
          alt="Επιβεβαίωση Κράτησης Yummy"
          loading="eager"
          fetchpriority="high"
          width="1920"
          height="1080"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* ✅ Confirmation Box */}
        <div className="relative z-20 flex items-center justify-center min-h-screen px-6">
          <motion.div
            {...fadeIn}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                ✅ Επιτυχής Κράτηση!
              </h1>
              <p className="text-gray-600">
                Η κράτησή σας βρίσκεται{" "}
                <strong>σε κατάσταση αναμονής (Pending)</strong> και θα
                απαντηθεί από το εστιατόριο σύντομα.
              </p>
            </div>

            {/* 🔍 Λεπτομέρειες */}
            <div className="bg-gray-100 p-4 rounded-xl shadow-sm text-gray-800 space-y-2">
              <p className="text-lg font-bold">{restaurant.name}</p>
              <p className="flex items-center justify-center text-gray-600">
                <CalendarIcon className="w-5 h-5 mr-2" />
                {formattedDate} - {formattedTime}
              </p>
              <p className="flex items-center justify-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                {reservation.guest_count} άτομα
              </p>
              <p className="flex items-center justify-center text-yellow-500 font-semibold">
                <Clock className="w-5 h-5 mr-2" />
                Κατάσταση: {reservation.status}
              </p>
              {reservation.special_menu_id && (
                <p>
                  🍽️ Special Menu:{" "}
                  <span className="font-semibold text-primary">Ναι</span>
                </p>
              )}
              {reservation.coupon_id && (
                <p>
                  🎟️ Κουπόνι:{" "}
                  <span className="font-semibold text-primary">Ναι</span>
                </p>
              )}
              {reservation.reservation_notes && (
                <p className="text-sm text-gray-700">
                  📌 {reservation.reservation_notes}
                </p>
              )}
            </div>

            {/* 📧 Email */}
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Mail className="w-5 h-5 mr-2" />
              Θα λάβετε email μόλις επιβεβαιωθεί η κράτηση!
            </div>

            {/* 📦 Buttons */}
            <div className="flex flex-col space-y-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold w-full py-3 rounded-xl transition-all"
                onClick={() => navigate("/my-reservations")}
              >
                📅 Δείτε τις κρατήσεις μου
              </Button>
              <Button
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold w-full py-3 rounded-xl transition-all"
                onClick={() => navigate("/")}
              >
                🏠 Επιστροφή στην Αρχική
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationPage;
