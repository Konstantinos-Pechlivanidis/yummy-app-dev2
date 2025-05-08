import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { CalendarIcon } from "lucide-react";
import { isValid, format } from "date-fns";

const SearchBar = ({ searchParams, setSearchParams, timeSlots, onSearch }) => {
  const cuisineOptions = [
    "Ιταλικό",
    "Ιαπωνικό",
    "Μεσογειακό",
    "Αμερικάνικο",
    "Μεξικάνικο",
    "Vegan",
    "Καφέ & Γλυκά",
    "Κινέζικο",
    "Γαλλικό",
    "Ελληνικό",
    "Ινδικό",
    "Θαλασσινά",
    "Πολυνησιακό",
    "Ασιατικό",
    "Street Food",
    "Μπάρμπεκιου",
  ];

  const athensLocations = [
    "Σύνταγμα",
    "Γλυφάδα",
    "Κολωνάκι",
    "Μοναστηράκι",
    "Ψυρρή",
    "Θησείο",
    "Πλάκα",
    "Παγκράτι",
    "Κηφισιά",
    "Χαλάνδρι",
    "Νέα Σμύρνη",
    "Μεταξουργείο",
    "Πετράλωνα",
    "Γκάζι",
    "Πειραιάς",
    "Φάληρο",
    "Νέο Ψυχικό",
    "Βουλιαγμένη",
  ];

  return (
    <div className="mt-10 p-8 bg-white/50 backdrop-blur-md border border-gray-200 shadow-2xl rounded-3xl transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Date Picker */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Ημερομηνία
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-white/80 border border-gray-300 text-gray-800 hover:border-primary"
              >
                {isValid(searchParams.date)
                  ? format(searchParams.date, "dd/MM/yyyy")
                  : "Επιλέξτε"}
                <CalendarIcon className="ml-2 h-4 w-4 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-white p-3 rounded-xl shadow-xl">
              <Calendar
                mode="single"
                selected={searchParams.date}
                onSelect={(date) =>
                  setSearchParams({ ...searchParams, date: date || new Date() })
                }
                disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Ώρα</label>
          <Select
            value={searchParams.time}
            onValueChange={(value) =>
              setSearchParams({ ...searchParams, time: value })
            }
          >
            <SelectTrigger className="w-full bg-white/80 border border-gray-300 text-gray-800">
              <SelectValue placeholder="Ώρα" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-xl rounded-lg p-2">
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Guests */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Άτομα</label>
          <Input
            type="number"
            min="1"
            value={searchParams.guests}
            inputMode="numeric"
            className="w-full bg-white/80 border border-gray-300 text-gray-800"
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setSearchParams({
                ...searchParams,
                guests: isNaN(val) ? "" : val,
              });
            }}
            onBlur={() => {
              if (!searchParams.guests || searchParams.guests < 1) {
                setSearchParams({ ...searchParams, guests: 1 });
              }
            }}
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Τοποθεσία
          </label>
          <Select
            value={searchParams.location || "all"}
            onValueChange={(value) =>
              setSearchParams({
                ...searchParams,
                location: value === "all" ? "" : value,
              })
            }
          >
            <SelectTrigger className="w-full bg-white/80 border border-gray-300 text-gray-800">
              <SelectValue placeholder="Όλες οι περιοχές" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-xl rounded-lg p-2">
              <SelectItem value="all">Όλες οι περιοχές</SelectItem>
              {athensLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cuisine */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Κουζίνα</label>
          <Select
            value={searchParams.cuisine || "all"}
            onValueChange={(value) =>
              setSearchParams({
                ...searchParams,
                cuisine: value === "all" ? "" : value,
              })
            }
          >
            <SelectTrigger className="w-full bg-white/80 border border-gray-300 text-gray-800">
              <SelectValue placeholder="Όλες οι κουζίνες" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-xl rounded-lg p-2">
              <SelectItem value="all">Όλες οι κουζίνες</SelectItem>
              {cuisineOptions.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine}>
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-6">
        <Button
          onClick={onSearch}
          className="bg-primary text-white text-base px-6 py-3 rounded-full shadow hover:scale-[1.02] transition"
        >
          🔍 Αναζήτηση
        </Button>
        <Button
          variant="ghost"
          className="text-gray-600 underline text-sm"
          onClick={() =>
            setSearchParams({
              date: "",
              time: "",
              guests: 1,
              location: "",
              cuisine: "",
            })
          }
        >
          Επαναφορά
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
