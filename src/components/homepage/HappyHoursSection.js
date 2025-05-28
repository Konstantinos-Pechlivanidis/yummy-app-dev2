import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import {
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Card, CardContent } from "../ui/card";
import Loading from "../Loading";
import PromoOfferBox from "./PromoOfferBox";
import { useDiscountedRestaurants } from "../../hooks/useRestaurants";
import { useScreenConfig } from "../../hooks/useScreenConfig";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const HappyHoursSection = () => {
  const { itemsPerPage } = useScreenConfig();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: { allDiscountedRestaurants: discountedMenus = [], Pagination } = {},
    isLoading: discountedLoading,
  } = useDiscountedRestaurants(currentPage, itemsPerPage);

  const totalPages = Math.ceil((Pagination?.total || 0) / itemsPerPage);

  const dayTranslations = {
    Monday: "Δευτέρα",
    Tuesday: "Τρίτη",
    Wednesday: "Τετάρτη",
    Thursday: "Πέμπτη",
    Friday: "Παρασκευή",
    Saturday: "Σάββατο",
    Sunday: "Κυριακή",
  };

  return (
    <motion.section {...fadeIn} className="px-4 sm:px-6 md:px-10 py-8 sm:py-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8">
        🔥 Δυναμικές Εκπτώσεις
      </h2>

      {discountedLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {discountedMenus.map((menu) => {
            const resto = menu.restaurant;
            if (!resto) return null;

            return (
              <Link to={`/restaurant/${resto.id}`} key={menu.id}>
                <Card className="h-[600px] flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                  {menu.photo_url ? (
                    <img
                      src={menu.photo_url}
                      alt={menu.name}
                      className="w-full h-40 sm:h-44 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-44 bg-gray-50 flex items-center justify-center">
                      <img
                        src="/images/yummyLogo-2.png"
                        alt="Yummy Logo"
                        className="h-12 sm:h-14 object-contain opacity-60"
                      />
                    </div>
                  )}

                  <CardContent className="flex-1 p-4 sm:p-5 flex flex-col justify-between text-sm sm:text-base text-gray-700">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center gap-2">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                          {resto.name}
                        </h3>
                        <div className="flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                          <Star className="w-4 h-4" />
                          {resto.rating}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 font-medium leading-tight truncate">
                        {resto.cuisine} – {resto.location}
                      </p>

                      <PromoOfferBox
                        menu={menu}
                        dayTranslations={dayTranslations}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination>
            <PaginationContent className="flex items-center gap-4">
              <PaginationItem>
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  <PaginationPrevious />
                </Button>
              </PaginationItem>
              <span className="text-gray-700 text-sm sm:text-base">
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
  );
};

export default HappyHoursSection;
