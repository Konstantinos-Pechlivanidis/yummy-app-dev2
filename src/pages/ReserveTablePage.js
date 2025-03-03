import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { restaurants } from "../data/dummyData";
import { Badge } from "../components/ui/badge";
import { Star } from "lucide-react";
import { Separator } from "../components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
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
import { CalendarIcon, Clock } from "lucide-react";
import { format, isValid } from "date-fns";
import { Link } from "react-router-dom";

const ReserveTablePage = () => {
  const location = useLocation();
  const initialFilters = location.state || {
    name: "",
    date: "",
    time: "",
    guests: "",
    location: "",
    cuisine: "",
  };

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

  const [filters, setFilters] = useState(initialFilters);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // **Filtering Function**
  const handleFilter = () => {
    let filtered = restaurants.filter((resto) => {
      // 1️⃣ Φιλτράρισμα βάσει ονόματος, τοποθεσίας & κουζίνας
      const matchesName =
        !filters.name ||
        resto.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesLocation =
        !filters.location ||
        resto.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCuisine =
        !filters.cuisine ||
        resto.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase());

      // 2️⃣ Έλεγχος αν η ώρα κράτησης είναι εντός ωραρίου λειτουργίας του εστιατορίου
      let matchesTime = true;
      if (filters.time) {
        const [hour, minute] = filters.time.split(":").map(Number);
        const openingHour = parseInt(resto.openingHours.open.split(":")[0], 10);
        const closingHour = parseInt(
          resto.openingHours.close.split(":")[0],
          10
        );
        matchesTime = hour >= openingHour && hour < closingHour;
      }

      // 3️⃣ Έλεγχος αν το εστιατόριο έχει διαθέσιμα τραπέζια για τους επισκέπτες
      let matchesGuests = true;
      if (filters.guests) {
        matchesGuests = resto.totalTables >= filters.guests;
      }

      return (
        matchesName &&
        matchesLocation &&
        matchesCuisine &&
        matchesTime &&
        matchesGuests
      );
    });

    setFilteredRestaurants(filtered);
    setCurrentPage(1); // Reset σελίδας
  };

  // **Pagination Logic**
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const visibleRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const timeSlots = [];
  for (let h = 10; h < 24; h++) {
    timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <section
        className="relative w-full h-[300px] flex items-center justify-center text-center bg-cover bg-center rounded-3xl shadow-lg overflow-hidden"
        style={{ backgroundImage: "url('/images/wide4.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative z-10 px-6 text-white">
          <h1 className="text-3xl sm:text-5xl font-bold drop-shadow-lg">
            🍽️ Βρες το Ιδανικό Εστιατόριο
          </h1>
          <p className="text-lg mt-4 drop-shadow-md">
            Φιλτράρισε και βρες το τέλειο μέρος για την κράτησή σου!
          </p>
        </div>
      </section>

      <Separator className="my-10" />

      {/* ✅ Επαγγελματικό & Responsive Filter Section */}
      <div className="p-6 bg-white shadow-lg rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Name Filter */}
        <div className="w-full sm:w-auto flex flex-col items-start">
          <label className="text-l font-medium text-gray-700 mb-1">
            Όνομα Εστιατορίου
          </label>
          <Input
            type="text"
            className="w-full sm:w-40 border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Π.χ. La Pasteria"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>
        {/* Calendar Picker */}
        <div className="w-full sm:w-auto flex flex-col items-start">
          <label className="text-l font-medium text-gray-700 mb-1">
            Ημερομηνία
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-40 bg-white text-black flex justify-between border border-gray-300"
              >
                {isValid(filters.date)
                  ? format(filters.date, "dd/MM/yyyy")
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
                selected={filters.date}
                onSelect={(date) =>
                  setFilters({ ...filters, date: date || new Date() })
                }
                disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* Time Picker */}
        <div className="w-full sm:w-auto flex flex-col items-start">
          <label className="text-l font-medium text-gray-700 mb-1">Ώρα</label>
          <Select
            value={filters.time}
            onValueChange={(value) => setFilters({ ...filters, time: value })}
          >
            <SelectTrigger className="w-full sm:w-32 bg-white text-black flex justify-between border border-gray-300">
              <SelectValue placeholder="Ώρα" />
              {/* <Clock className="ml-2 h-5 w-5 text-gray-500" /> */}
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md p-2 rounded-lg">
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time} className="py-2">
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Location Filter */}
        <div className="w-full sm:w-auto flex flex-col items-start">
          <label className="text-l font-medium text-gray-700 mb-1">
            Τοποθεσία
          </label>
          <Select
            value={filters.location || "all"}
            onValueChange={(value) =>
              setFilters({ ...filters, location: value === "all" ? "" : value })
            }
          >
            <SelectTrigger className="w-full sm:w-40 bg-white text-black flex justify-between border border-gray-300">
              <SelectValue placeholder="Όλες οι περιοχές" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md p-2 rounded-lg">
              <SelectItem value="all">Όλες οι περιοχές</SelectItem>
              {athensLocations.map((location) => (
                <SelectItem key={location} value={location} className="py-2">
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto flex flex-col items-start">
          <label className="text-l font-medium text-gray-700 mb-1">
            Κουζίνα
          </label>
          <Select
            value={filters.cuisine || "all"}
            onValueChange={(value) =>
              setFilters({ ...filters, cuisine: value === "all" ? "" : value })
            }
          >
            <SelectTrigger className="w-full sm:w-40 bg-white text-black flex justify-between border border-gray-300">
              <SelectValue placeholder="Όλες οι κουζίνες" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md p-2 rounded-lg">
              <SelectItem value="all">Όλες οι κουζίνες</SelectItem>
              {cuisineOptions.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine} className="py-2">
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleFilter}
          className="bg-primary text-white w-full sm:w-auto px-6 py-3 rounded-lg text-lg"
        >
          🔍 Φιλτράρισμα
        </Button>
      </div>

      <Separator className="my-10" />

      {/* Λίστα Εστιατορίων */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          📍 Αποτελέσματα Αναζήτησης
        </h2>

        {filteredRestaurants.length === 0 ? (
          <p className="text-center text-gray-600">
            ❌ Δεν βρέθηκαν εστιατόρια με αυτά τα φίλτρα.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visibleRestaurants.map((resto) => (
              <Link to={`/restaurant/${resto.id}`}>
                <Card
                  key={resto.id}
                  className="hover:shadow-lg transition-shadow p-4"
                >
                  <img
                    src={resto.photos[0]}
                    alt={resto.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />

                  <CardHeader className="mt-4">
                    <CardTitle className="text-lg font-semibold">
                      {resto.name}
                    </CardTitle>
                    <div className="flex justify-between items-center mt-1 text-sm text-gray-600">
                      <p>{resto.cuisine}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{resto.rating}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600">{resto.location}</p>
                    {resto.happyHours.length > 0 && (
                      <div className="mt-3 p-3 bg-red-100 rounded-md">
                        <Badge className="bg-red-500 text-white">
                          Happy Hour: -{resto.happyHours[0].discountPercentage}%
                        </Badge>
                        <p className="text-sm text-gray-700 mt-1">
                          🕒 {resto.happyHours[0].startTime} -{" "}
                          {resto.happyHours[0].endTime}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    <PaginationPrevious />
                  </Button>
                </PaginationItem>

                <span className="px-4 py-2 text-gray-700">
                  Σελίδα {currentPage} από {totalPages}
                </span>

                <PaginationItem>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    <PaginationNext />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
    </div>
  );
};

export default ReserveTablePage;
