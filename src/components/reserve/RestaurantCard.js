import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";

const RestaurantCard = ({ resto }) => (
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
        <div className="p-4 sm:p-5 space-y-4 text-base sm:text-base text-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center gap-2">
            <h3 className="text-[1rem] sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
              {resto.name}
            </h3>
            <div className="flex items-center gap-1 text-red-600 text-xs sm:text-base md:text-base">
              <Star className="w-4 h-4" />
              {resto.rating}
            </div>
          </div>

          {/* Cuisine + Location */}
          <p className="text-[12px] sm:text-base md:text-base text-gray-600 font-medium leading-tight">
            {resto.cuisine} – {resto.location}
          </p>

          {/* 🔴 Special Menu */}
          {resto.specialMenu && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2 space-y-1">
              <div className="bg-red-600 text-white rounded-full px-3 py-1 w-fit text-xs sm:text-base font-semibold shadow-sm">
                🎉 Happy Hour
              </div>
              <p className="text-red-900 font-medium text-base sm:text-base">
                {resto.specialMenu.name} |{" "}
                {resto.specialMenu.discountPercentage}% έκπτωση
              </p>
            </div>
          )}

          {/* 🔵 Coupon */}
          {resto.coupon && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mt-2 space-y-1">
              <div className="bg-blue-600 text-white rounded-full px-3 py-1 w-fit text-xs sm:text-base font-semibold shadow-sm">
                🎁 Κουπόνι Ανταμοιβής
              </div>
              <p className="text-blue-900 font-medium text-base sm:text-base">
                {resto.coupon.description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default RestaurantCard;
