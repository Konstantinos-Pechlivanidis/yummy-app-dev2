import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Carousel, CarouselItem, CarouselContent } from "../components/ui/carousel";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Star } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import HomepageCTAButton from "../components/HomepageCTAButton";
import SearchBar from "../components/SearchBar";
import { setSearchParams as setSearchParamsAction } from "../store/searchSlice";
import { useScreenConfig } from "../hooks/useScreenConfig";
import {
  useTrendingRestaurants,
  useDiscountedRestaurants,
  useTestimonials,
} from "../hooks/useDummyData";
import Loading from "../components/Loading";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxSearchParams = useSelector((state) => state.search ?? {});
  const [searchParams, setSearchParams] = useState(reduxSearchParams);
  const { itemsPerPage, carouselWidth } = useScreenConfig();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: trendingRestaurants = [], isLoading: trendingLoading } = useTrendingRestaurants();
  const { data: discountedRestaurants = [], isLoading: discountedLoading } = useDiscountedRestaurants(currentPage, itemsPerPage);
  const { data: testimonials = [], isLoading: testimonialsLoading } = useTestimonials(1, 6);

  const totalPages = Math.ceil(discountedRestaurants.length / itemsPerPage);

  const handleSearch = () => {
    dispatch(setSearchParamsAction(searchParams));
    navigate("/reserve");
  };

  const handleNavigate = (path) => {
    navigate(path);
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
      <section className="relative h-[550px] flex items-center justify-center text-center rounded-3xl overflow-hidden shadow-xl">
        <img src="/images/wide3.jpg" alt="hero" className="absolute inset-0 object-cover w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 z-0" />
        <motion.div {...fadeIn} className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-2xl">
            Κλείσε Τραπέζι σε Δευτερόλεπτα! 🍽️
          </h1>
          <p className="text-xl md:text-2xl mt-4 drop-shadow-md">
            Ανακάλυψε τις καλύτερες γεύσεις με αποκλειστικές προσφορές.
          </p>
        </motion.div>
      </section>

      {/* Search Filter */}
      <SearchBar
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        timeSlots={timeSlots}
        onSearch={handleSearch}
      />

      {/* Why Yummy */}
      <motion.section {...fadeIn} className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10">🎉 Γιατί να επιλέξεις το Yummy;</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "🚀 Ταχύτατες Κρατήσεις", desc: "Κλείσε τραπέζι μέσα σε λίγα δευτερόλεπτα χωρίς τηλεφωνήματα!" },
            { title: "🎯 Προσφορές & Happy Hours", desc: "Εκπτώσεις έως 50% σε επιλεγμένα εστιατόρια!" },
            { title: "⭐ Κριτικές Πελατών", desc: "Διάβασε πραγματικές εμπειρίες και επέλεξε το καλύτερο εστιατόριο!" },
          ].map(({ title, desc }, idx) => (
            <Card key={idx} className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-2xl transition-transform hover:scale-105">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-gray-600 mt-2">{desc}</p>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section {...fadeIn} className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8">💬 Τι λένε οι χρήστες μας;</h2>
        {testimonialsLoading ? <Loading /> : (
          <Carousel className="w-full overflow-hidden">
            <CarouselContent className={`flex flex-nowrap gap-4 ${carouselWidth}`}>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="w-[100%] sm:w-[50%] md:w-[33%]">
                  <Card className="shadow-md p-6 text-gray-700 bg-white rounded-xl">
                    <p className="italic">"{testimonial.message}"</p>
                    <p className="font-bold text-gray-900 mt-2">- Χρήστης {index + 1}</p>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </motion.section>

      {/* Trending Restaurants */}
      <motion.section {...fadeIn}>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">🌟 Δημοφιλή Εστιατόρια</h2>
        {trendingLoading ? <Loading /> : (
          <Carousel className="w-full overflow-hidden">
            <CarouselContent className={`flex flex-nowrap gap-4 ${carouselWidth}`}>
              {trendingRestaurants.map((resto) => (
                <CarouselItem key={resto.id} className="w-[100%] sm:w-[50%] md:w-[33%]">
                  <Link to={`/restaurant/${resto.id}`}>
                    <Card className="hover:shadow-xl transition-shadow rounded-xl overflow-hidden">
                      <CardContent className="p-0">
                        <img src={resto.photos[0]} alt={resto.name} className="w-full h-44 object-cover" />
                        <div className="p-4">
                          <h3 className="text-lg font-bold">{resto.name}</h3>
                          <p className="text-gray-600">{resto.cuisine}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </motion.section>

      {/* Discounted Restaurants */}
      <motion.section {...fadeIn}>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">🔥 Δυναμικές Εκπτώσεις</h2>
        {discountedLoading ? <Loading /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {discountedRestaurants.map((resto) => (
              <Link to={`/restaurant/${resto.id}`} key={resto.id}>
                <Card className="hover:shadow-2xl transition-transform hover:scale-[1.02] p-4 rounded-2xl">
                  <img src={resto.photos[0]} alt={resto.name} className="w-full h-44 object-cover rounded-xl mb-4" />
                  <CardHeader className="mb-2">
                    <CardTitle className="text-xl font-semibold">{resto.name}</CardTitle>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>{resto.cuisine}</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {resto.rating}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{resto.location}</p>
                    {resto.happyHours.length > 0 && (
                      <div className="mt-2 p-2 bg-red-100 rounded-md text-sm">
                        <Badge className="bg-red-500 text-white">
                          Happy Hour: -{resto.happyHours[0].discountPercentage}%
                        </Badge>
                        <p className="mt-1">🕒 {resto.happyHours[0].startTime} - {resto.happyHours[0].endTime}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                    <PaginationPrevious />
                  </Button>
                </PaginationItem>
                <span className="px-4 py-2 text-gray-700">
                  Σελίδα {currentPage} από {totalPages}
                </span>
                <PaginationItem>
                  <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                    <PaginationNext />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.section>

      {/* Loyalty Program */}
      <motion.section {...fadeIn}>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">🎖️ Πρόγραμμα Επιβράβευσης</h2>
        <Card className="p-6 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-center rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold">Γίνε VIP Μέλος & Κέρδισε Δωρεάν Γεύματα</h3>
          <p className="mt-4">Κάθε κράτηση σου δίνει πόντους! Κέρδισε δωρεάν γεύματα και ειδικές προσφορές.</p>
          <Button className="mt-6 bg-white text-primary hover:bg-primary hover:text-white transition-all" onClick={() => handleNavigate("/loyalty")}>
            Μάθε Περισσότερα
          </Button>
        </Card>
      </motion.section>

      {/* Group Booking */}
      {/* <motion.section {...fadeIn} className="mb-5">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">🏢 Ομαδικές & Εταιρικές Κρατήσεις</h2>
        <Card className="p-6 bg-gray-100 text-center rounded-2xl">
          <h3 className="text-xl font-bold">Ειδικές Προσφορές για Μεγάλες Παρέες!</h3>
          <p className="mt-4">Κάνε κράτηση για 5+ άτομα και κέρδισε αποκλειστικές εκπτώσεις.</p>
          <Button className="mt-4 bg-primary text-white" onClick={() => handleNavigate("/group-booking")}>
            Δες τις Προσφορές
          </Button>
        </Card>
      </motion.section> */}

      <HomepageCTAButton />
    </div>
  );
};

export default HomePage;
