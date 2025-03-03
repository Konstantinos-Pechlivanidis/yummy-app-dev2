import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "../components/ui/carousel";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Star } from "lucide-react";
import { restaurants } from "../data/dummyData";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import HomepageCTAButton from "../components/HomepageCTAButton";
import { Link } from "react-router-dom";
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
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";


// Υπολογίζουμε πόσες κάρτες εμφανίζονται ανάλογα με το μέγεθος οθόνης
const getItemsPerPage = () => {
  if (window.innerWidth < 640) return 3; // Για κινητά
  return 6; // Για tablets και desktops
};

const getCarouselWidth = () => {
  if (window.innerWidth < 640) return "w-full"; // Mobile (1 item ανά σειρά)
  if (window.innerWidth < 1024) return "w-[50%]"; // Tablet (2 items ανά σειρά)
  return "w-[25%]"; // Desktop (4 items ανά σειρά)
};

// Responsive carousel items
const getCarouselItems = () => {
  if (window.innerWidth < 640) return 3; // Mobile
  return 6; // Desktop
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

const HomePage = () => {
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
  const widthPercentage = getCarouselWidth();
  const [searchParams, setSearchParams] = useState({
    date: "",
    time: "",
    guests: 1,
    location: "",
    cuisine: "",
  });

  const [itemsPerSlide, setItemsPerSlide] = useState(getCarouselItems());

  // Προσαρμογή των items όταν αλλάζει το μέγεθος της οθόνης
  window.addEventListener("resize", () => setItemsPerSlide(getCarouselItems()));

  const trendingRestaurants = restaurants.slice(0, 5); // Mock trending data
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleSearch = () => {
    navigate("/reserve", { state: searchParams });
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Προσαρμογή αριθμού κάρτων όταν αλλάζει το μέγεθος οθόνης
  window.addEventListener("resize", () => setItemsPerPage(getItemsPerPage()));

  const [currentPage, setCurrentPage] = useState(1);

  // Φιλτράρουμε μόνο τα εστιατόρια που έχουν Happy Hour
  const discountedRestaurants = restaurants.filter(
    (resto) => resto.happyHours.length > 0
  );
  const totalPages = Math.ceil(discountedRestaurants.length / itemsPerPage);

  // Υπολογίζουμε τα εστιατόρια που εμφανίζονται στην τρέχουσα σελίδα
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleRestaurants = discountedRestaurants.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const timeSlots = [];
  for (let h = 10; h < 24; h++) {
    timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
  }

  return (
    <div className="container mx-auto px-6 rounded-3xl">
       {/* ✅ Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center text-center bg-cover bg-center rounded-3xl shadow-lg overflow-hidden"
        style={{ backgroundImage: "url('/images/wide3.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>

        <div className="relative z-10 px-6 text-white">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg">
            Κλείσε Τραπέζι σε Δευτερόλεπτα! 🍽️
          </h1>
          <p className="text-lg sm:text-xl mt-4 drop-shadow-md">
            Ανακάλυψε τις καλύτερες γεύσεις με αποκλειστικές προσφορές.
          </p>
        </div>
      </section>

      {/* ✅ Επαγγελματικό & Responsive Filter Section */}
      <div className="mt-10 p-6 bg-white shadow-lg rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Date Picker */}
        <div className="w-full sm:w-auto flex flex-col items-start">
          <label className="text-l font-medium text-gray-700 mb-1">Ημερομηνία</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-40 bg-white text-black flex justify-between border border-gray-300">
                {isValid(searchParams.date) ? format(searchParams.date, "dd/MM/yyyy") : "Επιλέξτε"}
                <CalendarIcon className="ml-2 h-5 w-5 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="bg-white shadow-md p-3 rounded-lg">
              <Calendar
                mode="single"
                selected={searchParams.date}
                onSelect={(date) => setSearchParams({ ...searchParams, date: date || new Date() })}
                disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <div className="w-full sm:w-auto flex flex-col items-start">
          <label className="text-l font-medium text-gray-700 mb-1">Ώρα</label>
          <Select value={searchParams.time} onValueChange={(value) => setSearchParams({ ...searchParams, time: value })}>
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

        {/* Guests */}
        <div className="w-full sm:w-auto flex flex-col items-start">
          <label className="text-l font-medium text-gray-700 mb-1">Άτομα</label>
          <Input
            type="number"
            min="1"
            className="w-full sm:w-20 border border-gray-300 rounded-lg px-3 py-2"
            value={searchParams.guests}
            onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
          />
        </div>

        {/* Location Filter */}
        <div className="w-full sm:w-auto flex flex-col items-start">
          <label className="text-l font-medium text-gray-700 mb-1">
            Τοποθεσία
          </label>
          <Select
            value={"all"}
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
            value={"all"}
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
        <Button onClick={handleSearch} className="bg-primary text-white w-full sm:w-auto px-6 py-3 rounded-lg text-lg">
          🔍 Αναζήτηση
        </Button>
      </div>

      <Separator className="my-10" />

      {/* Why Yummy? Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🎉 Γιατί να επιλέξεις το Yummy;
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-all hover:scale-105">
            <h3 className="text-xl font-semibold">🚀 Ταχύτατες Κρατήσεις</h3>
            <p className="text-gray-600 mt-2">
              Κλείσε τραπέζι μέσα σε λίγα δευτερόλεπτα χωρίς τηλεφωνήματα!
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-all hover:scale-105">
            <h3 className="text-xl font-semibold">
              🎯 Προσφορές & Happy Hours
            </h3>
            <p className="text-gray-600 mt-2">
              Εκπτώσεις έως 50% σε επιλεγμένα εστιατόρια!
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-all hover:scale-105">
            <h3 className="text-xl font-semibold">⭐ Κριτικές Πελατών</h3>
            <p className="text-gray-600 mt-2">
              Διάβασε πραγματικές εμπειρίες και επέλεξε το καλύτερο εστιατόριο!
            </p>
          </div>
        </div>
      </section>

      <Separator className="my-10" />

      {/* Customer Testimonials */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          💬 Τι λένε οι χρήστες μας;
        </h2>
        <Carousel className="w-full overflow-hidden">
          <CarouselContent
            className={`flex flex-nowrap gap-4 ${widthPercentage}`}
          >
            {[
              "Καταπληκτική εμπειρία!",
              "Γρήγορες κρατήσεις!",
              "Εξαιρετικές προσφορές!",
            ].map((review, index) => (
              <CarouselItem key={index} className="w-[33%]">
                <Card className="shadow-md p-6 text-gray-700">
                  <p className="italic">"{review}"</p>
                  <p className="font-bold text-gray-900 mt-2">
                    - Χρήστης {index + 1}
                  </p>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <Separator className="my-10" />

      {/* Trending Restaurants */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          🌟 Δημοφιλή Εστιατόρια
        </h2>

        <Carousel className="w-full overflow-hidden">
          <CarouselContent
            className={`flex flex-nowrap gap-4 ${widthPercentage}`}
          >
            {restaurants.map((resto) => (
              <CarouselItem key={resto.id}>
                <Link to={`/restaurant/${resto.id}`}>
                  <Card className="shadow-md">
                    <CardContent className="p-4">
                      <img
                        src={resto.photos[0]}
                        alt={resto.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <h3 className="mt-4 text-lg font-bold">{resto.name}</h3>
                      <p className="text-gray-600">{resto.cuisine}</p>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <Separator className="my-10" />

      {/* Dynamic Discount System */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          🔥 Δυναμικές Εκπτώσεις
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {visibleRestaurants.map((resto) => (
            <Link to={`/restaurant/${resto.id}`}>
              <Card
                key={resto.id}
                className="hover:shadow-lg transition-shadow p-4"
              >
                {/* Κεντρική εικόνα */}
                <img
                  src={resto.photos[0]}
                  alt={resto.name}
                  className="w-full h-40 object-cover rounded-lg"
                />

                <CardHeader className="mt-4">
                  <CardTitle className="text-lg font-semibold">
                    {resto.name}
                  </CardTitle>

                  {/* Cuisine & Rating */}
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

                  {/* Happy Hour Section */}
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

        {/* Εμφανίζουμε Pagination μόνο αν υπάρχουν περισσότερα από 3 εστιατόρια σε κινητά */}
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

      <Separator className="my-10" />

      {/* Membership & Loyalty */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          🎖️ Πρόγραμμα Επιβράβευσης
        </h2>
        <Card className="p-6 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-center">
          <h3 className="text-2xl font-bold">
            Γίνε VIP Μέλος & Κέρδισε Δωρεάν Γεύματα
          </h3>
          <p className="mt-4">
            Κάθε κράτηση σου δίνει πόντους! Κέρδισε δωρεάν γεύματα και ειδικές
            προσφορές.
          </p>
          <Button
            className="mt-6 bg-white text-primary hover:bg-primary hover:text-white transition-all"
            onClick={() => handleNavigate("/loyalty")}
          >
            Μάθε Περισσότερα
          </Button>
        </Card>
      </section>

      <Separator className="my-10" />

      {/* Group & Corporate Deals */}
      <section className="mb-5">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          🏢 Ομαδικές & Εταιρικές Κρατήσεις
        </h2>
        <Card className="p-6 bg-gray-100 text-center">
          <h3 className="text-xl font-bold">
            Ειδικές Προσφορές για Μεγάλες Παρέες!
          </h3>
          <p className="mt-4">
            Κάνε κράτηση για 5+ άτομα και κέρδισε αποκλειστικές εκπτώσεις.
          </p>
          <Button
            className="mt-4 bg-primary text-white"
            onClick={() => handleNavigate("/group-booking")}
          >
            Δες τις Προσφορές
          </Button>
        </Card>
      </section>

      {/* Floating CTA Button */}
      {/* <div className="fixed bottom-6 right-6 z-50">
        <Button className="bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all">
          📞 Κλείσε Τραπέζι Τώρα
        </Button>
      </div> */}
      <HomepageCTAButton />
    </div>
  );
};

export default HomePage;
