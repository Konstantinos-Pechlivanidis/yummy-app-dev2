import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
import { Link } from "react-router-dom";
import { useFilteredRestaurants } from "../hooks/useDummyData";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";
import { setSearchParams as setSearchParamsAction } from "../store/searchSlice";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const ReserveTablePage = () => {
  const searchParams = useSelector((state) => state.search ?? {});
  const hasSearch = Object.values(searchParams).some(
    (val) => val !== "" && val !== 1
  );

  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(setSearchParamsAction(filters));
  };

  const initialFilters = {
    name: "",
    date: searchParams.date || "",
    time: searchParams.time || "",
    guests: searchParams.guests || "",
    location: searchParams.location || "",
    cuisine: searchParams.cuisine || "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const {
    data: restaurants = [],
    isLoading,
    isError,
  } = useFilteredRestaurants(
    hasMounted ? (hasSearch ? searchParams : {}) : null
  );

  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const visibleRestaurants = restaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const timeSlots = [];
  for (let h = 10; h < 24; h++) {
    timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-8 space-y-16">
      
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-center rounded-3xl overflow-hidden shadow-xl">
        <img
          src="/images/wide4.jpg"
          alt="hero"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
        <motion.div {...fadeIn} className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-xl">
            🍽️ Βρες το Ιδανικό Εστιατόριο
          </h1>
          <p className="text-xl mt-4 drop-shadow-md">
            Φιλτράρισε και βρες το τέλειο μέρος για την κράτησή σου!
          </p>
        </motion.div>
      </section>

      <SearchBar
        searchParams={filters}
        setSearchParams={setFilters}
        timeSlots={timeSlots}
        onSearch={handleSearch}
      />

      <motion.section {...fadeIn}>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          📍 Αποτελέσματα Αναζήτησης
        </h2>

        {isLoading ? (
          <Loading />
        ) : isError ? (
          <p className="text-center text-red-600">
            ⚠️ Προέκυψε σφάλμα κατά την ανάκτηση των δεδομένων. Δοκιμάστε ξανά.
          </p>
        ) : restaurants.length === 0 ? (
          <p className="text-center text-gray-600">
            ❌ Δεν βρέθηκαν εστιατόρια με αυτά τα φίλτρα.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visibleRestaurants.map((resto) => (
              <Link to={`/restaurant/${resto.id}`} key={resto.id}>
                <Card className="hover:shadow-2xl transition-transform hover:scale-[1.02] p-4 rounded-2xl">
                  <img
                    src={resto.photos[0]}
                    alt={resto.name}
                    className="w-full h-40 object-cover rounded-xl"
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

        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
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
      </motion.section>
    </div>
  );
};

export default ReserveTablePage;
