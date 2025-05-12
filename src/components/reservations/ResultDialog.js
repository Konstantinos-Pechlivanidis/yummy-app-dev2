import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

const iconMap = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
};

const ResultDialog = ({ open, onClose, message, variant = "info" }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            {iconMap[variant]} Ενημέρωση
          </DialogTitle>
        </DialogHeader>

        <p className="text-gray-700 mt-2">{message}</p>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>ΟΚ</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
