import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "./ui/dialog";
import { Table, TableHead, TableRow, TableCell, TableBody } from "./ui/table";
import { addSpecialMenu, removeSpecialMenu } from "../store/specialMenuSlice";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TabsContent } from "./ui/tabs";

const SpecialMenuManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const specialMenus = useSelector((state) => state.specialMenus.specialMenus);
  const restaurants = useSelector((state) => state.menus.restaurants);
  const menuItems = useSelector((state) => state.menus.menuItems);

  const ownerRestaurant = restaurants.find((r) => r.ownerId === user.id);
  const restaurantSpecialMenus = specialMenus.filter(
    (menu) => menu.restaurantId === ownerRestaurant?.id
  );
  const availableItems = menuItems.filter(
    (item) => item.restaurantId === ownerRestaurant?.id
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    discountedPrice: "",
    selectedDate: null,
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
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };

  const handleSave = () => {
    if (
      !menuData.name ||
      !menuData.description ||
      !menuData.discountedPrice ||
      selectedItems.length === 0
    )
      return;

    dispatch(
      addSpecialMenu({
        restaurantId: ownerRestaurant.id,
        name: menuData.name,
        description: menuData.description,
        selectedItems: menuItems.filter((item) =>
          selectedItems.includes(item.id)
        ),
        discountedPrice: parseFloat(menuData.discountedPrice),
        selectedDate: menuData.selectedDate,
        timeRange: menuData.timeRange,
      })
    );

    closeDialog();
  };

  return (
    <section>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Διαχείριση Special Menus</h2>
        <Button
          className="bg-green-500 text-white flex items-center"
          onClick={openDialog}
        >
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
                <TableCell>
                  {menu.timeRange.start} - {menu.timeRange.end}
                </TableCell>
                <TableCell>
                  <Button
                    className="bg-red-500 text-white"
                    onClick={() => dispatch(removeSpecialMenu(menu.id))}
                  >
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
          <div
            key={menu.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
          >
            <h3 className="text-lg font-semibold">{menu.name}</h3>
            <p className="text-gray-600">{menu.description}</p>
            <p className="text-gray-600">
              💰 Αρχική Τιμή: €{menu.originalPrice}
            </p>
            <p className="text-gray-600">
              🎯 Τελική Τιμή: €{menu.discountedPrice}
            </p>
            <p className="text-gray-600">
              📅 Ημερομηνία:{" "}
              {menu.selectedDate
                ? format(new Date(menu.selectedDate), "dd/MM/yyyy")
                : "—"}
            </p>
            <p className="text-gray-600">
              ⏳ Ώρες Ισχύος: {menu.timeRange.start} - {menu.timeRange.end}
            </p>
            <Button
              className="bg-red-500 text-white flex-1"
              onClick={() => dispatch(removeSpecialMenu(menu.id))}
            >
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
            <Input
              placeholder="Όνομα"
              value={menuData.name}
              onChange={(e) =>
                setMenuData({ ...menuData, name: e.target.value })
              }
            />
            <Input
              placeholder="Περιγραφή"
              value={menuData.description}
              onChange={(e) =>
                setMenuData({ ...menuData, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Τελική Τιμή (€)"
              value={menuData.discountedPrice}
              onChange={(e) =>
                setMenuData({ ...menuData, discountedPrice: e.target.value })
              }
            />

            <h3 className="font-semibold mb-2">Επιλογή Πιάτων:</h3>
            {availableItems.map((item) => (
              <label key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleItemSelection(item.id)}
                />
                <span>
                  {item.name} (€{item.price})
                </span>
              </label>
            ))}
            <h3 className="font-semibold">Ημερομηνία Ισχύος:</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start w-full text-left font-normal"
                >
                  {menuData.selectedDate
                    ? format(menuData.selectedDate, "dd/MM/yyyy")
                    : "Επιλογή ημερομηνίας"}
                  <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={menuData.selectedDate}
                  onSelect={(date) =>
                    setMenuData({ ...menuData, selectedDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <h3 className="font-semibold mb-2">Ωράριο Ισχύος:</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Ώρα Έναρξης */}
              <div className="flex-1">
                <label className="text-sm text-gray-700 mb-1 block">
                  Έναρξη
                </label>
                <Select
                  value={menuData.timeRange.start}
                  onValueChange={(value) =>
                    setMenuData({
                      ...menuData,
                      timeRange: { ...menuData.timeRange, start: value },
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ώρα έναρξης" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ώρα Λήξης */}
              <div className="flex-1">
                <label className="text-sm text-gray-700 mb-1 block">Λήξη</label>
                <Select
                  value={menuData.timeRange.end}
                  onValueChange={(value) =>
                    setMenuData({
                      ...menuData,
                      timeRange: { ...menuData.timeRange, end: value },
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ώρα λήξης" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="bg-green-500 text-white" onClick={handleSave}>
              Αποθήκευση
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SpecialMenuManagement;
