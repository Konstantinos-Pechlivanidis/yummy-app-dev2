import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { format, parse } from "date-fns";
import { el } from "date-fns/locale";

const statusColors = {
  pending: "bg-yellow-500",
  confirmed: "bg-green-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500",
};

const statusLabels = {
  pending: "Εκκρεμεί",
  approved: "Επιβεβαιωμένη",
  confirmed: "Επιβεβαιωμένη",
  completed: "Ολοκληρωμένη",
  cancelled: "Ακυρωμένη",
};

const ReservationCard = ({
  reservation,
  restaurantName,
  restaurantPhoto,
  restaurantCuisine,
  restaurantLocation,
  showCancel = false,
  onCancel = null,
}) => {
  const formattedDate = format(
    new Date(reservation.date),
    "eeee dd MMMM yyyy",
    { locale: el }
  );
  let formattedTime = reservation.time;
  try {
    const fullDateTime = new Date(
      `${reservation.date.split("T")[0]}T${reservation.time}`
    );
    if (!isNaN(fullDateTime)) {
      formattedTime = format(fullDateTime, "HH:mm");
    }
  } catch (err) {
    console.warn("⛔ Invalid time value:", reservation.time);
  }

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow hover:shadow-lg transition overflow-hidden">
      {restaurantPhoto && (
        <img
          src={restaurantPhoto}
          alt={restaurantName}
          className="w-full h-44 sm:h-52 object-cover"
        />
      )}

      <CardContent className="p-5 space-y-5 text-gray-700 text-sm sm:text-base">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 truncate">
            {restaurantName}
          </h3>
          <Badge
            className={`${
              statusColors[reservation.status]
            } text-white text-xs sm:text-sm px-2 py-1`}
          >
            {statusLabels[reservation.status] || "Άγνωστη"}
          </Badge>
        </div>

        {/* Cuisine + Location */}
        {(restaurantCuisine || restaurantLocation) && (
          <p className="text-sm sm:text-base text-gray-600 font-medium leading-tight">
            {restaurantCuisine} – {restaurantLocation}
          </p>
        )}

        {/* Info */}
        <div className="space-y-1 text-sm sm:text-base">
          <p>
            <strong>📆</strong> {formattedDate}
          </p>
          <p>
            <strong>🕒</strong> {formattedTime}
          </p>
          <p>
            <strong>👥</strong> {reservation.guest_count} άτομα
          </p>
          {reservation.reservation_notes && (
            <p>
              <strong>📝</strong> {reservation.reservation_notes}
            </p>
          )}
          {reservation.status === "cancelled" &&
            reservation.cancellationReason && (
              <p className="text-red-600">
                <strong>Λόγος ακύρωσης:</strong>{" "}
                {reservation.cancellationReason}
              </p>
            )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-3 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-sm px-4">
                Λεπτομέρειες
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>📋 Πληροφορίες Κράτησης</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm sm:text-base text-gray-800">
                <p>
                  <strong>📅 Ημερομηνία:</strong> {formattedDate}
                </p>
                <p>
                  <strong>🕒 Ώρα:</strong> {formattedTime}
                </p>
                <p>
                  <strong>👥 Άτομα:</strong> {reservation.guest_count}
                </p>
                {reservation.reservation_notes && (
                  <p>
                    <strong>📝 Σημειώσεις:</strong>{" "}
                    {reservation.reservation_notes}
                  </p>
                )}

                {reservation.special_menu && (
                  <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 space-y-1">
                    <h4 className="font-semibold text-red-700">
                      🎉 Happy Hour
                    </h4>
                    <p className="text-sm font-medium text-red-900">
                      {reservation.special_menu.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {reservation.special_menu.description}
                    </p>
                  </div>
                )}

                {reservation.coupon && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 space-y-1">
                    <h4 className="font-semibold text-blue-700">🎁 Κουπόνι</h4>
                    <p className="text-sm font-medium text-blue-900">
                      {reservation.coupon.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {reservation.coupon.description}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {showCancel && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onCancel(reservation)}
              className="text-sm px-4"
            >
              Ακύρωση
            </Button>
          )}

          <Link
            to={`/restaurant/${reservation.restaurant_id}`}
            className="w-full sm:w-auto"
          >
            <Button
              size="sm"
              variant="secondary"
              className="w-full text-sm px-4"
            >
              ➡ Εστιατόριο
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
