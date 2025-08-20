// components/dashboard/OverviewManagement.jsx
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, MapPin, Star, Phone, Mail, Ticket, Users } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useOwnerOverview, useOwnerRestaurant } from "../../hooks/owner/useOwnerRestaurant";

/**
 * Normalize any restaurant shape coming from:
 * - GET /restaurant/owner/overview  (preferred: returns *_count, maybe happy_hours)
 * - GET /restaurant/owner           (fallback: returns arrays coupons/reservations/etc.)
 */
const normalizeRestaurant = (r) => {
  const address =
    r?.address && typeof r.address === "object"
      ? {
          street: r.address.street || "",
          number: r.address.number || "",
          area: r.address.area || "",
          postalCode: r.address.postalCode || "",
        }
      : null;

  const opening =
    r?.opening_hours && typeof r.opening_hours === "object"
      ? {
          open: r.opening_hours.open || "—",
          close: r.opening_hours.close || "—",
        }
      : null;

  const contact =
    r?.contact && typeof r.contact === "object"
      ? {
          phone: r.contact.phone || "—",
          email: r.contact.email || "—",
          socialMedia: {
            facebook: r.contact?.socialMedia?.facebook || "",
            instagram: r.contact?.socialMedia?.instagram || "",
          },
        }
      : { phone: "—", email: "—", socialMedia: { facebook: "", instagram: "" } };

  // counts: prefer *_count fields from overview; fallback to arrays length if present
  const couponsCount =
    typeof r.coupons_count === "number"
      ? r.coupons_count
      : Array.isArray(r.coupons)
      ? r.coupons.length
      : 0;

  const reservationsCount =
    typeof r.reservations_count === "number"
      ? r.reservations_count
      : Array.isArray(r.reservations)
      ? r.reservations.length
      : 0;

  // happy hours: if backend includes precomputed list; otherwise leave empty
  const happyHours = Array.isArray(r.happy_hours) ? r.happy_hours : [];

  // capacity/total tables (optional — shown only if exists)
  const totalTables = r.total_tables ?? r.totalTables ?? null;

  return {
    id: r.id,
    name: r.name || "—",
    rating: r.rating ?? "—",
    address,
    opening,
    contact,
    couponsCount,
    reservationsCount,
    happyHours,
    totalTables,
  };
};

const formatAddress = (addr) => {
  if (!addr) return "—";
  return [
    addr.street && `${addr.street} ${addr.number || ""}`.trim(),
    addr.area,
    addr.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
};

const formatHappyHours = (list) => {
  if (!list || list.length === 0) return "Δεν υπάρχουν Happy Hours";
  // support either {startTime,endTime,discount_percentage} or generic fields
  return list
    .map((hh) => {
      const start = hh.startTime || hh.start || hh.from || "—";
      const end = hh.endTime || hh.end || hh.to || "—";
      const pct =
        hh.discount_percentage ??
        hh.discount ??
        hh.percent ??
        hh.percentage ??
        "—";
      return `${start} - ${end} (${pct}% έκπτωση)`;
    })
    .join(", ");
};

const OverviewManagement = () => {
  // Preferred: aggregated list of all owner restaurants with counts
  const { data: overviewData, isLoading: loadingOverview } = useOwnerOverview();

  // Fallback: if overview API returns empty/undefined, show at least the single owner restaurant record
  const { data: ownerRestaurant, isLoading: loadingOwner } = useOwnerRestaurant();

  const restaurants = useMemo(() => {
    const list = Array.isArray(overviewData) ? overviewData : [];
    if (list.length > 0) {
      return list.map(normalizeRestaurant);
    }
    // fallback: build a single-item list from ownerRestaurant if available
    return ownerRestaurant ? [normalizeRestaurant(ownerRestaurant)] : [];
  }, [overviewData, ownerRestaurant]);

  if (loadingOverview || loadingOwner) {
    return <p>Φόρτωση...</p>;
  }

  if (restaurants.length === 0) {
    return <p>Δεν βρέθηκαν δεδομένα εστιατορίων για τον ιδιοκτήτη.</p>;
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="shadow-lg rounded-lg overflow-hidden bg-white">
            <CardHeader className="bg-gray-100 p-4">
              <CardTitle className="text-lg md:text-xl font-semibold">
                {restaurant.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2">
              {/* Address */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <p className="text-sm md:text-base">
                  {formatAddress(restaurant.address)}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <p className="text-sm md:text-base">
                  Αξιολόγηση: {restaurant.rating ?? "—"}
                </p>
              </div>

              {/* Opening hours */}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <p className="text-sm md:text-base">
                  Ώρες:{" "}
                  {restaurant.opening
                    ? `${restaurant.opening.open} - ${restaurant.opening.close}`
                    : "—"}
                </p>
              </div>

              {/* Optional total tables/capacity */}
              {restaurant.totalTables !== null && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <p className="text-sm md:text-base">
                    Τραπέζια: {restaurant.totalTables}
                  </p>
                </div>
              )}

              {/* Coupons count */}
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-green-500" />
                <p className="text-sm md:text-base">
                  Κουπόνια: {restaurant.couponsCount}
                </p>
              </div>

              {/* Reservations count */}
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <p className="text-sm md:text-base">
                  Κρατήσεις: {restaurant.reservationsCount}
                </p>
              </div>

              {/* Happy Hours */}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <p className="text-sm md:text-base">
                  Happy Hours: {formatHappyHours(restaurant.happyHours)}
                </p>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                <p className="text-sm md:text-base">{restaurant.contact.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-600" />
                <p className="text-sm md:text-base">{restaurant.contact.email}</p>
              </div>

              {/* Social Media */}
              {(restaurant.contact.socialMedia.facebook ||
                restaurant.contact.socialMedia.instagram) && (
                <div className="mt-3 flex gap-3">
                  {restaurant.contact.socialMedia.facebook && (
                    <a
                      href={restaurant.contact.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:opacity-80 transition"
                        style={{ backgroundColor: "#1877F2", color: "#fff" }}
                      >
                        <FaFacebook className="w-4 h-4 text-white" /> Facebook
                      </button>
                    </a>
                  )}
                  {restaurant.contact.socialMedia.instagram && (
                    <a
                      href={restaurant.contact.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
        ))}
      </div>
    </section>
  );
};

export default OverviewManagement;
