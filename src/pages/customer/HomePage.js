import { useState, useMemo, useCallback } from "react";
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
import SEOHelmet from "../../components/SEOHelmet";
import { generateTimeSlots } from "../../utils/timeUtils";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxSearchParams = useSelector((state) => state.search ?? {});
  const [searchParams, setSearchParams] = useState(reduxSearchParams);

  const handleSearch = useCallback(() => {
    dispatch(setSearchParamsAction(searchParams));
    navigate("/reserve");
  }, [dispatch, navigate, searchParams]);

  const timeSlots = useMemo(() => {
    return generateTimeSlots();
  }, []);

  return (
    <>
      <SEOHelmet
        title="Yummy | Κράτηση με προσφορές σε εστιατόρια"
        description="Κλείσε τραπέζι με εκπτώσεις Happy Hour, loyalty πόντους και κουπόνια ανταμοιβής σε δημοφιλή εστιατόρια."
        url="https://yummy-app.gr/"
        image="https://yummy-app.gr/images/yummyLogo-2.png"
      />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-8 space-y-20">
        <HeroSection />
        <SearchBar
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          timeSlots={timeSlots}
          onSearch={handleSearch}
        />
        <WhyYummySection />
        <TestimonialsCarousel />
        <TrendingRestaurantsCarousel />
        <HappyHoursSection />
        <PurchasedCouponRestaurantsSection />
        <LoyaltyProgram />
        <HomepageCTAButton />
      </div>
    </>
  );
};

export default HomePage;