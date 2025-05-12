import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRestaurantsWithPurchasedCoupons } from "../../hooks/useDummyData";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import Loading from "../Loading";
import { Star } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const ITEMS_PER_PAGE = 6;

const PurchasedCouponRestaurantsSection = ({ userId }) => {
  const { data = [], isLoading } = useRestaurantsWithPurchasedCoupons(userId);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  return (
    <motion.section {...fadeIn} className="w-full">
      <Card className="bg-white shadow-lg rounded-2xl border border-gray-200">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            🎟️ Εστιατόρια με Αγορασμένα Κουπόνια
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <Loading />
          ) : data.length === 0 ? (
            <p className="text-gray-500 text-center py-6 text-sm sm:text-base">
              Δεν έχεις χρησιμοποιήσει κάποιο κουπόνι ακόμη.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {paginatedData.map((resto) => (
                  <Link to={`/restaurant/${resto.id}`} key={resto.id}>
                    <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all bg-white">
                      <img
                        src={resto.photos?.[0]}
                        alt={resto.name}
                        className="w-full h-40 sm:h-44 object-cover"
                      />
                      <div className="p-4 sm:p-5 space-y-3 text-sm sm:text-base text-gray-700">
                        <div className="flex justify-between items-center gap-2">
                          <h3 className="text-[1rem] sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                            {resto.name}
                          </h3>
                          <div className="flex items-center gap-1 text-red-600 text-xs sm:text-sm md:text-base">
                            <Star className="w-4 h-4" />
                            {resto.rating}
                          </div>
                        </div>
                        <p className="text-[12px] sm:text-sm md:text-base text-gray-600 font-medium leading-tight">
                          {resto.cuisine} – {resto.location}
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mt-2 space-y-1">
                          <div className="bg-blue-600 text-white rounded-full px-3 py-1 w-fit text-xs sm:text-sm font-semibold shadow-sm">
                            🎁 Κουπόνι Αγοράστηκε
                          </div>
                          <p className="text-blue-900 font-medium text-sm sm:text-base">
                            {resto.coupon?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <Pagination>
                    <PaginationContent className="flex items-center gap-4">
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
            </>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default PurchasedCouponRestaurantsSection;
