import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useReservationDetails } from "../hooks/useDummyData";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";
import Loading from "./Loading";

const statusColor = {
  approved: "bg-green-500",
  pending: "bg-yellow-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500",
};

const ReservationDetailsDialog = ({ reservationId }) => {
  const { data: res, isLoading, isError } = useReservationDetails(reservationId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Λεπτομέρειες
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Λεπτομέρειες Κράτησης</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Loading />
        ) : isError ? (
          <p className="text-red-600 text-sm">⚠️ Σφάλμα κατά την ανάκτηση.</p>
        ) : (
          <div className="text-sm text-gray-700 space-y-3">
            <div className="flex justify-between items-center">
              <p>
                <strong>Ημερομηνία:</strong> {res.date}
              </p>
              <Badge className={statusColor[res.status]}>
                {res.status.toUpperCase()}
              </Badge>
            </div>
            <p>
              <strong>Ώρα:</strong> {res.time}
            </p>
            <p>
              <strong>Άτομα:</strong> {res.guestCount}
            </p>
            <p>
              <strong>Εστιατόριο:</strong> {res.restaurantId}
            </p>
            {res.specialMenuId && (
              <p>
                <strong>Special Menu:</strong> {res.specialMenuId}
              </p>
            )}
            {res.couponId && (
              <p>
                <strong>Κουπόνι:</strong> {res.couponId}
              </p>
            )}
            {res.notes && (
              <p>
                <strong>Σημειώσεις:</strong> {res.notes}
              </p>
            )}
            {res.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{res.rating}/5</span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDetailsDialog;
