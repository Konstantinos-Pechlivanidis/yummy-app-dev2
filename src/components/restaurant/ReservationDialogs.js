import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

const ReservationDialogs = ({
  errorDialog,
  setErrorDialog,
  confirmSubmit,
  setConfirmSubmit,
  onConfirmReservation,
  isSubmitting,
}) => {
  return (
    <>
      {/* ❗ Error Dialog */}
      <Dialog open={errorDialog} onOpenChange={setErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>⚠️ Συμπλήρωσε όλα τα πεδία!</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            Πρέπει να επιλέξετε ημερομηνία, ώρα και αριθμό ατόμων για να
            προχωρήσετε στην κράτηση.
          </p>
          <Button
            className="w-full bg-red-500 text-white"
            onClick={() => setErrorDialog(false)}
          >
            Εντάξει
          </Button>
        </DialogContent>
      </Dialog>

      {/* ✅ Confirmation Dialog */}
      <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>✅ Επιβεβαίωση Κράτησης</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 mb-4">
            Είσαι σίγουρος/η ότι θέλεις να ολοκληρώσεις αυτή την κράτηση;
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setConfirmSubmit(false)}>
              ❌ Άκυρο
            </Button>
            <Button
              className="bg-green-600 text-white"
              onClick={onConfirmReservation}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Υποβολή..." : "✅ Επιβεβαιώνω"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReservationDialogs;
