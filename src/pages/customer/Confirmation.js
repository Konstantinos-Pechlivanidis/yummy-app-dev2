import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CalendarIcon, Users, Mail, Clock } from "lucide-react";
import {
  useReservationDetails,
  useRestaurantDetails,
} from "../../hooks/useDummyData";
import Loading from "../../components/Loading";
import { toast } from "react-hot-toast";

const ConfirmationPage = () => {
  const { id } = useParams(); // reservationId from route
  const navigate = useNavigate();

  const {
    data: reservation,
    isLoading: isLoadingRes,
    isError: isErrorRes,
  } = useReservationDetails(id);
  const {
    data: restaurant,
    isLoading: isLoadingRest,
    isError: isErrorRest,
  } = useRestaurantDetails(reservation?.restaurantId);

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-800 to-rose-500 px-6">
      <motion.div
        className="max-w-lg w-full bg-white shadow-xl rounded-3xl p-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800 mt-4">
              ✅ Επιτυχής Κράτηση!
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600">
              Η κράτησή σας βρίσκεται{" "}
              <strong>σε κατάσταση αναμονής (Pending)</strong> και θα απαντηθεί
              από το εστιατόριο σύντομα.
            </p>

            {/* Κάρτα με πληροφορίες κράτησης */}
            <div className="mt-6 bg-gray-100 p-4 rounded-xl shadow-sm text-gray-800 space-y-2">
              <p className="text-lg font-bold">{restaurant.name}</p>
              <p className="flex items-center justify-center text-gray-600">
                <CalendarIcon className="w-5 h-5 mr-2" />
                {reservation.date} - {reservation.time}
              </p>
              <p className="flex items-center justify-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                {reservation.guestCount} άτομα
              </p>
              <p className="flex items-center justify-center text-yellow-500 font-semibold">
                <Clock className="w-5 h-5 mr-2" />
                Κατάσταση: {reservation.status}
              </p>
              {reservation.specialMenuId && (
                <p>
                  🍽️ Special Menu:{" "}
                  <span className="font-semibold text-primary">Ναι</span>
                </p>
              )}
              {reservation.couponId && (
                <p>
                  🎟️ Κουπόνι:{" "}
                  <span className="font-semibold text-primary">Ναι</span>
                </p>
              )}
              {reservation.notes && (
                <p className="text-sm text-gray-700">📌 {reservation.notes}</p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
              <Mail className="w-5 h-5 mr-2" />
              Θα λάβετε email μόλις επιβεβαιωθεί η κράτηση!
            </div>

            <div className="mt-6 flex flex-col space-y-4">
              <Button
                className="bg-red-500 hover:bg-red-800 text-white font-semibold w-full py-3 rounded-xl transition-all"
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConfirmationPage;
