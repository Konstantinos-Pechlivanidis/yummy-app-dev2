import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const CancelReservationDialog = ({ open, onClose, onConfirm, reservation }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) {
      setReason("");
      setError(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirm({ reservationId: reservation.id, reason: reason.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            ❌ Επιβεβαίωση Ακύρωσης
          </DialogTitle>
        </DialogHeader>

        <p className="text-gray-700 text-base">
          Είσαι σίγουρος ότι θέλεις να ακυρώσεις την κράτηση;
        </p>
        <p className="text-base sm:text-base text-gray-500">
          ⚠️ Εάν απομένουν λιγότερες από 2 ώρες, ενδέχεται να χάσεις προνόμια.
        </p>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">
            Λόγος ακύρωσης <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-base"
            rows={3}
            placeholder="Π.χ. Προέκυψε άλλο ραντεβού..."
          />
          {error && (
            <p className="text-red-500 text-base mt-1">
              Ο λόγος είναι υποχρεωτικός.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-base px-4 py-2"
          >
            Άκυρο
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="text-base px-4 py-2"
          >
            Επιβεβαίωση
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelReservationDialog;
