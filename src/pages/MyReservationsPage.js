import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useUserReservations,
  useCancelReservation,
} from "../hooks/useDummyData";
import { restaurants } from "../data/dummyData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import Loading from "../components/Loading";
import { format, parse } from "date-fns";
import { el } from "date-fns/locale";

const statusColors = {
  pending: "bg-yellow-500",
  confirmed: "bg-green-500",
  completed: "bg-blue-500",
  cancelled: "bg-red-500",
};

const statusIcon = {
  pending: "⏳",
  confirmed: "✅",
  completed: "📁",
  cancelled: "❌",
};

const MyReservationsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const {
    data: reservations = [],
    isLoading,
    isError,
  } = useUserReservations(user?.id);
  const { mutate: cancelReservation } = useCancelReservation();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const activeReservations = reservations.filter((r) =>
    ["pending", "confirmed"].includes(r.status)
  );
  const pastReservations = reservations.filter((r) =>
    ["completed", "cancelled"].includes(r.status)
  );

  const paginatedPastReservations = pastReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(pastReservations.length / itemsPerPage);

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      setCancelError(true);
      return;
    }

    cancelReservation(
      {
        reservationId: selectedReservation.id,
        reason: cancelReason.trim(),
      },
      {
        onSuccess: () => {
          setConfirmDialogOpen(false);
          setSelectedReservation(null);
          setResultMessage("✅ Η κράτηση ακυρώθηκε επιτυχώς.");
          setResultDialogOpen(true);
          setCancelReason("");
          setCancelError(false);
        },
      }
    );
  };

  const getRestaurantName = (id) =>
    restaurants.find((r) => r.id === id)?.name || "Άγνωστο Εστιατόριο";

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-10 space-y-16">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
        📅 Οι Κρατήσεις μου
      </h1>

      {/* Active Reservations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🔔 Ενεργές Κρατήσεις
        </h2>

        {isLoading ? (
          <Loading />
        ) : isError ? (
          <p className="text-red-600">⚠️ Σφάλμα φόρτωσης κρατήσεων.</p>
        ) : activeReservations.length === 0 ? (
          <p className="text-gray-600 italic">Δεν έχεις ενεργές κρατήσεις.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeReservations.map((res) => {
              const formattedDate = format(
                parse(res.date, "yyyy-MM-dd", new Date()),
                "eeee dd MMMM yyyy",
                { locale: el }
              );
              const restaurantName = getRestaurantName(res.restaurantId);

              return (
                <Card
                  key={res.id}
                  className="rounded-xl shadow hover:shadow-lg transition-all p-5"
                >
                  <CardHeader className="flex justify-between items-center pb-2">
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {statusIcon[res.status]} {restaurantName}
                    </CardTitle>
                    <Badge className={`${statusColors[res.status]} text-white`}>
                      {res.status.toUpperCase()}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-gray-700 mt-1">
                    <p>
                      <strong>📆 Ημερομηνία:</strong> {formattedDate}
                    </p>
                    <p>
                      <strong>🕒 Ώρα:</strong> {res.time}
                    </p>
                    <p>
                      <strong>👥 Άτομα:</strong> {res.guestCount}
                    </p>
                    {res.notes && (
                      <p>
                        <strong>📝:</strong> {res.notes}
                      </p>
                    )}

                    <div className="flex gap-3 mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Λεπτομέρειες
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Πληροφορίες Κράτησης</DialogTitle>
                          </DialogHeader>
                          <p>
                            <strong>Ημερομηνία:</strong> {formattedDate}
                          </p>
                          <p>
                            <strong>Ώρα:</strong> {res.time}
                          </p>
                          <p>
                            <strong>Άτομα:</strong> {res.guestCount}
                          </p>
                          {res.notes && (
                            <p>
                              <strong>Σημειώσεις:</strong> {res.notes}
                            </p>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedReservation(res);
                          setConfirmDialogOpen(true);
                        }}
                      >
                        Ακύρωση
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Separator />

      {/* Past Reservations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📁 Προηγούμενες Κρατήσεις
        </h2>

        {paginatedPastReservations.length === 0 ? (
          <p className="text-gray-600 italic">
            Δεν έχεις προηγούμενες κρατήσεις.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPastReservations.map((res) => {
                const formattedDate = format(
                  parse(res.date, "yyyy-MM-dd", new Date()),
                  "eeee dd MMMM yyyy",
                  { locale: el }
                );
                const restaurantName = getRestaurantName(res.restaurantId);

                return (
                  <Card
                    key={res.id}
                    className="rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <CardHeader className="flex justify-between items-center pb-2">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        {statusIcon[res.status]} {restaurantName}
                      </CardTitle>
                      <Badge
                        className={`${statusColors[res.status]} text-white`}
                      >
                        {res.status.toUpperCase()}
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-1 mt-1">
                      <p>
                        <strong>📆</strong> {formattedDate}
                      </p>
                      <p>
                        <strong>🕒</strong> {res.time}
                      </p>
                      <p>
                        <strong>👥</strong> {res.guestCount} άτομα
                      </p>
                      {res.notes && (
                        <p>
                          <strong>📝</strong> {res.notes}
                        </p>
                      )}
                      {res.status === "cancelled" && res.cancellationReason && (
                        <p className="text-sm text-red-700">
                          <strong>Λόγος ακύρωσης:</strong>{" "}
                          {res.cancellationReason}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Προηγούμενη
                </Button>
                <span className="text-gray-600">
                  Σελίδα {currentPage} από {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Επόμενη
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Confirm Cancellation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onOpenChange={(open) => {
          setConfirmDialogOpen(open);
          if (!open) {
            setSelectedReservation(null);
            setCancelReason("");
            setCancelError(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>❌ Επιβεβαίωση Ακύρωσης</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 mb-2">
            Είσαι σίγουρος ότι θέλεις να ακυρώσεις την κράτηση;
          </p>
          <p className="text-sm text-gray-500">
            ⚠️ Εάν απομένουν λιγότερες από 2 ώρες, ενδέχεται να χάσεις προνόμια.
          </p>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Λόγος ακύρωσης <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              rows={3}
              placeholder="Π.χ. Προέκυψε άλλο ραντεβού..."
            />
            {cancelError && (
              <p className="text-red-500 text-sm mt-1">
                Ο λόγος είναι υποχρεωτικός.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Άκυρο
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Επιβεβαίωση
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ℹ️ Ενημέρωση</DialogTitle>
          </DialogHeader>
          <p>{resultMessage}</p>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setResultDialogOpen(false)}>ΟΚ</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyReservationsPage;
