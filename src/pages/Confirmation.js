import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Animation
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckCircle, CalendarIcon, Users, Mail, Clock } from "lucide-react";
import { restaurants } from "../data/dummyData";

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state;

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
        <p className="text-red-500 text-lg">❌ Δεν βρέθηκαν πληροφορίες κράτησης.</p>
        <Button className="mt-4 bg-gray-500 text-white" onClick={() => navigate("/")}>
          Επιστροφή στην Αρχική
        </Button>
      </div>
    );
  }

  const restaurant = restaurants.find((resto) => resto.id === reservation.restaurantId);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 px-6">
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
              Η κράτησή σας βρίσκεται **σε κατάσταση αναμονής (Pending)** και θα απαντηθεί από το εστιατόριο σύντομα.  
              Θα λάβετε ειδοποίηση στο email σας! 📩
            </p>

            {/* 🏠 Στοιχεία Κράτησης */}
            <div className="mt-6 bg-gray-100 p-4 rounded-xl shadow-sm text-gray-800">
              <p className="text-lg font-bold">{restaurant?.name || "Άγνωστο Εστιατόριο"}</p>
              <p className="flex items-center justify-center text-gray-600 mt-2">
                <CalendarIcon className="w-5 h-5 mr-2" />
                {reservation.date} - {reservation.time}
              </p>
              <p className="flex items-center justify-center text-gray-600 mt-1">
                <Users className="w-5 h-5 mr-2" />
                {reservation.guests} άτομα
              </p>
              <p className="flex items-center justify-center text-yellow-500 mt-1 font-semibold">
                <Clock className="w-5 h-5 mr-2" />
                Status: Pending (Αναμονή επιβεβαίωσης)
              </p>
              {reservation.specialMenu && (
                <p className="text-gray-700">🍽️ Special Menu: Ναι</p>
              )}
              {reservation.coupon && <p className="text-gray-700">🎟️ Κουπόνι: Ναι</p>}
            </div>

            {/* 📩 Ειδοποίηση */}
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <Mail className="w-5 h-5 mr-2" />
              Θα λάβετε email μόλις επιβεβαιωθεί η κράτηση!
            </div>

            {/* 🎯 Call To Actions */}
            <div className="mt-6 flex flex-col space-y-4">
              <Button
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold w-full py-3 rounded-xl transition-all"
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
