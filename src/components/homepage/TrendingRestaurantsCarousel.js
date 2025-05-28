import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useTrendingRestaurants } from "../../hooks/useRestaurants";
import Loading from "../Loading";
import { Card, CardContent } from "../ui/card";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const TrendingRestaurantsCarousel = () => {
  const { data, isLoading } = useTrendingRestaurants();
  const trendingRestaurants = data?.allTrendingRestaurants ?? [];

  return (
    <motion.section {...fadeIn} className="px-4 sm:px-6 md:px-10 py-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">
        🌟 Δημοφιλή Εστιατόρια
      </h2>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4">
          {trendingRestaurants.map((resto) => (
            <div
              key={resto.id}
              className="snap-start w-[85%] sm:w-[48%] md:w-[31%] lg:w-[28%] flex-shrink-0"
            >
              <Link to={`/restaurant/${resto.id}`}>
                <Card className="h-[520px] flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
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

                      {resto.special_menus && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-1 space-y-1">
                          <div className="bg-red-600 text-white rounded-full px-3 py-1 w-fit text-xs sm:text-sm font-semibold shadow-sm">
                            🎉 Happy Hour
                          </div>
                          <p className="text-red-900 font-medium text-sm sm:text-base line-clamp-2">
                            {resto.special_menus.name} |{" "}
                            {resto.special_menus.discount_percentage}% έκπτωση
                          </p>
                        </div>
                      )}

                      {resto.coupons && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mt-1 space-y-1">
                          <div className="bg-blue-600 text-white rounded-full px-3 py-1 w-fit text-xs sm:text-sm font-semibold shadow-sm">
                            🎁 Κουπόνι Ανταμοιβής
                          </div>
                          <p className="text-blue-900 font-medium text-sm sm:text-base line-clamp-2">
                            {resto.coupons.description}
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
