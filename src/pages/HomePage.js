// ✅ Αυτό το αρχείο περιλαμβάνει ΟΛΟΚΛΗΡΟ τον αρχικό σου κώδικα
// με χρήση του SearchBar component αντί του inline φίλτρου

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "../components/ui/carousel";
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
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchParams as setSearchParamsAction } from "../store/searchSlice";
import { useScreenConfig } from "../hooks/useScreenConfig";
import {
  useTrendingRestaurants,
  useDiscountedRestaurants,
  useTestimonials,
} from "../hooks/useDummyData";
import Loading from "../components/Loading";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxSearchParams = useSelector((state) => state.search ?? {});
  const [searchParams, setSearchParams] = useState(reduxSearchParams);


  const { itemsPerPage, carouselWidth } = useScreenConfig();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleSearch = () => {
    dispatch(setSearchParamsAction(searchParams));
    navigate("/reserve");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const { data: trendingRestaurants = [], isLoading: trendingLoading } =
    useTrendingRestaurants();
  const { data: discountedRestaurants = [], isLoading: discountedLoading } =
    useDiscountedRestaurants(currentPage, itemsPerPage);
  const { data: testimonials = [], isLoading: testimonialsLoading } =
    useTestimonials(1, 6);

    const totalPages = Math.ceil(discountedRestaurants.length / itemsPerPage);

  // Φιλτράρουμε μόνο τα εστιατόρια που έχουν Happy Hour
  // const discountedRestaurants = restaurants.filter(
  //   (resto) => resto.happyHours.length > 0
  // );
  // const totalPages = Math.ceil(discountedRestaurants.length / itemsPerPage);

  // Υπολογίζουμε τα εστιατόρια που εμφανίζονται στην τρέχουσα σελίδα
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const visibleRestaurants = discountedRestaurants.slice(
  //   startIndex,
  //   startIndex + itemsPerPage
  // );

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 10; h < 24; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return slots;
  }, []);

  return (
    <div className="container mx-auto px-6 rounded-3xl">
      {/* ✅ Hero Section */}
      <section
        className="relative w-full h-[500px] flex items-center justify-center text-center bg-cover bg-center rounded-3xl shadow-lg overflow-hidden"
        style={{ backgroundImage: "url('/images/wide3.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>

        <div className="relative z-10 px-6 text-white">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg">
            Κλείσε Τραπέζι σε Δευτερόλεπτα! 🍽️
          </h1>
          <p className="text-lg sm:text-xl mt-4 drop-shadow-md">
            Ανακάλυψε τις καλύτερες γεύσεις με αποκλειστικές προσφορές.
          </p>
        </div>
      </section>

      {/* ✅ Επαγγελματικό & Responsive Filter Section */}
      <SearchBar
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        timeSlots={timeSlots}
        onSearch={handleSearch}
      />

      <Separator className="my-10" />

      {/* Why Yummy? Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🎉 Γιατί να επιλέξεις το Yummy;
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-all hover:scale-105">
            <h3 className="text-xl font-semibold">🚀 Ταχύτατες Κρατήσεις</h3>
            <p className="text-gray-600 mt-2">
              Κλείσε τραπέζι μέσα σε λίγα δευτερόλεπτα χωρίς τηλεφωνήματα!
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-all hover:scale-105">
            <h3 className="text-xl font-semibold">
              🎯 Προσφορές & Happy Hours
            </h3>
            <p className="text-gray-600 mt-2">
              Εκπτώσεις έως 50% σε επιλεγμένα εστιατόρια!
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-all hover:scale-105">
            <h3 className="text-xl font-semibold">⭐ Κριτικές Πελατών</h3>
            <p className="text-gray-600 mt-2">
              Διάβασε πραγματικές εμπειρίες και επέλεξε το καλύτερο εστιατόριο!
            </p>
          </div>
        </div>
      </section>

      <Separator className="my-10" />

      {/* Customer Testimonials */}
      {/* Testimonials */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          💬 Τι λένε οι χρήστες μας;
        </h2>

        {testimonialsLoading ? (
          <Loading />
        ) : (
          <Carousel className="w-full overflow-hidden">
            <CarouselContent
              className={`flex flex-nowrap gap-4 ${carouselWidth}`}
            >
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="w-[100%] sm:w-[50%] md:w-[33%]"
                >
                  <Card className="shadow-md p-6 text-gray-700">
                    <p className="italic">"{testimonial.message}"</p>
                    <p className="font-bold text-gray-900 mt-2">
                      - Χρήστης {index + 1}
                    </p>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </section>

      <Separator className="my-10" />

      {/* Trending Restaurants */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          🌟 Δημοφιλή Εστιατόρια
        </h2>

        {trendingLoading ? (
          <Loading />
        ) : (
          <Carousel className="w-full overflow-hidden">
            <CarouselContent
              className={`flex flex-nowrap gap-4 ${carouselWidth}`}
            >
              {trendingRestaurants.map((resto) => (
                <CarouselItem
                  key={resto.id}
                  className="w-[100%] sm:w-[50%] md:w-[33%]"
                >
                  <Link to={`/restaurant/${resto.id}`}>
                    <Card className="shadow-md">
                      <CardContent className="p-4">
                        <img
                          src={resto.photos[0]}
                          alt={resto.name}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <h3 className="mt-4 text-lg font-bold">{resto.name}</h3>
                        <p className="text-gray-600">{resto.cuisine}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </section>

      <Separator className="my-10" />

      {/* Dynamic Discount System */}
      {/* Δυναμικές Εκπτώσεις */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          🔥 Δυναμικές Εκπτώσεις
        </h2>

        {discountedLoading ? (
          <Loading />
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl">
              {discountedRestaurants.map((resto) => (
                <Link to={`/restaurant/${resto.id}`} key={resto.id}>
                  <Card className="hover:shadow-xl transition-shadow p-4 rounded-2xl">
                    <img
                      src={resto.photos[0]}
                      alt={resto.name}
                      className="w-full h-44 object-cover rounded-xl mb-4"
                    />

                    <CardHeader className="mb-2">
                      <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                        {resto.name}
                      </CardTitle>

                      <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                        <span className="font-medium">{resto.cuisine}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{resto.rating}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p className="text-gray-600">{resto.location}</p>

                      {resto.happyHours.length > 0 && (
                        <div className="mt-2 p-3 bg-red-100 rounded-md">
                          <Badge className="bg-red-500 text-white">
                            Happy Hour: -
                            {resto.happyHours[0].discountPercentage}%
                          </Badge>
                          <p className="text-sm mt-1">
                            🕒 {resto.happyHours[0].startTime} -{" "}
                            {resto.happyHours[0].endTime}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Εμφανίζουμε Pagination μόνο αν υπάρχουν παραπάνω από 1 σελίδα */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
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

                <span className="px-4 py-2 text-gray-700">
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
      </section>

      <Separator className="my-10" />

      {/* Membership & Loyalty */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          🎖️ Πρόγραμμα Επιβράβευσης
        </h2>
        <Card className="p-6 bg-gradient-to-r from-yellow-400 to-red-500 text-white text-center">
          <h3 className="text-2xl font-bold">
            Γίνε VIP Μέλος & Κέρδισε Δωρεάν Γεύματα
          </h3>
          <p className="mt-4">
            Κάθε κράτηση σου δίνει πόντους! Κέρδισε δωρεάν γεύματα και ειδικές
            προσφορές.
          </p>
          <Button
            className="mt-6 bg-white text-primary hover:bg-primary hover:text-white transition-all"
            onClick={() => handleNavigate("/loyalty")}
          >
            Μάθε Περισσότερα
          </Button>
        </Card>
      </section>

      <Separator className="my-10" />

      {/* Group & Corporate Deals */}
      <section className="mb-5">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          🏢 Ομαδικές & Εταιρικές Κρατήσεις
        </h2>
        <Card className="p-6 bg-gray-100 text-center">
          <h3 className="text-xl font-bold">
            Ειδικές Προσφορές για Μεγάλες Παρέες!
          </h3>
          <p className="mt-4">
            Κάνε κράτηση για 5+ άτομα και κέρδισε αποκλειστικές εκπτώσεις.
          </p>
          <Button
            className="mt-4 bg-primary text-white"
            onClick={() => handleNavigate("/group-booking")}
          >
            Δες τις Προσφορές
          </Button>
        </Card>
      </section>

      {/* Floating CTA Button */}
      {/* <div className="fixed bottom-6 right-6 z-50">
        <Button className="bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all">
          📞 Κλείσε Τραπέζι Τώρα
        </Button>
      </div> */}
      <HomepageCTAButton />
    </div>
  );
};

export default HomePage;
