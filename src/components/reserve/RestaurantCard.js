import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Star } from "lucide-react";

const RestaurantCard = ({ resto }) => (
  <Link to={`/restaurant/${resto.id}`}>
    <Card className="h-[460px] sm:h-[500px] flex flex-col overflow-hidden border border-gray-200 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
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
            className="h-12 sm:h-14 opacity-60 object-contain"
          />
        </div>
      )}

      <CardContent className="flex-1 p-4 sm:p-5 flex flex-col justify-between text-gray-700 text-sm sm:text-base">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-center gap-2">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
              {resto.name}
            </h3>
            <div className="flex items-center gap-1 text-red-600 text-xs sm:text-sm">
              <Star className="w-4 h-4" />
              {resto.rating}
            </div>
          </div>

          {/* Cuisine + Location */}
          <p className="text-xs sm:text-sm text-gray-600 font-medium leading-tight truncate">
            {resto.cuisine} – {resto.location}
          </p>

          {/* 🔴 Special Menu */}
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

          {/* 🔵 Coupon */}
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
);

export default RestaurantCard;
