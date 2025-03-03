import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchlist, removeFromWatchlist } from "../store/authSlice";
import {
  restaurants,
  menuItems,
  specialMenus,
  coupons,
} from "../data/dummyData";
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

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [errorDialog, setErrorDialog] = useState(false);
  const restaurant = restaurants.find((resto) => resto.id === id);
  const restaurantMenus = menuItems.filter(
    (menu) => menu.restaurantId === restaurant.id
  );
  const menuCategories = [
    ...new Set(restaurantMenus.map((item) => item.category)),
  ];
  const restaurantSpecialMenus = specialMenus.filter(
    (menu) => menu.restaurantId === restaurant.id
  );
  const restaurantCoupons = coupons.filter(
    (coupon) => coupon.restaurantId === restaurant.id
  );

  const [selectedCategory, setSelectedCategory] = useState(
    menuCategories[0] || ""
  );

  const filteredDishes = restaurantMenus.filter(
    (dish) => dish.category === selectedCategory
  );

  const [reservation, setReservation] = useState({
    date: null,
    time: "",
    guests: "",
    specialMenu: null,
    coupon: null,
  });

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
      setErrorDialog(true); // Εμφάνιση του Dialog
      return;
    }

    const newReservation = {
      restaurantId: restaurant.id,
      date: format(reservation.date, "yyyy-MM-dd"),
      time: reservation.time,
      guests: reservation.guests,
      specialMenu: reservation.specialMenu,
      coupon: reservation.coupon,
    };

    console.log("🚀 Νέα κράτηση:", newReservation);
    navigate("/confirmation", { state: newReservation });
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
      alert("Πρέπει να συνδεθείτε για να προσθέσετε στην watchlist!"); // Ideally replace with a modal
      return;
    }

    if (isInWatchlist) {
      dispatch(removeFromWatchlist(restaurant.id));
    } else {
      dispatch(addToWatchlist(restaurant.id));
    }
  };

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
            {isInWatchlist ? "Αφαίρεση από Watchlist" : "Προσθήκη στη Watchlist"}
          </Button>
        </div>
      </section>

      <Separator className="my-10" />

      {/* Happy Hours & Coupons */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🎉 Προσφορές & Happy Hours
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurant.happyHours?.length > 0 && (
            <Card className="p-6 bg-red-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-red-600">
                  Happy Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  ⏳ Από {restaurant.happyHours[0].startTime} έως{" "}
                  {restaurant.happyHours[0].endTime}
                </p>
                <Badge className="bg-red-500 text-white mt-3">
                  -{restaurant.happyHours[0].discountPercentage}% σε επιλεγμένα
                  πιάτα!
                </Badge>
              </CardContent>
            </Card>
          )}

          {restaurantCoupons.length > 0 ? (
            restaurantCoupons.map((coupon) => (
              <Card key={coupon.id} className="p-6 bg-green-100">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-600">
                    🎟️ Διαθέσιμα Κουπόνια
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{coupon.description}</p>
                  <Badge className="bg-green-500 text-white mt-3">
                    Χρησιμοποίησε το τώρα!
                  </Badge>
                </CardContent>
              </Card>
            ))
          ) : (
            // Μήνυμα όταν δεν υπάρχουν κουπόνια
            <Card className="p-6 bg-blue-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-600">
                  💰 Μαζέψτε Πόντους & Κερδίστε!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Κερδίστε loyalty points με κάθε κράτηση και αποκτήστε
                  αποκλειστικά κουπόνια για εκπτώσεις στα αγαπημένα σας
                  εστιατόρια! 🎉
                </p>
                <Button
                  className="mt-4 bg-primary text-white"
                  onClick={() => navigate("/loyalty")} // Redirect to /loyalty
                >
                  🎟️ Δείτε το Πρόγραμμα Loyalty
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Separator className="my-10" />

      {/* Special Menus */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🍽️ Ειδικά Μενού
        </h2>
        {restaurantSpecialMenus.length === 0 ? (
          <p className="text-gray-600">
            ❌ Δεν υπάρχουν ειδικά μενού αυτή τη στιγμή.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {restaurantSpecialMenus.map((menu) => (
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
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-gray-600 line-through">
                      €{menu.originalPrice}
                    </span>
                    <span className="text-primary font-bold">
                      €{menu.discountedPrice}
                    </span>
                  </div>
                  <Badge className="bg-yellow-500 text-white mt-3">
                    -{menu.discountPercentage}% έκπτωση!
                  </Badge>
                </CardContent>
              </Card>
            ))}
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
                  : "bg-gray-200 text-gray-700"
              } transition-all`}
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
          <h3 className="text-lg font-semibold">🍽️ Special Menu</h3>
          {restaurantSpecialMenus.length === 0 ? (
            <p className="text-gray-500 text-sm">
              ❌ Δεν υπάρχουν διαθέσιμα Special Menus για αυτό το εστιατόριο.
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
                {restaurantSpecialMenus.map((menu) => (
                  <SelectItem key={menu.id} value={menu.id}>
                    {menu.name} - €{menu.discountedPrice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Coupon Selection */}
          <h3 className="text-lg font-semibold mt-4">🎟️ Χρήση Κουπονιού</h3>
          {restaurantCoupons.length === 0 ? (
            <p className="text-gray-500 text-sm">
              💰 Δεν υπάρχουν διαθέσιμα κουπόνια. Μαζέψτε loyalty points για να
              κερδίσετε εκπτώσεις! 🎉
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
                {restaurantCoupons.map((coupon) => (
                  <SelectItem key={coupon.id} value={coupon.id}>
                    {coupon.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button
          className="w-full px-9 py-6 mt-6 bg-primary text-white"
          onClick={handleReserve}
        >
          ✅ Επιβεβαίωση Κράτησης
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
    </div>
  );
};

export default RestaurantDetailsPage;
