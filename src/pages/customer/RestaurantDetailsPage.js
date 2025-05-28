import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format, isValid } from "date-fns";
import { toast } from "react-hot-toast";

import { setSearchParams as setSearchParamsAction } from "../../store/searchSlice";

import { useRestaurantDetails } from "../../hooks/useRestaurants";
import { useCreateReservation } from "../../hooks/useReservations";
import { useUserPoints, useToggleFavorite } from "../../hooks/useAuth";
import {
  useUserCoupons,
  useAvailableCoupons,
  usePurchaseCoupon,
} from "../../hooks/useCoupons";

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
import SEOHelmet from "../../components/SEOHelmet";

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
    reservation_notes: "",
  });

  const [errorDialog, setErrorDialog] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: restaurantDetails, isLoading } = useRestaurantDetails(id);
  const restaurant = restaurantDetails?.restaurant;
  const menu_items = restaurantDetails?.menu_items ?? [];
  const special_menus = restaurantDetails?.special_menus ?? [];

  const { data: loyaltyData, isLoading: isLoadingPoints } = useUserPoints(
    user?.id
  );
  const loyalty_points = loyaltyData?.loyalty_points ?? 0;

  const { data: userCoupons = [], isLoading: isLoadingUserCoupons } =
    useUserCoupons();
  const { data: availableCoupons = [], isLoading: isLoadingAvailableCoupons } =
    useAvailableCoupons(id);

  const { mutate: createReservation, isPending: isSubmitting } =
    useCreateReservation();
  const { mutate: purchaseCoupon, isPending: isPurchasing } =
    usePurchaseCoupon();
  const { mutate: toggleFavorite } = useToggleFavorite();

  const menuCategories = useMemo(() => {
    return [
      ...new Set(menu_items.map((item) => item.category).filter(Boolean)),
    ];
  }, [menu_items]);

  useEffect(() => {
    if (!selectedCategory && menuCategories.length > 0) {
      setSelectedCategory(menuCategories[0]);
    }
  }, [menuCategories, selectedCategory]);

  const [inWatchlist, setInWatchlist] = useState(
    restaurant?.is_favorite === true
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

  const selectedDate = isValid(reservation.date)
    ? format(reservation.date, "yyyy-MM-dd")
    : null;
  const selectedDayEnglish = isValid(reservation.date)
    ? format(reservation.date, "EEEE")
    : null;
  const selectedTime = reservation.time;

  const validMenus = special_menus.filter((menu) => {
    const { availability } = menu;
    if (!availability || !selectedTime || !availability.timeRange) return false;

    const { type, timeRange, dates, daysOfWeek } = availability;
    const timeIsValid =
      selectedTime >= timeRange.start && selectedTime <= timeRange.end;

    if (type === "specific" && selectedDate) {
      return (
        Array.isArray(dates) && dates.includes(selectedDate) && timeIsValid
      );
    }
    if (type === "recurring" && selectedDayEnglish) {
      return (
        Array.isArray(daysOfWeek) &&
        daysOfWeek.includes(selectedDayEnglish) &&
        timeIsValid
      );
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

  const handleToggleWatchlist = () => {
    if (!user?.confirmed_user) {
      toast.error(
        "Πρέπει να έχεις επιβεβαιώσει τον λογαριασμό σου για να χρησιμοποιήσεις τη Watchlist."
      );
      return;
    }

    if (!restaurant?.id) {
      toast.error("Δεν υπάρχει διαθέσιμο ID για το εστιατόριο.");
      return;
    }

    toggleFavorite(restaurant.id, {
      onSuccess: (data) => {
        if (data?.added) {
          setInWatchlist(true);
        } else if (data?.removed) {
          setInWatchlist(false);
        }
      },
      onError: () => {
        toast.error("Αποτυχία ενημέρωσης Watchlist.");
      },
    });
  };

  const mergedCoupons = [
    ...(userCoupons ?? []),
    ...(availableCoupons ?? []).filter(
      (ac) => !(userCoupons ?? []).some((uc) => uc.id === ac.id)
    ),
  ];

  const usableUserCoupons = (userCoupons ?? []).filter(
    (c) => c.restaurant_id === restaurant.id && !c.is_used && !c.is_locked
  );

  const restaurantCouponObjects = mergedCoupons.filter(
    (coupon) => coupon.restaurant_id === restaurant.id
  );

  const filteredDishes = menu_items.filter(
    (dish) => dish.category === selectedCategory
  );

  return (
    <>
    <SEOHelmet
      title={`${restaurant.name} | Κράτηση στο Yummy`}
      description={`Δες το μενού, τις προσφορές και τις εκπτώσεις του ${restaurant.name} – Κάνε κράτηση εύκολα με Happy Hour ή κουπόνι!`}
      url={`https://yummy-app.gr/restaurant/${restaurant.id}`}
      image={restaurant.photos?.[0] || "https://yummy.gr/images/yummyLogo-2.png"}
    />
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-8 space-y-16">
      <HeroSection
        restaurant={restaurant}
        isInWatchlist={inWatchlist}
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
        <h2 className="text-3xl font-extrabold text-gray-900">
          🍽️ Special Menus
        </h2>
        <SpecialMenusGrid menus={special_menus} />
      </section>

      <Separator className="my-10" />

      <section className="space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900">
          🎁 Τα Κουπόνια μου
        </h2>
        <p className="text-lg text-gray-700">
          Έχεις <span className="font-bold text-primary">{loyalty_points}</span>{" "}
          πόντους.
        </p>
        <LoyaltyCouponsGrid
          coupons={restaurantCouponObjects}
          userCoupons={userCoupons}
          loyalty_points={loyalty_points}
          user_id={user?.id}
          onPurchase={purchaseCoupon}
          isPurchasing={isPurchasing}
        />
      </section>

      <Separator className="my-10" />

      <ReservationForm
        reservation={reservation}
        setReservation={setReservation}
        timeSlots={timeSlots}
        restaurantSpecialMenus={special_menus}
        userCoupons={usableUserCoupons}
        restaurant={restaurant}
        validMenus={validMenus}
        handleSpecialMenuChange={handleSpecialMenuChange}
        handleCouponChange={handleCouponChange}
        handleReserve={handleReserve}
        isSubmitting={isSubmitting}
      />

      <Separator className="my-10" />

      <div className="flex justify-center">
        <Button
          onClick={() => window.history.back()}
          className="bg-gray-500 text-white"
        >
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
              restaurant_id: restaurant.id,
              user_id: user.id,
              date: format(reservation.date, "yyyy-MM-dd"),
              time: reservation.time,
              guest_count: parseInt(reservation.guests, 10),
              special_menu_id: reservation.specialMenu,
              coupon_id: reservation.coupon,
              reservation_notes: reservation.reservation_notes,
            },
            {
              onSuccess: (created) => {
                navigate(`/confirmation/${created.id}`);
              },
            }
          );
        }}
        isSubmitting={isSubmitting}
      />

      <HelpDialogButton />
    </div>
    </>
  );
};

export default RestaurantDetailsPage;
