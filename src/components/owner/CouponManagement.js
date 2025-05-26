import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "../ui/dialog";
import { Table, TableHead, TableRow, TableCell, TableBody } from "../ui/table";
import { addCoupon, removeCoupon } from "../../store/couponSlice";
import { Input } from "../ui/input";
import { TabsContent } from "../ui/tabs";

const CouponManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const coupons = useSelector((state) => state.coupons.coupons);
  const restaurants = useSelector((state) => state.menus.restaurants);

  const ownerRestaurant = restaurants.find((r) => r.ownerId === user.id);
  const restaurantCoupons = coupons.filter((coupon) => coupon.restaurant_id === ownerRestaurant?.id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [couponData, setCouponData] = useState({
    description: "",
    discount_percentage: "",
  });

  const openDialog = () => {
    setIsDialogOpen(true);
    setCouponData({ description: "", discount_percentage: "" });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    if (!couponData.description || !couponData.discount_percentage) return;

    dispatch(
      addCoupon({
        restaurant_id: ownerRestaurant.id,
        description: couponData.description,
        discount_percentage: parseFloat(couponData.discount_percentage),
      })
    );

    closeDialog();
  };

  return (
    <section>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Διαχείριση Κουπονιών</h2>
        <Button className="bg-green-500 text-white flex items-center" onClick={openDialog}>
          <PlusCircle className="mr-2" /> Δημιουργία Κουπονιού
        </Button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell>Περιγραφή</TableCell>
              <TableCell>Έκπτωση</TableCell>
              <TableCell>Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurantCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.description}</TableCell>
                <TableCell>{coupon.discount_percentage}%</TableCell>
                <TableCell>
                  <Button className="bg-red-500 text-white" onClick={() => dispatch(removeCoupon(coupon.id))}>
                    <Trash className="w-4 h-4" /> Διαγραφή
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {restaurantCoupons.map((coupon) => (
          <div key={coupon.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2">
            <p className="text-gray-600 font-semibold">📜 {coupon.description}</p>
            <p className="text-gray-600">💰 Έκπτωση: {coupon.discount_percentage}%</p>
            <Button className="bg-red-500 text-white flex-1" onClick={() => dispatch(removeCoupon(coupon.id))}>
              <Trash className="w-4 h-4" /> Διαγραφή
            </Button>
          </div>
        ))}
      </div>

      {/* Dialog για Δημιουργία Κουπονιού */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-bold">Δημιουργία Κουπονιού</h2>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input
              placeholder="Περιγραφή"
              value={couponData.description}
              onChange={(e) => setCouponData({ ...couponData, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Ποσοστό Έκπτωσης (%)"
              value={couponData.discount_percentage}
              onChange={(e) => setCouponData({ ...couponData, discount_percentage: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button className="bg-gray-500 text-white" onClick={closeDialog}>Άκυρο</Button>
            <Button className="bg-green-500 text-white" onClick={handleSave}>Αποθήκευση</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CouponManagement;
