import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";

const LoyaltyInfoButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all"
          onClick={() => setOpen(true)}
        >
          ℹ️ Τι είναι οι πόντοι;
        </Button>
      </div>

      {/* Modal Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-white rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              🎖️ Πώς λειτουργεί το Πρόγραμμα Επιβράβευσης;
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Όλα όσα πρέπει να γνωρίζεις για τους πόντους Yummy.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <ul className="text-gray-800 space-y-3 text-sm">
            <li>✅ <strong>10 πόντοι</strong> προστίθενται αυτόματα με κάθε κράτηση.</li>
            <li>🏷️ Οι πόντοι μπορούν να χρησιμοποιηθούν μόνο για <strong>αγορά κουπονιών</strong> από εστιατόρια.</li>
            <li>🍽️ Η αγορά γίνεται από τη <strong>σελίδα του κάθε εστιατορίου</strong>.</li>
            <li>💳 Το κουπόνι χρησιμοποιείται στην κράτηση αν έχεις επαρκείς πόντους.</li>
            <li>💡 Δεν χρειάζεται να κάνεις τίποτα για να πάρεις πόντους – καταχωρούνται αυτόματα!</li>
          </ul>

          <Separator className="my-4" />

          <Button
            onClick={() => setOpen(false)}
            className="w-full bg-gray-700 text-white hover:bg-gray-900"
          >
            Κλείσιμο
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoyaltyInfoButton;
