import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HomepageCTAButton from "../../components/homepage/HomepageCTAButton";
import SearchBar from "../../components/SearchBar";
import { setSearchParams as setSearchParamsAction } from "../../store/searchSlice";
import HeroSection from "../../components/homepage/HeroSection";
import WhyYummySection from "../../components/homepage/WhyYummySection";
import TestimonialsCarousel from "../../components/homepage/TestimonialsCarousel";
import HappyHoursSection from "../../components/homepage/HappyHoursSection";
import LoyaltyProgram from "../../components/homepage/LoyaltyProgramCard";
import TrendingRestaurantsCarousel from "../../components/homepage/TrendingRestaurantsCarousel";
import PurchasedCouponRestaurantsSection from "../../components/homepage/PurchasedCouponRestaurantsSection";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxSearchParams = useSelector((state) => state.search ?? {});
  const [searchParams, setSearchParams] = useState(reduxSearchParams);

  const handleSearch = () => {
    dispatch(setSearchParamsAction(searchParams));
    navigate("/reserve");
  };

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 10; h < 24; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return slots;
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-8 space-y-20">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Filter */}
      <SearchBar
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        timeSlots={timeSlots}
        onSearch={handleSearch}
      />

      {/* Why Yummy */}
      <WhyYummySection />

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* Trending Restaurants */}
      <TrendingRestaurantsCarousel />

      {/* Discounted Restaurants */}
      <HappyHoursSection />

      {/* Coupons Purchased By User */}
      <PurchasedCouponRestaurantsSection user_id="user001" />

      {/* Loyalty Program */}
      <LoyaltyProgram />

      <HomepageCTAButton />
    </div>
  );
};

export default HomePage;
