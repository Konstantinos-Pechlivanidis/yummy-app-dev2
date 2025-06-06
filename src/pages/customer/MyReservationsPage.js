import { useState, useCallback  } from "react";
import { useSelector } from "react-redux";
import {
  useFilteredReservations,
  useCancelReservation,
  useRestaurants,
} from "../../hooks/useDummyData";
import ReservationFilterBar from "../../components/reservations/ReservationFilterBar";
import ReservationCard from "../../components/reservations/ReservationCard";
import CancelReservationDialog from "../../components/reservations/CancelReservationDialog";
import ResultDialog from "../../components/reservations/ResultDialog";
import ReservationPagination from "../../components/reservations/ReservationPagination";
import Loading from "../../components/Loading";

const MyReservationsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [filters, setFilters] = useState({ date: null, status: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const {
    data: { data: reservations = [], total = 0 } = {},
    isLoading,
    isError,
  } = useFilteredReservations(
    user?.id,
    filters.date,
    filters.status,
    currentPage,
    itemsPerPage
  );

  const { mutate: cancelReservation } = useCancelReservation();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const handleCancel = ({ reservationId, reason }) => {
    cancelReservation(
      { reservationId, reason },
      {
        onSuccess: () => {
          setShowCancelDialog(false);
          setResultMessage("✅ Η κράτηση ακυρώθηκε επιτυχώς.");
          setResultDialogOpen(true);
        },
      }
    );
  };

  const { data: allRestaurants = [] } = useRestaurants();

  const handleFilterChange = useCallback((filters) => {
  setFilters(filters);
  setCurrentPage(1);
}, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-10 space-y-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
        📅 Οι Κρατήσεις μου
      </h1>

      <ReservationFilterBar onFilterChange={handleFilterChange} />

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p className="text-red-600">
          ⚠️ Προέκυψε σφάλμα κατά την ανάκτηση κρατήσεων.
        </p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-600 italic text-center">
          Δεν υπάρχουν κρατήσεις με αυτά τα φίλτρα.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((res) =>
              (() => {
                const restaurant = allRestaurants.find(
                  (r) => r.id === res.restaurantId
                );
                return (
                  <ReservationCard
                    key={res.id}
                    reservation={res}
                    restaurantName={restaurant?.name || "Άγνωστο Εστιατόριο"}
                    restaurantPhoto={restaurant?.photos?.[0]}
                    restaurantCuisine={restaurant?.cuisine}
                    restaurantLocation={restaurant?.location}
                    showCancel={["pending", "confirmed"].includes(res.status)}
                    onCancel={(res) => {
                      setSelectedReservation(res);
                      setShowCancelDialog(true);
                    }}
                  />
                );
              })()
            )}
          </div>

          <ReservationPagination
            currentPage={currentPage}
            totalPages={Math.ceil(total / itemsPerPage)}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <CancelReservationDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        reservation={selectedReservation}
        onConfirm={handleCancel}
      />

      <ResultDialog
        open={resultDialogOpen}
        onClose={() => setResultDialogOpen(false)}
        message={resultMessage}
        variant="success"
      />
    </div>
  );
};

export default MyReservationsPage;
