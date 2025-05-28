import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "react-hot-toast";

const LoyaltyCouponsGrid = ({
  coupons = [],
  userCoupons = [],
  loyalty_points = 0,
  user_id,
  onPurchase,
  isPurchasing,
}) => {
  const [, setSelectedCoupon] = useState(null);

  if (!coupons.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
      {coupons.map((coupon) => {
        const isPurchased = userCoupons.some((uc) => uc.id === coupon.id);

        return (
          <Card
            key={coupon.id}
            className={`overflow-hidden border transition-all duration-300 rounded-2xl shadow-md hover:shadow-xl ${
              isPurchased
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <CardHeader className="pb-0">
              <CardTitle
                className={`text-base sm:text-lg font-semibold ${
                  isPurchased ? "text-green-700" : "text-blue-700"
                }`}
              >
                🎟️ Κουπόνι Ανταμοιβής
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 text-sm sm:text-base text-gray-700">
              <p>{coupon.description}</p>
              <p className="text-gray-600">
                Απαραίτητοι πόντοι:{" "}
                <span className="font-bold text-gray-900">
                  {coupon.required_points}
                </span>
              </p>

              {isPurchased ? (
                <Button
                  disabled
                  className="w-full bg-green-600 text-white font-semibold cursor-default"
                >
                  Το έχεις ήδη αγοράσει
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      disabled={loyalty_points < coupon.required_points}
                      onClick={() => setSelectedCoupon(coupon)}
                    >
                      Αγορά Κουπονιού
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl font-bold">
                        🛒 Επιβεβαίωση Αγοράς
                      </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-800 mb-4 text-sm sm:text-base leading-relaxed">
                      Θέλεις να εξαργυρώσεις{" "}
                      <strong>{coupon.required_points} πόντους</strong> για αυτό
                      το κουπόνι;
                    </p>
                    <div className="flex justify-end gap-3 mt-2">
                      <DialogTrigger asChild>
                        <Button variant="outline">Άκυρο</Button>
                      </DialogTrigger>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                          onPurchase(coupon.id, {
                            onSuccess: () =>
                              toast.success(
                                "Η αγορά ολοκληρώθηκε με επιτυχία!"
                              ),
                          })
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
  );
};

export default LoyaltyCouponsGrid;
