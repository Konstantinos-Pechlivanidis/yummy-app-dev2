import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { HelpCircle } from "lucide-react";

const HelpDialogButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center shadow-lg bg-white border rounded-full p-3"
          >
            <HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
            Οδηγίες Χρήσης
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ℹ️ Οδηγίες Χρήσης</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-gray-800 text-sm">
            <p>
              📅 <strong>Κράτηση:</strong> Επιλέξτε ημερομηνία, ώρα και αριθμό
              ατόμων και πατήστε "✅ Επιβεβαίωση Κράτησης".
            </p>
            <p>
              🎟️ <strong>Κουπόνια:</strong> Αν έχετε loyalty points, μπορείτε να
              τα εξαργυρώσετε για εκπτώσεις.
            </p>
            <p>
              🍽️ <strong>Special Menus:</strong> Κάποια εστιατόρια προσφέρουν
              προκαθορισμένα μενού με εκπτώσεις.
            </p>
            <p>
              ⏳ <strong>Happy Hours:</strong> Οι εκπτώσεις ισχύουν μόνο σε
              συγκεκριμένες ώρες και μόνο για τη σημερινή ημερομηνία.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpDialogButton;
