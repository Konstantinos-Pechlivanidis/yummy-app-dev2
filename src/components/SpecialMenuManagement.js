import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "./ui/dialog";
import { Table, TableHead, TableRow, TableCell, TableBody } from "./ui/table";
import { addSpecialMenu, removeSpecialMenu } from "../store/specialMenuSlice";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { TabsContent } from "./ui/tabs";

const SpecialMenuManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const specialMenus = useSelector((state) => state.specialMenus.specialMenus);
  const restaurants = useSelector((state) => state.menus.restaurants);
  const menuItems = useSelector((state) => state.menus.menuItems);

  const ownerRestaurant = restaurants.find((r) => r.ownerId === user.id);
  const restaurantSpecialMenus = specialMenus.filter((menu) => menu.restaurantId === ownerRestaurant?.id);
  const availableItems = menuItems.filter((item) => item.restaurantId === ownerRestaurant?.id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    discountedPrice: "",
    timeRange: { start: "12:00", end: "16:00" },
  });

  const openDialog = () => {
    setIsDialogOpen(true);
    setSelectedItems([]);
    setMenuData({
      name: "",
      description: "",
      discountedPrice: "",
      timeRange: { start: "12:00", end: "16:00" },
    });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItems([]);
  };

  const handleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSave = () => {
    if (!menuData.name || !menuData.description || !menuData.discountedPrice || selectedItems.length === 0) return;

    dispatch(
      addSpecialMenu({
        restaurantId: ownerRestaurant.id,
        name: menuData.name,
        description: menuData.description,
        selectedItems: menuItems.filter((item) => selectedItems.includes(item.id)),
        discountedPrice: parseFloat(menuData.discountedPrice),
        timeRange: menuData.timeRange,
      })
    );

    closeDialog();
  };

  return (
    <section>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Διαχείριση Special Menus</h2>
        <Button className="bg-green-500 text-white flex items-center" onClick={openDialog}>
          <PlusCircle className="mr-2" /> Δημιουργία Special Menu
        </Button>
      </div>

      {/* Responsive Layout */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell>Όνομα</TableCell>
              <TableCell>Περιγραφή</TableCell>
              <TableCell>Αρχική Τιμή</TableCell>
              <TableCell>Τελική Τιμή</TableCell>
              <TableCell>Ώρες Ισχύος</TableCell>
              <TableCell>Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurantSpecialMenus.map((menu) => (
              <TableRow key={menu.id}>
                <TableCell>{menu.name}</TableCell>
                <TableCell>{menu.description}</TableCell>
                <TableCell>€{menu.originalPrice}</TableCell>
                <TableCell>€{menu.discountedPrice}</TableCell>
                <TableCell>{menu.timeRange.start} - {menu.timeRange.end}</TableCell>
                <TableCell>
                  <Button className="bg-red-500 text-white" onClick={() => dispatch(removeSpecialMenu(menu.id))}>
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
        {restaurantSpecialMenus.map((menu) => (
          <div key={menu.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{menu.name}</h3>
            <p className="text-gray-600">{menu.description}</p>
            <p className="text-gray-600">💰 Αρχική Τιμή: €{menu.originalPrice}</p>
            <p className="text-gray-600">🎯 Τελική Τιμή: €{menu.discountedPrice}</p>
            <p className="text-gray-600">⏳ Ώρες Ισχύος: {menu.timeRange.start} - {menu.timeRange.end}</p>
            <Button className="bg-red-500 text-white flex-1" onClick={() => dispatch(removeSpecialMenu(menu.id))}>
              <Trash className="w-4 h-4" /> Διαγραφή
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-bold">Δημιουργία Special Menu</h2>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Input placeholder="Όνομα" value={menuData.name} onChange={(e) => setMenuData({ ...menuData, name: e.target.value })} />
            <Input placeholder="Περιγραφή" value={menuData.description} onChange={(e) => setMenuData({ ...menuData, description: e.target.value })} />
            <Input type="number" placeholder="Τελική Τιμή (€)" value={menuData.discountedPrice} onChange={(e) => setMenuData({ ...menuData, discountedPrice: e.target.value })} />

            <h3 className="font-semibold mb-2">Επιλογή Πιάτων:</h3>
            {availableItems.map((item) => (
              <label key={item.id} className="flex items-center space-x-2">
                <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => handleItemSelection(item.id)} />
                <span>{item.name} (€{item.price})</span>
              </label>
            ))}

            <h3 className="font-semibold mb-2">Ωράριο Ισχύος:</h3>
            <Select value={menuData.timeRange.start} onValueChange={(value) => setMenuData({ ...menuData, timeRange: { ...menuData.timeRange, start: value } })}>
              <SelectTrigger><SelectValue placeholder="Έναρξη" /></SelectTrigger>
              <SelectContent>
                {["12:00", "14:00", "16:00", "18:00", "20:00"].map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="bg-green-500 text-white" onClick={handleSave}>Αποθήκευση</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SpecialMenuManagement;
