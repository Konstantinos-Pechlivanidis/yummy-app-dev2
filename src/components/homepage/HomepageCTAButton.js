import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";

const HomepageCTAButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all"
          onClick={() => setOpen(true)}
        >
          ℹ️ Πληροφορίες Σελίδας
        </Button>
      </div>

      {/* Pop-up Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-white rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">📢 Τι περιέχει η σελίδα Yummy;</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Ανακάλυψε πώς να χρησιμοποιήσεις τη σελίδα και που οδηγεί το κάθε link.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <ul className="text-gray-800 space-y-3">
            <li>📌 <strong>Αρχική Σελίδα:</strong> Γενική περιγραφή και αναζήτηση εστιατορίων.</li>
            <li>🔥 <strong>Δυναμικές Εκπτώσεις:</strong> Προσφορές Happy Hour και ειδικές εκπτώσεις.</li>
            <li>🌟 <strong>Δημοφιλή Εστιατόρια:</strong> Τα κορυφαία εστιατόρια με τις καλύτερες κριτικές.</li>
            <li>🎖️ <strong>Πρόγραμμα Επιβράβευσης:</strong> Συλλογή πόντων και ανταμοιβές.</li>
            <li>📅 <strong>Κρατήσεις:</strong> Πώς να κλείσεις τραπέζι εύκολα και γρήγορα.</li>
          </ul>

          <Separator className="my-4" />

          <Button onClick={() => setOpen(false)} className="w-full bg-gray-700 text-white hover:bg-gray-900">
            Κλείσιμο
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomepageCTAButton;
