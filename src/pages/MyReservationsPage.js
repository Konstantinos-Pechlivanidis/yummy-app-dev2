import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelReservation } from "../store/reservationsSlice";
import { restaurants } from "../data/dummyData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";
import { format, parse, differenceInMinutes } from "date-fns";

const MyReservationsPage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const reservations = useSelector((state) => state.reservations.reservations);
  const userReservations = reservations.filter(
    (res) => res.userId === user?.id
  );

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPenaltyDialogOpen, setIsPenaltyDialogOpen] = useState(false);
  const [penaltyMessage, setPenaltyMessage] = useState("");

  const activeReservations = userReservations.filter(
    (res) => res.status === "pending" || res.status === "confirmed"
  );
  const pastReservations = userReservations.filter(
    (res) => res.status === "completed" || res.status === "canceled"
  );

  const handleCancel = () => {
    if (!confirmDialog) return;

    const now = new Date();
    const reservationDateTime = parse(
      `${confirmDialog.date} ${confirmDialog.time}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );

    const minutesUntilReservation = differenceInMinutes(
      reservationDateTime,
      now
    );

    // Apply penalty ONLY if the user cancels WITHIN 2 hours before the reservation time
    if (minutesUntilReservation > 0 && minutesUntilReservation <= 120) {
      setPenaltyMessage(
        "❗ Η κράτηση ακυρώθηκε, αλλά έχασες Loyalty Points & εκπτώσεις."
      );
      setIsPenaltyDialogOpen(true);
    } else {
      setPenaltyMessage("✅ Η κράτηση ακυρώθηκε επιτυχώς χωρίς ποινή.");
      setIsPenaltyDialogOpen(true);
    }

    dispatch(cancelReservation(confirmDialog.id));
    setConfirmDialog(null);
    setIsDialogOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <p className="text-center text-gray-600 mt-10">
        ❌ Πρέπει να συνδεθείς για να δεις τις κρατήσεις σου.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">
        📅 Οι Κρατήσεις μου
      </h1>

      {/* 🔴 Ενεργές Κρατήσεις */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ⏳ Ενεργές Κρατήσεις
        </h2>
        {activeReservations.length === 0 ? (
          <p className="text-gray-600">Δεν έχεις ενεργές κρατήσεις.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeReservations.map((reservation) => {
              const restaurant = restaurants.find(
                (resto) => resto.id === reservation.restaurantId
              );

              return (
                <Card key={reservation.id} className="p-4 shadow-md">
                  <CardHeader>
                    {restaurant ? (
                      <CardTitle className="text-lg">
                        {restaurant.name}
                      </CardTitle>
                    ) : (
                      <CardTitle className="text-red-500">
                        ❌ Εστιατόριο μη διαθέσιμο
                      </CardTitle>
                    )}

                    <Badge
                      className={`px-4 py-2 text-sm font-semibold rounded-lg
              ${
                reservation.status === "confirmed"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
                    >
                      {reservation.status === "confirmed"
                        ? "✅ Επιβεβαιωμένο"
                        : "⏳ Αναμονή για επιβεβαίωση"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p>
                      📅 {format(new Date(reservation.date), "dd/MM/yyyy")} | 🕒{" "}
                      {reservation.time}
                    </p>
                    <p>👥 {reservation.guestCount} άτομα</p>
                    <div className="flex gap-2 mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedReservation(reservation)}
                            className="bg-gray-500 text-white"
                          >
                            ℹ️ Λεπτομέρειες
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>ℹ️ Λεπτομέρειες Κράτησης</DialogTitle>
                          </DialogHeader>
                          <p>🗓️ Ημερομηνία: {reservation.date}</p>
                          <p>🕒 Ώρα: {reservation.time}</p>
                          <p>👥 Άτομα: {reservation.guestCount}</p>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => {
                          setConfirmDialog(reservation);
                          setIsDialogOpen(true);
                        }}
                        className="bg-red-500 text-white"
                      >
                        ❌ Ακύρωση
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Separator className="my-10" />

      {/* ✅ Ολοκληρωμένες / Ακυρωμένες Κρατήσεις */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ✅ Προηγούμενες Κρατήσεις
        </h2>
        {pastReservations.length === 0 ? (
          <p className="text-gray-600">Δεν έχεις προηγούμενες κρατήσεις.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pastReservations.map((reservation) => {
              const restaurant = restaurants.find(
                (resto) => resto.id === reservation.restaurantId
              );

              return (
                <Card key={reservation.id} className="p-4 shadow-md">
                  <CardHeader>
                    {restaurant ? (
                      <CardTitle className="text-lg">
                        {restaurant.name}
                      </CardTitle>
                    ) : (
                      <CardTitle className="text-red-500">
                        ❌ Εστιατόριο μη διαθέσιμο
                      </CardTitle>
                    )}

                    <Badge
                      className={`px-4 py-2 text-sm font-semibold 
              ${
                reservation.status === "completed"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
                    >
                      {reservation.status === "completed"
                        ? "✅ Ολοκληρωμένο"
                        : "❌ Ακυρωμένο"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p>
                      📅 {format(new Date(reservation.date), "dd/MM/yyyy")} | 🕒{" "}
                      {reservation.time}
                    </p>
                    <p>👥 {reservation.guestCount} άτομα</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* ℹ️ Dialog Επιβεβαίωσης Ακύρωσης */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>❌ Επιβεβαίωση Ακύρωσης</DialogTitle>
          </DialogHeader>
          <p>Είσαι σίγουρος ότι θέλεις να ακυρώσεις την κράτηση;</p>
          <p className="text-red-600">
            Αν η κράτηση είναι λιγότερο από 2 ώρες πριν, θα χάσεις Loyalty
            Points και τυχόν κουπόνια ή Special Menu που έχεις επιλέξει.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ❌ Όχι, διατήρηση κράτησης
            </Button>
            <Button className="bg-red-600 text-white" onClick={handleCancel}>
              ✅ Ναι, ακύρωση
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ℹ️ Dialog Ποινής ή Επιτυχίας */}
      <Dialog open={isPenaltyDialogOpen} onOpenChange={setIsPenaltyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ℹ️ Ενημέρωση Ακύρωσης</DialogTitle>
          </DialogHeader>
          <p>{penaltyMessage}</p>
          <Button
            className="bg-blue-500 text-white mt-4"
            onClick={() => setIsPenaltyDialogOpen(false)}
          >
            ΟΚ
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyReservationsPage;
