import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useTrendingRestaurants } from "../../hooks/useDummyData";
import Loading from "../Loading";
import { Card, CardContent } from "../ui/card";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const TrendingRestaurantsCarousel = () => {
  const { data: trendingRestaurants = [], isLoading } = useTrendingRestaurants();

  return (
    <motion.section {...fadeIn} className="px-4 sm:px-6 md:px-10 py-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">
        🌟 Δημοφιλή Εστιατόρια
      </h2>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
          {trendingRestaurants.map((resto) => (
            <div
              key={resto.id}
              className="snap-start min-w-[90%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[24%] 2xl:min-w-[20%] flex-shrink-0"
            >
              <Link to={`/restaurant/${resto.id}`}>
                <Card className="md:hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border border-gray-200 bg-white">
                  <CardContent className="p-0">
                    {/* Image */}
                    <img
                      src={resto.photos?.[0]}
                      alt={resto.name}
                      className="w-full h-40 sm:h-44 object-cover"
                    />

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-4 text-sm sm:text-base text-gray-700">
                      {/* Header */}
                      <div className="flex justify-between items-center gap-2">
                        <h3 className="text-[1rem] sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                          {resto.name}
                        </h3>
                        <div className="flex items-center gap-1 text-red-600 text-xs sm:text-sm md:text-base">
                          <Star className="w-4 h-4" />
                          {resto.rating}
                        </div>
                      </div>

                      {/* Cuisine + Location */}
                      <p className="text-[12px] sm:text-sm md:text-base text-gray-600 font-medium leading-tight">
                        {resto.cuisine} – {resto.location}
                      </p>

                      {/* 🔴 Special Menu */}
                      {resto.specialMenu && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2 space-y-1">
                          <div className="bg-red-600 text-white rounded-full px-3 py-1 w-fit text-xs sm:text-sm font-semibold shadow-sm">
                            🎉 Happy Hour
                          </div>
                          <p className="text-red-900 font-medium text-sm sm:text-base">
                            {resto.specialMenu.name} | {resto.specialMenu.discountPercentage}% έκπτωση
                          </p>
                        </div>
                      )}

                      {/* 🔵 Coupon */}
                      {resto.coupon && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mt-2 space-y-1">
                          <div className="bg-blue-600 text-white rounded-full px-3 py-1 w-fit text-xs sm:text-sm font-semibold shadow-sm">
                            🎁 Κουπόνι Ανταμοιβής
                          </div>
                          <p className="text-blue-900 font-medium text-sm sm:text-base">
                            {resto.coupon.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default TrendingRestaurantsCarousel;
