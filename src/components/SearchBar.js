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
    <div className="mt-10 p-6 bg-white shadow-lg rounded-xl flex flex-col lg:flex-row flex-wrap gap-6">
      {/* Ημερομηνία */}
      <div className="flex flex-col flex-1 min-w-[200px]">
        <label className="mb-1 text-sm font-medium text-gray-700">
          Ημερομηνία
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full bg-white text-black border border-gray-300 justify-between"
            >
              {isValid(searchParams.date)
                ? format(searchParams.date, "dd/MM/yyyy")
                : "Επιλέξτε"}
              <CalendarIcon className="ml-2 h-5 w-5 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="bg-white shadow-md p-3 rounded-lg"
          >
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

      {/* Ώρα */}
      <div className="flex flex-col flex-1 min-w-[200px]">
        <label className="mb-1 text-sm font-medium text-gray-700">Ώρα</label>
        <Select
          value={searchParams.time}
          onValueChange={(value) =>
            setSearchParams({ ...searchParams, time: value })
          }
        >
          <SelectTrigger className="w-full border border-gray-300 bg-white text-black justify-between">
            <SelectValue placeholder="Ώρα" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-md p-2 rounded-lg">
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Άτομα */}
      <div className="flex flex-col flex-1 min-w-[200px]">
        <label className="mb-1 text-sm font-medium text-gray-700">Άτομα</label>
        <Input
          type="number"
          min="1"
          inputMode="numeric"
          pattern="[0-9]*"
          value={searchParams.guests}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          onChange={(e) => {
            const raw = e.target.value;
            const parsed = parseInt(raw, 10);
            const value = isNaN(parsed) || parsed < 1 ? "" : parsed;
            setSearchParams({ ...searchParams, guests: value });
          }}
          onBlur={() => {
            if (!searchParams.guests || searchParams.guests < 1) {
              setSearchParams({ ...searchParams, guests: 1 });
            }
          }}
        />
      </div>

      {/* Τοποθεσία */}
      <div className="flex flex-col flex-1 min-w-[200px]">
        <label className="mb-1 text-sm font-medium text-gray-700">
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
          <SelectTrigger className="w-full border border-gray-300 bg-white text-black justify-between">
            <SelectValue placeholder="Όλες οι περιοχές" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-md p-2 rounded-lg">
            <SelectItem value="all">Όλες οι περιοχές</SelectItem>
            {athensLocations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Κουζίνα */}
      <div className="flex flex-col flex-1 min-w-[200px]">
        <label className="mb-1 text-sm font-medium text-gray-700">
          Κουζίνα
        </label>
        <Select
          value={searchParams.cuisine || "all"}
          onValueChange={(value) =>
            setSearchParams({
              ...searchParams,
              cuisine: value === "all" ? "" : value,
            })
          }
        >
          <SelectTrigger className="w-full border border-gray-300 bg-white text-black justify-between">
            <SelectValue placeholder="Όλες οι κουζίνες" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-md p-2 rounded-lg">
            <SelectItem value="all">Όλες οι κουζίνες</SelectItem>
            {cuisineOptions.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col lg:flex-row items-center justify-end gap-3 w-full mt-4 lg:mt-0">
        <Button
          onClick={onSearch}
          className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg text-lg"
        >
          🔍 Αναζήτηση
        </Button>
        <Button
          variant="ghost"
          className="w-full sm:w-auto text-gray-500 underline"
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
