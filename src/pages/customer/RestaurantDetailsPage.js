import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format, isValid } from "date-fns";
import { toast } from "react-hot-toast";

import {
  useRestaurantDetails,
  useCreateReservation,
  useUserLoyaltyPoints,
  useUserCoupons,
  useAvailableCouponsForRestaurant,
  usePurchaseCoupon,
  useToggleWatchlist,
} from "../../hooks/useDummyData";

import { setSearchParams as setSearchParamsAction } from "../../store/searchSlice";

import Loading from "../../components/Loading";
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";

import HeroSection from "../../components/restaurant/HeroSection";
import MenuCategoryTabs from "../../components/restaurant/MenuCategoryTabs";
import MenuItemsGrid from "../../components/restaurant/MenuItemsGrid";
import SpecialMenusGrid from "../../components/restaurant/SpecialMenusGrid";
import LoyaltyCouponsGrid from "../../components/restaurant/LoyaltyCouponsGrid";
import ReservationForm from "../../components/restaurant/ReservationForm";
import ReservationDialogs from "../../components/restaurant/ReservationDialogs";
import HelpDialogButton from "../../components/restaurant/HelpDialogButton";

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const reduxSearchParams = useSelector((state) => state.search ?? {});

  const [reservation, setReservation] = useState({
    date: reduxSearchParams.date || "",
    time: reduxSearchParams.time || "",
    guests: reduxSearchParams.guests || "",
    specialMenu: null,
    coupon: null,
    notes: "",
  });

  const [errorDialog, setErrorDialog] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: restaurant, isLoading } = useRestaurantDetails(id);
  const menuItems = useMemo(() => {
  return restaurant?.menuItems || [];
}, [restaurant]);
  const menuCategories = useMemo(() => {
  return [...new Set(menuItems.map((item) => item.category))];
}, [menuItems]);

  const { data: loyaltyPoints = 0, isLoading: isLoadingPoints } = useUserLoyaltyPoints(user?.id);
  const { data: userCoupons = [], isLoading: isLoadingUserCoupons } = useUserCoupons(user?.id);
  const { data: availableCoupons = [], isLoading: isLoadingAvailableCoupons } = useAvailableCouponsForRestaurant(id, user?.id);

  const { mutate: createReservation, isPending: isSubmitting } = useCreateReservation();
  const { mutate: purchaseCoupon, isPending: isPurchasing } = usePurchaseCoupon();
  const { mutate: toggleWatchlist } = useToggleWatchlist();

  useEffect(() => {
    if (!selectedCategory && menuCategories.length > 0) {
      setSelectedCategory(menuCategories[0]);
    }
  }, [menuCategories, selectedCategory]);

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

  const selectedDate = isValid(reservation.date)
    ? format(reservation.date, "yyyy-MM-dd")
    : null;
  const selectedDayEnglish = isValid(reservation.date)
    ? format(reservation.date, "EEEE")
    : null;
  const selectedTime = reservation.time;

  const validMenus = restaurant.specialMenus.filter((menu) => {
    const { availability } = menu;
    if (!availability || !selectedTime || !availability.timeRange) return false;

    const { type, timeRange, dates, daysOfWeek } = availability;
    const timeIsValid =
      selectedTime >= timeRange.start && selectedTime <= timeRange.end;

    if (type === "specific" && selectedDate) {
      return Array.isArray(dates) && dates.includes(selectedDate) && timeIsValid;
    }
    if (type === "recurring" && selectedDayEnglish) {
      return Array.isArray(daysOfWeek) && daysOfWeek.includes(selectedDayEnglish) && timeIsValid;
    }
    if (type === "permanent") {
      return timeIsValid;
    }
    return false;
  });

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

  const restaurantCouponObjects = mergedCoupons.filter(
    (coupon) => coupon.restaurantId === restaurant?.id
  );

  const filteredDishes = menuItems.filter(
    (dish) => dish.category === selectedCategory
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-8 space-y-16">
      <HeroSection
        restaurant={restaurant}
        isInWatchlist={isInWatchlist}
        handleToggleWatchlist={handleToggleWatchlist}
      />

      <Separator className="my-10" />

      <section className="space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900">📜 Μενού</h2>
        <MenuCategoryTabs
          categories={menuCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <MenuItemsGrid dishes={filteredDishes} />
      </section>

      <Separator className="my-10" />

      <section className="space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900">🍽️ Special Menus</h2>
        <SpecialMenusGrid menus={restaurant.specialMenus} />
      </section>

      <Separator className="my-10" />

      <section className="space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900">🎁 Τα Κουπόνια μου</h2>
        <p className="text-lg text-gray-700">
          Έχεις <span className="font-bold text-primary">{loyaltyPoints}</span> πόντους.
        </p>
        <LoyaltyCouponsGrid
          coupons={restaurantCouponObjects}
          userCoupons={userCoupons}
          loyaltyPoints={loyaltyPoints}
          userId={user?.id}
          onPurchase={purchaseCoupon}
          isPurchasing={isPurchasing}
        />
      </section>

      <Separator className="my-10" />

      <ReservationForm
        reservation={reservation}
        setReservation={setReservation}
        timeSlots={timeSlots}
        restaurantSpecialMenus={restaurant.specialMenus}
        userCoupons={userCoupons}
        restaurant={restaurant}
        validMenus={validMenus}
        handleSpecialMenuChange={handleSpecialMenuChange}
        handleCouponChange={handleCouponChange}
        handleReserve={handleReserve}
        isSubmitting={isSubmitting}
      />

      <Separator className="my-10" />

      <div className="flex justify-center">
        <Button onClick={() => window.history.back()} className="bg-gray-500 text-white">
          ⬅ Επιστροφή
        </Button>
      </div>

      <ReservationDialogs
        errorDialog={errorDialog}
        setErrorDialog={setErrorDialog}
        confirmSubmit={confirmSubmit}
        setConfirmSubmit={setConfirmSubmit}
        onConfirmReservation={() => {
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
        isSubmitting={isSubmitting}
      />

      <HelpDialogButton />
    </div>
  );
};

export default RestaurantDetailsPage;
