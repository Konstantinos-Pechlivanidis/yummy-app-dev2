import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "./ui/dialog";
import { Table, TableHead, TableRow, TableCell, TableBody } from "./ui/table";
import { Badge } from "./ui/badge";
import {
  approveReservation,
  cancelReservation,
  markAsCompleted,
} from "../store/reservationsSlice";
import { Check, XCircle } from "lucide-react";

const ReservationManagement = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const reservations = useSelector((state) => state.reservations.reservations);
  const restaurants = useSelector((state) => state.menus.restaurants);
  const dispatch = useDispatch();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [actionType, setActionType] = useState("");

  if (!isAuthenticated || user?.role !== "owner") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-red-500 text-lg">
          ❌ Δεν έχετε πρόσβαση σε αυτήν τη σελίδα.
        </p>
        <Button
          className="mt-4 bg-gray-500 text-white"
          onClick={() => navigate("/")}
        >
          🏠 Επιστροφή στην Αρχική
        </Button>
      </div>
    );
  }

  // Λίστα των εστιατορίων που ανήκουν στον owner
  const ownerRestaurants = restaurants.filter((resto) => resto.ownerId === user.id);
  
  // Φιλτράρισμα κρατήσεων που αφορούν τα εστιατόρια του owner
  const ownerReservations = reservations.filter((res) =>
    ownerRestaurants.some((resto) => resto.id === res.restaurantId)
  );

  // Ταξινόμηση: Πρώτα οι "pending" κρατήσεις και μετά οι πιο πρόσφατες
  const sortedReservations = [...ownerReservations].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return new Date(b.date) - new Date(a.date);
  });
  // Άνοιγμα του Dialog
  const openDialog = (reservation, action) => {
    setSelectedReservation(reservation);
    setActionType(action);
  };

  // Επιβεβαίωση ενέργειας (έγκριση, ακύρωση, ολοκλήρωση)
  const handleConfirm = () => {
    if (selectedReservation) {
      if (
        actionType === "approve" &&
        selectedReservation.status === "pending"
      ) {
        dispatch(approveReservation(selectedReservation.id));
      } else if (
        actionType === "complete" &&
        selectedReservation.status === "approved"
      ) {
        dispatch(markAsCompleted(selectedReservation.id));
      } else if (actionType === "cancel") {
        dispatch(cancelReservation(selectedReservation.id));
      }
    }
    setSelectedReservation(null);
    setActionType("");
  };

  return (
    <section>
      <div className="overflow-x-auto hidden md:block">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell>Εστιατόριο</TableCell>
              <TableCell>Ημερομηνία</TableCell>
              <TableCell>Ώρα</TableCell>
              <TableCell>Κατάσταση</TableCell>
              <TableCell>Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedReservations.map((res) => (
              <TableRow key={res.id}>
                <TableCell>{res.restaurantId}</TableCell>
                <TableCell>{res.date}</TableCell>
                <TableCell>{res.time}</TableCell>
                <TableCell>
                  <Badge
                    className={`text-md px-3 py-1.5 font-semibold rounded-md ${
                      res.status === "approved"
                        ? "bg-blue-500 text-white"
                        : res.status === "pending"
                        ? "bg-yellow-600 text-black"
                        : res.status === "completed"
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {res.status === "approved"
                      ? "✅ Εγκρίθηκε"
                      : res.status === "pending"
                      ? "⏳ Αναμονή"
                      : res.status === "completed"
                      ? "🏁 Ολοκληρωμένο"
                      : "❌ Ακυρωμένο"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {res.status === "pending" && (
                    <>
                      <Button
                        className="bg-blue-500 text-white mr-2"
                        onClick={() => openDialog(res, "approve")}
                      >
                        <Check className="w-4 h-4" /> Έγκριση
                      </Button>
                      <Button
                        className="bg-red-500 text-white"
                        onClick={() => openDialog(res, "cancel")}
                      >
                        <XCircle className="w-4 h-4" /> Ακύρωση
                      </Button>
                    </>
                  )}
                  {res.status === "approved" && (
                    <>
                      <Button
                        className="bg-green-500 text-white mr-2"
                        onClick={() => openDialog(res, "complete")}
                      >
                        <Check className="w-4 h-4" /> Ολοκλήρωση
                      </Button>
                      <Button
                        className="bg-red-500 text-white"
                        onClick={() => openDialog(res, "cancel")}
                      >
                        <XCircle className="w-4 h-4" /> Ακύρωση
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {sortedReservations.map((res) => (
          <div key={res.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{res.restaurantId}</h3>
            <p className="text-gray-600">
              📅 {res.date} | ⏰ {res.time}
            </p>
            <p className="mt-2">
              <Badge
                className={`text-md px-3 py-1.5 font-semibold rounded-md ${
                  res.status === "approved"
                    ? "bg-blue-500 text-white"
                    : res.status === "pending"
                    ? "bg-yellow-600 text-black"
                    : res.status === "completed"
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {res.status === "approved"
                  ? "✅ Εγκρίθηκε"
                  : res.status === "pending"
                  ? "⏳ Αναμονή"
                  : res.status === "completed"
                  ? "🏁 Ολοκληρωμένο"
                  : "❌ Ακυρωμένο"}
              </Badge>
            </p>
            <div className="flex gap-2 mt-2">
              {res.status === "pending" && (
                <>
                  <Button
                    className="bg-blue-500 text-white flex-1"
                    onClick={() => openDialog(res, "approve")}
                  >
                    <Check className="w-4 h-4" /> Έγκριση
                  </Button>
                  <Button
                    className="bg-red-500 text-white flex-1"
                    onClick={() => openDialog(res, "cancel")}
                  >
                    <XCircle className="w-4 h-4" /> Ακύρωση
                  </Button>
                </>
              )}
              {res.status === "approved" && (
                <>
                  <Button
                    className="bg-green-500 text-white flex-1"
                    onClick={() => openDialog(res, "complete")}
                  >
                    <Check className="w-4 h-4" /> Ολοκλήρωση
                  </Button>
                  <Button
                    className="bg-red-500 text-white flex-1"
                    onClick={() => openDialog(res, "cancel")}
                  >
                    <XCircle className="w-4 h-4" /> Ακύρωση
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialog Επιβεβαίωσης */}
      {selectedReservation && (
        <Dialog
          open={selectedReservation !== null}
          onOpenChange={() => setSelectedReservation(null)}
        >
          <DialogContent>
            <DialogHeader>
              <h2 className="text-lg font-bold">
                {actionType === "approve"
                  ? "Έγκριση Κράτησης"
                  : actionType === "complete"
                  ? "Ολοκλήρωση Κράτησης"
                  : "Ακύρωση Κράτησης"}
              </h2>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-gray-500 text-white"
                onClick={() => setSelectedReservation(null)}
              >
                Άκυρο
              </Button>
              <Button className="text-white bg-red-500" onClick={handleConfirm}>
                {actionType === "cancel" ? "Ακύρωση" : "Επιβεβαίωση"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default ReservationManagement;
