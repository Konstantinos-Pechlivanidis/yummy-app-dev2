import { useSelector } from "react-redux";
import { restaurants, coupons } from "../data/dummyData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TabsContent } from "../components/ui/tabs";
import { Clock, MapPin, Star, Phone, Mail, Ticket, Users } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const OverviewManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const reservations = useSelector((state) => state.reservations.reservations);

  const ownerRestaurants = restaurants.filter((resto) => resto.ownerId === user.id);

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ownerRestaurants.map((restaurant) => {
          const restaurantReservations = reservations.filter((res) => res.restaurantId === restaurant.id);
          const activeCoupons = coupons.filter((coupon) => coupon.restaurantId === restaurant.id);
          const happyHourInfo =
            restaurant.happyHours.length > 0
              ? restaurant.happyHours
                  .map((hh) => `${hh.startTime} - ${hh.endTime} (${hh.discountPercentage}% έκπτωση)`)
                  .join(", ")
              : "Δεν υπάρχουν Happy Hours";

          return (
            <Card key={restaurant.id} className="shadow-lg rounded-lg overflow-hidden bg-white">
              <CardHeader className="bg-gray-100 p-4">
                <CardTitle className="text-lg md:text-xl font-semibold">{restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <p className="text-sm md:text-base">
                    {restaurant.address.street} {restaurant.address.number}, {restaurant.address.area}, {restaurant.address.postalCode}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <p className="text-sm md:text-base">Αξιολόγηση: {restaurant.rating}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <p className="text-sm md:text-base">
                    Ώρες: {restaurant.openingHours.open} - {restaurant.openingHours.close}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <p className="text-sm md:text-base">Τραπέζια: {restaurant.totalTables}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-green-500" />
                  <p className="text-sm md:text-base">Κουπόνια: {activeCoupons.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <p className="text-sm md:text-base">Κρατήσεις: {restaurantReservations.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <p className="text-sm md:text-base">Happy Hours: {happyHourInfo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <p className="text-sm md:text-base">{restaurant.contact.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-red-600" />
                  <p className="text-sm md:text-base">{restaurant.contact.email}</p>
                </div>

                {/* Social Media */}
                {restaurant.contact.socialMedia && (
                  <div className="mt-3 flex gap-3">
                    {restaurant.contact.socialMedia.facebook && (
                      <a href={restaurant.contact.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                        <button
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:opacity-80 transition"
                          style={{ backgroundColor: "#1877F2", color: "#fff" }}
                        >
                          <FaFacebook className="w-4 h-4 text-white" /> Facebook
                        </button>
                      </a>
                    )}
                    {restaurant.contact.socialMedia.instagram && (
                      <a href={restaurant.contact.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                        <button
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:opacity-80 transition"
                          style={{ backgroundColor: "#E4405F", color: "#fff" }}
                        >
                          <FaInstagram className="w-4 h-4 text-white" /> Instagram
                        </button>
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default OverviewManagement;
