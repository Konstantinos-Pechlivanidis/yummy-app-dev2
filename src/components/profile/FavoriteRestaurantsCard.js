import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Star, Trash2 } from "lucide-react";
import Loading from "../Loading";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const ITEMS_PER_PAGE = 6;

const FavoriteRestaurantsCard = ({
  favorites = [],
  isLoading,
  onConfirmRemove,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = favorites.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);

  return (
    <motion.section {...fadeIn} className="w-full">
      <Card className="bg-white shadow-lg rounded-2xl border border-gray-200">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            ❤️ Αγαπημένα Εστιατόρια
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <Loading />
          ) : paginatedData.length === 0 ? (
            <p className="text-gray-500 text-center py-6 text-sm sm:text-base">
              Δεν έχεις προσθέσει αγαπημένα εστιατόρια.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {paginatedData.map((resto) => (
                  <div key={resto.id} className="relative group">
                    <Link to={`/restaurant/${resto.id}`}>
                      <Card className="h-[300px] flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                        {resto.photos?.[0] ? (
                          <img
                            src={resto.photos[0]}
                            alt={resto.name}
                            className="w-full h-40 sm:h-44 object-cover"
                          />
                        ) : (
                          <div className="w-full h-40 sm:h-44 bg-gray-50 flex items-center justify-center">
                            <img
                              src="/images/yummyLogo-2.png"
                              alt="Λογότυπο Yummy App"
                              width="192"
                              height="192"
                              loading="eager"
                              fetchpriority="high"
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
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    <div className="absolute top-2 right-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-600 w-9 h-9 sm:w-10 sm:h-10 bg-white border border-red-200 hover:bg-red-100 hover:text-red-800 shadow-sm rounded-full"
                        onClick={() => onConfirmRemove(resto.id)}
                      >
                        <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      </Button>
                    </div>
                  </div>
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
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
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

export default FavoriteRestaurantsCard;
