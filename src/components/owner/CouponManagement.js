// components/dashboard/CouponManagement.jsx
import { useEffect, useMemo, useState } from "react";
import { PlusCircle, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Table, TableHead, TableRow, TableCell, TableBody } from "../ui/table";
import { Input } from "../ui/input";
import toast from "react-hot-toast";

import { useOwnerRestaurant } from "../../hooks/owner/useOwnerRestaurant";
import {
  useCreateCoupon,
  useDeleteCoupon,
} from "../../hooks/customer/useCoupons";

const initialForm = {
  description: "",
  discount_percentage: "",
  required_points: "",
};

const CouponManagement = () => {
  /* --------------------------- data sources --------------------------- */
  const { data: restaurant, isLoading: loadingRestaurant } =
    useOwnerRestaurant();

  const coupons = useMemo(
    () => restaurant?.coupons ?? [],
    [restaurant?.coupons]
  );

  const {
    mutate: createCoupon,
    isPending: creating,
  } = useCreateCoupon();

  const {
    mutate: deleteCoupon,
    isPending: deletingGlobal, // overall pending; we’ll track per-id too for button UI
  } = useDeleteCoupon();

  /* ------------------------------ local ui ---------------------------- */
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [couponData, setCouponData] = useState(initialForm);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!isDialogOpen) setCouponData(initialForm);
  }, [isDialogOpen]);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const onChange = (key, val) => {
    setCouponData((prev) => ({ ...prev, [key]: val }));
  };

  /* ---------------------------- validations --------------------------- */
  const validate = () => {
    const { description, discount_percentage, required_points } = couponData;

    if (!restaurant?.id) {
      toast.error("Δεν βρέθηκε το εστιατόριο.");
      return false;
    }

    if (!description || description.trim().length < 3) {
      toast.error("Η περιγραφή πρέπει να έχει τουλάχιστον 3 χαρακτήρες.");
      return false;
    }

    const pct = Number(discount_percentage);
    if (!Number.isFinite(pct) || pct <= 0 || pct > 100) {
      toast.error("Το ποσοστό έκπτωσης πρέπει να είναι 1–100.");
      return false;
    }

    const points = Number(required_points);
    if (!Number.isInteger(points) || points < 0) {
      toast.error("Οι απαιτούμενοι πόντοι πρέπει να είναι μη αρνητικός ακέραιος.");
      return false;
    }

    return true;
  };

  /* ------------------------------ actions ----------------------------- */
  const handleSave = () => {
    if (!validate()) return;

    createCoupon(
      {
        restaurant_id: restaurant.id,
        description: couponData.description.trim(),
        discount_percentage: Number(couponData.discount_percentage),
        required_points: Number(couponData.required_points),
      },
      {
        onSuccess: () => {
          toast.success("Το κουπόνι δημιουργήθηκε με επιτυχία!");
          closeDialog();
        },
        onError: (err) => {
          const msg =
            err?.response?.data?.message || "Η δημιουργία απέτυχε.";
          toast.error(msg);
        },
      }
    );
  };

  const handleDelete = (couponId) => {
    setDeletingId(couponId);
    deleteCoupon(couponId, {
      onSuccess: () => toast.success("Το κουπόνι διαγράφηκε."),
      onError: (err) => {
        const msg =
          err?.response?.data?.message ||
          "Η διαγραφή απέτυχε.";
        toast.error(msg);
      },
      onSettled: () => setDeletingId(null),
    });
  };

  /* ------------------------------- render ----------------------------- */
  if (loadingRestaurant) {
    return <p>Φόρτωση...</p>;
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Διαχείριση Κουπονιών</h2>
        <Button
          className="bg-green-500 text-white flex items-center"
          onClick={openDialog}
          disabled={!restaurant?.id}
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Δημιουργία Κουπονιού
        </Button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell>Περιγραφή</TableCell>
              <TableCell>Έκπτωση (%)</TableCell>
              <TableCell>Απαιτούμενοι Πόντοι</TableCell>
              <TableCell className="text-right">Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  Δεν υπάρχουν κουπόνια.
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>{coupon.description}</TableCell>
                  <TableCell>{coupon.discount_percentage}%</TableCell>
                  <TableCell>{coupon.required_points}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      disabled={deletingGlobal || deletingId === coupon.id}
                    >
                      <Trash className="w-4 h-4 mr-1" />
                      {deletingId === coupon.id ? "Διαγραφή..." : "Διαγραφή"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {coupons.length === 0 ? (
          <div className="text-center text-gray-500">Δεν υπάρχουν κουπόνια.</div>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
            >
              <p className="font-semibold">📜 {coupon.description}</p>
              <p className="text-gray-600">💰 Έκπτωση: {coupon.discount_percentage}%</p>
              <p className="text-gray-600">⭐ Πόντοι: {coupon.required_points}</p>
              <Button
                variant="destructive"
                className="mt-2"
                onClick={() => handleDelete(coupon.id)}
                disabled={deletingGlobal || deletingId === coupon.id}
              >
                <Trash className="w-4 h-4 mr-1" />
                {deletingId === coupon.id ? "Διαγραφή..." : "Διαγραφή"}
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Dialog for Creating a Coupon */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Δημιουργία Νέου Κουπονιού</DialogTitle>
            <DialogDescription>
              Συμπληρώστε τα στοιχεία του κουπονιού που θέλετε να προσφέρετε.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Input
              placeholder="Περιγραφή (π.χ. 15% έκπτωση στα κυρίως)"
              value={couponData.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Ποσοστό Έκπτωσης (%)"
              value={couponData.discount_percentage}
              onChange={(e) => onChange("discount_percentage", e.target.value)}
              min={1}
              max={100}
            />
            <Input
              type="number"
              placeholder="Απαιτούμενοι Πόντοι"
              value={couponData.required_points}
              onChange={(e) => onChange("required_points", e.target.value)}
              min={0}
              step={1}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Άκυρο
            </Button>
            <Button
              className="bg-green-500 text-white"
              onClick={handleSave}
              disabled={creating}
            >
              {creating ? "Αποθήκευση..." : "Αποθήκευση"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CouponManagement;
