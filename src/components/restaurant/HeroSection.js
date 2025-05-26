import { Button } from "../ui/button";
import { Star, Heart } from "lucide-react";

const HeroSection = ({
  restaurant,
  isInWatchlist,
  handleToggleWatchlist,
}) => {
  return (
    <section
      className="relative h-[450px] flex items-center justify-center text-center rounded-3xl overflow-hidden shadow-xl"
      style={{ backgroundImage: `url('${restaurant.photos || "/images/wide10.jpg"}')` }}
    >
      <img
        src={restaurant.photos || "/images/wide10.jpg"}
        alt={restaurant.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
      <div className="relative z-10 text-white px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-xl">
          {restaurant.name}
        </h1>
        <p className="text-xl mt-3 drop-shadow-md">
          {restaurant.location} | {restaurant.cuisine}
        </p>
        <div className="flex justify-center items-center gap-2 mt-2 text-lg drop-shadow">
          <Star className="w-5 h-5 text-yellow-400" />
          <span>{restaurant.rating}</span>
        </div>

        <Button
          className={`mt-6 px-6 py-3 text-sm font-semibold rounded-full transition-all shadow-md ${
            isInWatchlist ? "bg-red-600" : "bg-gray-600"
          } text-white hover:scale-105`}
          onClick={handleToggleWatchlist}
        >
          <Heart className="w-5 h-5 mr-2" />
          {isInWatchlist ? "Αφαίρεση από Watchlist" : "Προσθήκη στη Watchlist"}
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
