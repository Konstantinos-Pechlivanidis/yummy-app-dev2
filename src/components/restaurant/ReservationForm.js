import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { isValid, format } from "date-fns";

const ReservationForm = ({
  reservation,
  setReservation,
  timeSlots,
  restaurantSpecialMenus,
  userCoupons,
  restaurant,
  validMenus,
  handleSpecialMenuChange,
  handleCouponChange,
  handleReserve,
  isSubmitting,
}) => {
  const selectedDate = isValid(reservation.date)
    ? format(reservation.date, "yyyy-MM-dd")
    : null;

  const selectedTime = reservation.time;

  return (
    <section className="space-y-8 bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
        📅 Κάνε την Κράτησή σου
      </h2>

      {/* Ημερομηνία - Ώρα - Άτομα */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-sm sm:text-base py-2.5">
              {isValid(reservation.date)
                ? format(reservation.date, "dd/MM/yyyy")
                : "Ημερομηνία"}
              <CalendarIcon className="ml-2 h-4 w-4" />
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
          onValueChange={(value) => setReservation({ ...reservation, time: value })}
        >
          <SelectTrigger className="w-full text-sm sm:text-base py-2.5">
            <SelectValue placeholder="Ώρα" />
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
          onChange={(e) => setReservation({ ...reservation, guests: e.target.value })}
          className="w-full text-sm sm:text-base py-2.5"
        />
      </div>

      {/* Special Menu */}
      <div className="space-y-2">
        <h3 className="text-sm sm:text-base font-semibold">🍽️ Special Menu</h3>
        {restaurantSpecialMenus.length === 0 ? (
          <p className="text-sm text-gray-600 italic">
            ❌ Δεν υπάρχουν διαθέσιμα Special Menus για αυτό το εστιατόριο.
          </p>
        ) : !selectedDate || !selectedTime ? (
          <p className="text-sm text-gray-600 italic">
            ⏳ Επιλέξτε πρώτα ημερομηνία και ώρα για να δείτε διαθέσιμα Special Menus.
          </p>
        ) : validMenus.length === 0 ? (
          <p className="text-sm text-gray-600 italic">
            ❌ Δεν υπάρχουν διαθέσιμα Special Menus για την επιλεγμένη ημέρα και ώρα.
          </p>
        ) : (
          <Select value={reservation.specialMenu} onValueChange={handleSpecialMenuChange}>
            <SelectTrigger className="w-full text-sm sm:text-base py-2.5">
              <SelectValue placeholder="Επιλέξτε Special Menu" />
            </SelectTrigger>
            <SelectContent>
              {validMenus.map((menu) => (
                <SelectItem key={menu.id} value={menu.id}>
                  {menu.name} – €{menu.discounted_price} ({menu.discount_percentage}% έκπτωση)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Coupon */}
      <div className="space-y-2">
        <h3 className="text-sm sm:text-base font-semibold">🎟️ Χρήση Κουπονιού</h3>
        {userCoupons.filter((c) => c.restaurant_id === restaurant.id).length === 0 ? (
          <p className="text-sm text-gray-600 italic">
            💰 Δεν έχεις αγοράσει κουπόνια για αυτό το εστιατόριο.
          </p>
        ) : (
          <Select value={reservation.coupon} onValueChange={handleCouponChange}>
            <SelectTrigger className="w-full text-sm sm:text-base py-2.5">
              <SelectValue placeholder="Επιλέξτε Κουπόνι" />
            </SelectTrigger>
            <SelectContent>
              {userCoupons
                .filter((c) => c.restaurant_id === restaurant.id)
                .map((coupon) => (
                  <SelectItem key={coupon.id} value={coupon.id}>
                    {coupon.description}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-semibold">📝 Σημειώσεις</h3>
        <div className="flex flex-wrap gap-2">
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
              className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-md border border-gray-300"
            >
              {note}
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          placeholder="Γράψε κάτι επιπλέον (π.χ. χωρίς σκαλιά, τραπέζι έξω...)"
          value={reservation.notes || ""}
          onChange={(e) => setReservation({ ...reservation, notes: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base"
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button
          className="w-full bg-primary text-white text-base py-4 font-semibold hover:shadow-md transition"
          onClick={handleReserve}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Υποβολή..." : "✅ Επιβεβαίωση Κράτησης"}
        </Button>
      </div>
    </section>
  );
};

export default ReservationForm;
