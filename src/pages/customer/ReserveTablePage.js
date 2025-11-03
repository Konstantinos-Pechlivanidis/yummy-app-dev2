import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useFilteredRestaurants } from "../../hooks/customer/useRestaurants";
import { setSearchParams as setSearchParamsAction } from "../../store/searchSlice";

import ReserveHeroSection from "../../components/reserve/ReserveHeroSection";
import SearchBar from "../../components/SearchBar";
import ReserveResultsGrid from "../../components/reserve/ReserveResultsGrid";
import PaginationControls from "../../components/reserve/PaginationControls";
import Loading from "../../components/Loading";
import SEOHelmet from "../../components/SEOHelmet";
import { fadeIn } from "../../constants/animations";

const ReserveTablePage = () => {
  const searchParams = useSelector((state) => state.search ?? {});
  const dispatch = useDispatch();

  const hasSearch = Object.values(searchParams).some(
    (val) => val !== "" && val !== 1
  );

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

  const {
    data: { restaurants = [] } = {},
    isLoading,
    isError,
  } = useFilteredRestaurants(hasSearch ? searchParams : {});

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

  const handleSearch = () => {
    dispatch(setSearchParamsAction(filters));
    setCurrentPage(1);
  };

  return (
    <>
      <SEOHelmet
        title="Κράτηση Τραπεζιού | Yummy App"
        description="Ανακάλυψε διαθέσιμα εστιατόρια με βάση τα φίλτρα σου και κάνε κράτηση online με Happy Hour εκπτώσεις και κουπόνια ανταμοιβής!"
        url="https://yummy-app.gr/reserve"
        image="https://yummy-app.gr/images/yummyLogo-2.png"
      />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-8 space-y-16">
        <ReserveHeroSection />

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
              ⚠️ Προέκυψε σφάλμα κατά την ανάκτηση των δεδομένων. Δοκιμάστε
              ξανά.
            </p>
          ) : restaurants.length === 0 ? (
            <p className="text-center text-gray-600">
              ❌ Δεν βρέθηκαν εστιατόρια με αυτά τα φίλτρα.
            </p>
          ) : (
            <>
              <ReserveResultsGrid restaurants={visibleRestaurants} />
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </motion.section>
      </div>
    </>
  );
};

export default ReserveTablePage;
