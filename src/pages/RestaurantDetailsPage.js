import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToWatchlist, removeFromWatchlist } from "../store/authSlice";
import {
  useRestaurantDetails,
  useCreateReservation,
  useUserById,
  useUserLoyaltyPoints,
  useUserCoupons,
  useAvailableCouponsForRestaurant,
  usePurchaseCoupon,
  useToggleWatchlist,
} from "../hooks/useDummyData";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Star, CalendarIcon, HelpCircle, Heart } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { format, isValid } from "date-fns";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";
import { setSearchParams as setSearchParamsAction } from "../store/searchSlice";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxSearchParams = useSelector((state) => state.search ?? {});

  const [reservation, setReservation] = useState({
    date: reduxSearchParams.date || "",
    time: reduxSearchParams.time || "",
    guests: reduxSearchParams.guests || "",
    specialMenu: null,
    coupon: null,
    notes: "",
  });

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [errorDialog, setErrorDialog] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const { data: restaurant, isLoading, isError } = useRestaurantDetails(id);
  const menuItems = restaurant?.menuItems || [];
  const restaurantSpecialMenus = restaurant?.specialMenus || [];
  const restaurantCoupons = restaurant?.coupons || [];
  const { mutate: purchaseCoupon, isPending: isPurchasing } =
    usePurchaseCoupon();
  const { mutate: createReservation, isPending: isSubmitting } =
    useCreateReservation();

  const { data: loyaltyPoints = 0, isLoading: isLoadingPoints } =
    useUserLoyaltyPoints(user?.id);
  const { data: userCoupons = [], isLoading: isLoadingUserCoupons } =
    useUserCoupons(user?.id);
  const { data: availableCoupons = [], isLoading: isLoadingAvailableCoupons } =
    useAvailableCouponsForRestaurant(id, user?.id);
  const { mutate: toggleWatchlist } = useToggleWatchlist();

  const [selectedCategory, setSelectedCategory] = useState("");
  const menuCategories = [...new Set(menuItems.map((item) => item.category))];

  useEffect(() => {
    if (!selectedCategory && menuCategories.length > 0) {
      setSelectedCategory(menuCategories[0]);
    }
  }, [menuCategories, selectedCategory]);

  const filteredDishes = menuItems.filter(
    (dish) => dish.category === selectedCategory
  );

  if (
    isLoading ||
    isLoadingPoints ||
    isLoadingUserCoupons ||
    isLoadingAvailableCoupons
  ) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <Loading />
      </section>
    );
  }

  if (!restaurant) {
    return (
      <p className="text-center text-gray-600 mt-10">
        ❌ Το εστιατόριο δεν βρέθηκε.
      </p>
    );
  }

  const timeSlots = [];
  for (let h = 10; h < 24; h++) {
    timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
  }

  const handleReserve = () => {
    if (!reservation.date || !reservation.time || !reservation.guests) {
      setErrorDialog(true);
      return;
    }
    setConfirmSubmit(true);
  };

  const handleSpecialMenuChange = (value) => {
    setReservation({ ...reservation, specialMenu: value, coupon: null });
  };

  const handleCouponChange = (value) => {
    setReservation({ ...reservation, coupon: value, specialMenu: null });
  };

  const isInWatchlist = user?.favoriteRestaurants?.includes(restaurant.id);

  const handleToggleWatchlist = () => {
    if (!isAuthenticated) {
      toast.error("Πρέπει να συνδεθείς για να χρησιμοποιήσεις τη Watchlist.");
      return;
    }

    toggleWatchlist({ userId: user.id, restaurantId: restaurant.id });
  };

  const mergedCoupons = [
    ...(userCoupons ?? []),
    ...(availableCoupons ?? []).filter(
      (ac) => !(userCoupons ?? []).some((uc) => uc.id === ac.id)
    ),
  ];

  // ✅ More reliable filter
  const restaurantCouponObjects = mergedCoupons.filter(
    (coupon) => coupon.restaurantId === restaurant?.id
  );

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <section
        className="relative w-full h-[400px] flex items-center justify-center text-center bg-cover bg-center rounded-3xl shadow-lg overflow-hidden"
        style={{ backgroundImage: `url('${restaurant.photos[0]}')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>
        <div className="relative z-10 px-6 text-white">
          <h1 className="text-3xl sm:text-5xl font-bold drop-shadow-lg">
            {restaurant.name}
          </h1>
          <p className="text-lg mt-4 drop-shadow-md">
            {restaurant.location} | {restaurant.cuisine}
          </p>
          <div className="flex justify-center items-center mt-2 text-lg">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="ml-1">{restaurant.rating}</span>
          </div>
          {/* ❤️ Watchlist Button */}
          <Button
            className={`mt-4 flex items-center px-9 py-6 rounded-lg transition-all ${
              isInWatchlist ? "bg-red-600" : "bg-gray-600"
            } text-white font-bold`}
            onClick={handleToggleWatchlist}
          >
            <Heart className="w-5 h-5 mr-2" />
            {isInWatchlist
              ? "Αφαίρεση από Watchlist"
              : "Προσθήκη στη Watchlist"}
          </Button>
        </div>
      </section>

      <Separator className="my-10" />

      {/* Happy Hours & Coupons */}
      {/* 🎁 Κουπόνια */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎁 Τα Κουπόνια μου
        </h2>
        <p className="mb-2 text-gray-700">
          Έχεις <span className="font-semibold">{loyaltyPoints}</span> πόντους.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurantCouponObjects.map((coupon) => {
            const isPurchased = userCoupons.some((uc) => uc.id === coupon.id);

            return (
              <Card
                key={coupon.id}
                className={`p-4 ${
                  isPurchased ? "bg-green-100" : "bg-blue-50"
                } shadow`}
              >
                <CardHeader>
                  <CardTitle
                    className={`text-lg font-semibold ${
                      isPurchased ? "text-green-600" : "text-blue-600"
                    }`}
                  >
                    🎟️ Κουπόνι
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{coupon.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Απαραίτητοι πόντοι:{" "}
                    <span className="font-bold">{coupon.requiredPoints}</span>
                  </p>

                  {isPurchased ? (
                    <Badge className="bg-green-600 text-white mt-2">
                      Το έχεις ήδη αγοράσει
                    </Badge>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="mt-3 bg-blue-600 text-white w-full"
                          disabled={loyaltyPoints < coupon.requiredPoints}
                        >
                          Αγορά Κουπονιού
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>🛒 Επιβεβαίωση Αγοράς</DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-700 mb-4">
                          Θέλεις να εξαργυρώσεις{" "}
                          <strong>{coupon.requiredPoints} πόντους</strong> για
                          αυτό το κουπόνι;
                        </p>
                        <div className="flex justify-end gap-3">
                          <DialogTrigger asChild>
                            <Button variant="outline">Άκυρο</Button>
                          </DialogTrigger>
                          <Button
                            className="bg-green-600 text-white"
                            onClick={() =>
                              purchaseCoupon(
                                {
                                  userId: user.id,
                                  couponId: coupon.id,
                                  points: coupon.requiredPoints,
                                },
                                {
                                  onSuccess: () =>
                                    toast.success(
                                      "Η αγορά ολοκληρώθηκε με επιτυχία!"
                                    ),
                                  onError: () =>
                                    toast.error(
                                      "Κάτι πήγε στραβά. Δοκιμάστε ξανά."
                                    ),
                                }
                              )
                            }
                          >
                            {isPurchasing ? "Αγοράζω..." : "Επιβεβαίωση"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Separator className="my-10" />

      {/* Special Menus */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🍽️ Special Menus
        </h2>
        {restaurantSpecialMenus.length === 0 ? (
          <p className="text-gray-600">
            ❌ Δεν υπάρχουν διαθέσιμα Special Menus.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {restaurantSpecialMenus.map((menu) => {
              const selectedDishes = menu.selectedItems.map((itemId) =>
                menuItems.find((item) => item.id === itemId)
              );

              return (
                <Card
                  key={menu.id}
                  className="shadow-md hover:shadow-lg transition-all"
                >
                  <img
                    src={menu.photoUrl}
                    alt={menu.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {menu.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{menu.description}</p>
                    <div className="mt-3 flex justify-start">
                      <span className="text-lg text-gray-600 line-through">
                        €{menu.originalPrice}
                      </span>
                      <span className="text-xl text-primary font-bold ml-2">
                        €{menu.discountedPrice}
                      </span>
                    </div>

                    {/* Center Aligned Badge */}
                    <div className="flex justify-start mt-3">
                      <Badge className="text-md bg-yellow-500 text-white px-3 py-4 w-fit text-center">
                        -{menu.discountPercentage}% έκπτωση!
                      </Badge>
                    </div>

                    {/* Εμφάνιση των επιλεγμένων πιάτων */}
                    <h3 className="mt-4 text-md font-semibold text-gray-900">
                      📋 Περιλαμβάνει:
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {selectedDishes.map((dish) => (
                        <li
                          key={dish.id}
                          className="flex items-center space-x-3"
                        >
                          <img
                            src={dish.photoUrl}
                            alt={dish.name}
                            className="w-12 h-12 object-cover rounded-md shadow-sm"
                          />
                          <span className="text-gray-700 ">
                            {dish.name} - €{dish.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Separator className="my-10" />

      {/* Dynamic Menu */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📜 Μενού</h2>

        {/* Κατηγορίες Μενού */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {menuCategories.map((category) => (
            <Button
              key={category}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Λίστα πιάτων για την επιλεγμένη κατηγορία */}
        {filteredDishes.length === 0 ? (
          <p className="text-gray-600 text-center">
            ❌ Δεν υπάρχουν διαθέσιμα πιάτα σε αυτή την κατηγορία.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <Card
                key={dish.id}
                className="shadow-md hover:shadow-lg transition-all"
              >
                <img
                  src={dish.photoUrl}
                  alt={dish.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {dish.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary font-bold">
                      €{dish.price}
                    </span>
                    {dish.discount > 0 && (
                      <Badge className="bg-red-500 text-white">
                        -{dish.discount}%
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator className="my-10" />

      {/* 📅 Φόρμα Κράτησης */}
      <section>
        <h2 className="text-2xl font-bold mb-6">📅 Κάνε την κράτησή σου</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {isValid(reservation.date)
                  ? format(reservation.date, "dd/MM/yyyy")
                  : "Ημερομηνία"}
                <CalendarIcon className="ml-2 h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={reservation.date}
                onSelect={(date) => setReservation({ ...reservation, date })}
                disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
              />
            </PopoverContent>
          </Popover>

          <Select
            value={reservation.time}
            onValueChange={(value) =>
              setReservation({ ...reservation, time: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ώρα" />
              {/* <Clock className="ml-2 h-5 w-5" /> */}
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            min="1"
            placeholder="Αριθμός ατόμων"
            value={reservation.guests}
            onChange={(e) =>
              setReservation({ ...reservation, guests: e.target.value })
            }
            className="w-full"
          />
        </div>

        {/* Special Menus & Coupons (Μόνο ένα επιτρεπτό) */}
        <div className="mt-6">
          {/* Special Menus Selection */}
          <h3 className="text-lg font-semibold mt-6">🍽️ Special Menu</h3>

          {restaurantSpecialMenus.length === 0 ? (
            <p className="text-gray-500 text-sm">
              ❌ Δεν υπάρχουν διαθέσιμα Special Menus για αυτό το εστιατόριο.
            </p>
          ) : !isValid(reservation.date) || !reservation.time ? (
            <p className="text-gray-500 text-sm italic">
              ⏳ Επιλέξτε πρώτα ημερομηνία και ώρα για να δείτε διαθέσιμα
              Special Menus.
            </p>
          ) : (
            (() => {
              const selectedDate = format(reservation.date, "yyyy-MM-dd");
              const validMenus = restaurantSpecialMenus.filter(
                (menu) =>
                  selectedDate === menu.selectedDate &&
                  reservation.time >= menu.timeRange.start &&
                  reservation.time <= menu.timeRange.end
              );

              return validMenus.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  ❌ Δεν υπάρχουν διαθέσιμα Special Menus για την επιλεγμένη
                  ημερομηνία και ώρα.
                </p>
              ) : (
                <Select
                  value={reservation.specialMenu}
                  onValueChange={handleSpecialMenuChange}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Επιλέξτε Special Menu" />
                  </SelectTrigger>
                  <SelectContent>
                    {validMenus.map((menu) => (
                      <SelectItem key={menu.id} value={menu.id}>
                        {menu.name} – €{menu.discountedPrice} (
                        {menu.discountPercentage}% off)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            })()
          )}

          {/* Coupon Selection */}
          <h3 className="text-lg font-semibold mt-4">🎟️ Χρήση Κουπονιού</h3>

          {userCoupons.filter((coupon) => coupon.restaurantId === restaurant.id)
            .length === 0 ? (
            <p className="text-sm text-gray-500">
              💰 Δεν έχεις αγοράσει κουπόνια για αυτό το εστιατόριο.
              Χρησιμοποίησε loyalty points για να αποκτήσεις εκπτώσεις!
            </p>
          ) : (
            <Select
              value={reservation.coupon}
              onValueChange={handleCouponChange}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Επιλέξτε Κουπόνι" />
              </SelectTrigger>
              <SelectContent>
                {userCoupons
                  .filter((coupon) => coupon.restaurantId === restaurant.id)
                  .map((coupon) => (
                    <SelectItem key={coupon.id} value={coupon.id}>
                      {coupon.description}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {/* Notes Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">📝 Σημειώσεις</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              "Έχουμε καροτσάκι για το μωρό.",
              "Θα θέλαμε τραπέζι κοντά στο παράθυρο.",
              "Γιορτάζουμε επέτειο/γενέθλια – αν είναι δυνατό, κάτι ξεχωριστό.",
              "Θα φέρουμε κατοικίδιο (μικρό σκύλο).",
            ].map((note) => (
              <button
                key={note}
                type="button"
                onClick={() =>
                  setReservation((prev) => ({
                    ...prev,
                    notes: prev.notes ? `${prev.notes}\n${note}` : note,
                  }))
                }
                className="bg-gray-100 hover:bg-gray-100 text-sm px-3 py-1 rounded-md border border-gray-300"
              >
                {note}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            placeholder="Γράψε κάτι επιπλέον (π.χ. χωρίς σκαλιά, τραπέζι έξω...)"
            value={reservation.notes || ""}
            onChange={(e) =>
              setReservation({ ...reservation, notes: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>

        <Button
          className="w-full px-9 py-6 mt-6 bg-primary text-white"
          onClick={handleReserve}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Υποβολή..." : "✅ Επιβεβαίωση Κράτησης"}
        </Button>
      </section>

      <Separator className="my-10" />

      {/* 🔙 Back Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => window.history.back()}
          className="bg-gray-500 text-white"
        >
          ⬅ Επιστροφή
        </Button>
      </div>

      {/* ❗ Dialog για το μήνυμα σφάλματος */}
      <Dialog open={errorDialog} onOpenChange={setErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>⚠️ Συμπλήρωσε όλα τα πεδία!</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            Πρέπει να επιλέξετε ημερομηνία, ώρα και αριθμό ατόμων για να
            προχωρήσετε στην κράτηση.
          </p>
          <Button
            className="w-full bg-red-500 text-white"
            onClick={() => setErrorDialog(false)}
          >
            Εντάξει
          </Button>
        </DialogContent>
      </Dialog>

      {/* 🔹 Sticky "❓ Οδηγίες Χρήσης" Button */}
      <div className="fixed bottom-6 right-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center shadow-lg bg-white border rounded-full p-3"
            >
              <HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
              Οδηγίες Χρήσης
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ℹ️ Οδηγίες Χρήσης</DialogTitle>
            </DialogHeader>
            <p>
              📅 <strong>Κράτηση:</strong> Επιλέξτε ημερομηνία, ώρα και αριθμό
              ατόμων και πατήστε "✅ Επιβεβαίωση Κράτησης".
            </p>
            <p>
              🎟️ <strong>Κουπόνια:</strong> Αν έχετε loyalty points, μπορείτε να
              τα εξαργυρώσετε για εκπτώσεις.
            </p>
            <p>
              🍽️ <strong>Special Menus:</strong> Κάποια εστιατόρια προσφέρουν
              προκαθορισμένα μενού με εκπτώσεις.
            </p>
            <p>
              ⏳ <strong>Happy Hours:</strong> Οι εκπτώσεις ισχύουν μόνο σε
              συγκεκριμένες ώρες και μόνο για τη σημερινή ημερομηνία.
            </p>
          </DialogContent>
        </Dialog>
      </div>
      <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>✅ Επιβεβαίωση Κράτησης</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 mb-4">
            Είσαι σίγουρος/η ότι θέλεις να ολοκληρώσεις αυτή την κράτηση;
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setConfirmSubmit(false)}>
              ❌ Άκυρο
            </Button>
            <Button
              className="bg-green-600 text-white"
              onClick={() => {
                setConfirmSubmit(false);
                dispatch(
                  setSearchParamsAction({
                    date: reservation.date,
                    time: reservation.time,
                    guests: reservation.guests,
                  })
                );

                createReservation(
                  {
                    restaurantId: restaurant.id,
                    userId: user.id,
                    date: format(reservation.date, "yyyy-MM-dd"),
                    time: reservation.time,
                    guestCount: parseInt(reservation.guests, 10),
                    specialMenuId: reservation.specialMenu,
                    couponId: reservation.coupon,
                    notes: reservation.notes,
                  },
                  {
                    onSuccess: (created) => {
                      toast.success("Η κράτηση υποβλήθηκε!");
                      navigate(`/confirmation/${created.id}`);
                    },
                    onError: () => {
                      toast.error("⚠️ Κάτι πήγε στραβά κατά την υποβολή.");
                      navigate(`/confirmation/reservation007`);
                    },
                  }
                );
              }}
            >
              ✅ Επιβεβαιώνω
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantDetailsPage;
