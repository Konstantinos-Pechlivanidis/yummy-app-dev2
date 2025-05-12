import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const ReservationFilterBar = ({ onFilterChange }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    onFilterChange({
      date: selectedDate || null,
      status: selectedStatus === "all" ? null : selectedStatus,
    });
  }, [selectedDate, selectedStatus]);

  const clearFilters = () => {
    setSelectedDate("");
    setSelectedStatus("all");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-8">
      {/* Date Picker */}
      <div className="flex flex-col flex-1 min-w-[240px]">
        <label className="text-base font-medium text-gray-700 mb-1">
          📆 Ημερομηνία
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal text-base py-2"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(new Date(selectedDate), "dd/MM/yyyy")
              ) : (
                <span className="text-gray-400">Επιλογή ημερομηνίας</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 mt-2">
            <Calendar
              mode="single"
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={(date) =>
                setSelectedDate(date ? format(date, "yyyy-MM-dd") : "")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Status Select */}
      <div className="flex flex-col flex-1 min-w-[240px]">
        <label className="text-base font-medium text-gray-700 mb-1">
          📂 Κατάσταση
        </label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full text-base py-2">
            <SelectValue placeholder="Κατάσταση" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📋 Όλες</SelectItem>
            <SelectItem value="pending">⏳ Εκκρεμείς</SelectItem>
            <SelectItem value="approved">✅ Επιβεβαιωμένες</SelectItem>
            <SelectItem value="completed">📁 Ολοκληρωμένες</SelectItem>
            <SelectItem value="cancelled">❌ Ακυρωμένες</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      <div className="flex items-end flex-1 min-w-[240px]">
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="w-full text-base"
        >
          Καθαρισμός Φίλτρων
        </Button>
      </div>
    </div>
  );
};

export default ReservationFilterBar;
