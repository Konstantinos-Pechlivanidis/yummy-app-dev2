import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { PlusCircle, Trash, CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Table, TableHead, TableRow, TableCell, TableBody } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { addSpecialMenu, removeSpecialMenu } from "../../store/specialMenuSlice";

const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

const greekDays = [
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
  "Κυριακή",
];

const SpecialMenuManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const special_menus = useSelector((state) => state.special_menus.special_menus);
  const restaurants = useSelector((state) => state.menus.restaurants);
  const menu_items = useSelector((state) => state.menus.menu_items);

  const ownerRestaurant = restaurants.find((r) => r.ownerId === user.id);
  const restaurantSpecialMenus = special_menus.filter(
    (m) => m.restaurant_id === ownerRestaurant?.id
  );
  const availableItems = menu_items.filter(
    (item) => item.restaurant_id === ownerRestaurant?.id
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    discounted_price: "",
    availability: {
      type: "specific",
      dates: [],
      daysOfWeek: [],
      timeRange: { start: "12:00", end: "16:00" },
    },
  });

  const openDialog = () => {
    setIsDialogOpen(true);
    setSelectedItems([]);
    setMenuData({
      name: "",
      description: "",
      discounted_price: "",
      availability: {
        type: "specific",
        dates: [],
        daysOfWeek: [],
        timeRange: { start: "12:00", end: "16:00" },
      },
    });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItems([]);
  };

  const toggleDay = (day) => {
    setMenuData((prev) => {
      const current = prev.availability.daysOfWeek;
      return {
        ...prev,
        availability: {
          ...prev.availability,
          daysOfWeek: current.includes(day)
            ? current.filter((d) => d !== day)
            : [...current, day],
        },
      };
    });
  };

  const handleSave = () => {
    const { name, description, discounted_price, availability } = menuData;

    if (!name || !description || !discounted_price || selectedItems.length === 0)
      return;

    dispatch(
      addSpecialMenu({
        restaurant_id: ownerRestaurant.id,
        name,
        description,
        discounted_price: parseFloat(discounted_price),
        selectedItems: availableItems
          .filter((item) => selectedItems.includes(item.id))
          .map((item) => ({ id: item.id, name: item.name })),
        availability,
      })
    );

    closeDialog();
  };

  const handleItemSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Διαχείριση Special Menus</h2>
        <Button className="bg-green-600 text-white" onClick={openDialog}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Δημιουργία Special Menu
        </Button>
      </div>

      {/* Table */}
      <div className="hidden md:block">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Όνομα</TableCell>
              <TableCell>Περιγραφή</TableCell>
              <TableCell>Τιμή</TableCell>
              <TableCell>Ώρες</TableCell>
              <TableCell>Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurantSpecialMenus.map((menu) => (
              <TableRow key={menu.id}>
                <TableCell>{menu.name}</TableCell>
                <TableCell>{menu.description}</TableCell>
                <TableCell>€{menu.discounted_price}</TableCell>
                <TableCell>{menu.availability.type}</TableCell>
                <TableCell>
                  {menu.availability.type === "specific" &&
                    menu.availability.dates?.join(", ")}
                  {menu.availability.type === "recurring" &&
                    menu.availability.daysOfWeek?.join(", ")}
                  {menu.availability.type === "permanent" && "Καθημερινά"}
                </TableCell>
                <TableCell>
                  {menu.availability.timeRange.start} –{" "}
                  {menu.availability.timeRange.end}
                </TableCell>
                <TableCell>
                  <Button
                    className="bg-red-500 text-white"
                    onClick={() => dispatch(removeSpecialMenu(menu.id))}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <h3 className="text-lg font-bold">Νέο Special Menu</h3>
          </DialogHeader>

          <div className="space-y-4">
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
              placeholder="Τιμή (€)"
              type="number"
              value={menuData.discounted_price}
              onChange={(e) =>
                setMenuData({ ...menuData, discounted_price: e.target.value })
              }
            />

            <div>
              <label className="text-sm font-semibold block mb-1">
                Επιλογή Πιάτων
              </label>
              {availableItems.map((item) => (
                <label key={item.id} className="flex gap-2 items-center mb-1">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleItemSelection(item.id)}
                  />
                  <span>
                    {item.name} (€{item.price})
                  </span>
                </label>
              ))}
            </div>

            {/* Availability Type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Τύπος Διαθεσιμότητας
              </label>
              <Select
                value={menuData.availability.type}
                onValueChange={(val) =>
                  setMenuData((prev) => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      type: val,
                      ...(val === "specific"
                        ? { dates: [] }
                        : val === "recurring"
                        ? { daysOfWeek: [] }
                        : {}),
                    },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="specific">
                    Συγκεκριμένες Ημερομηνίες
                  </SelectItem>
                  <SelectItem value="recurring">Επαναλαμβανόμενο</SelectItem>
                  <SelectItem value="permanent">Μόνιμο</SelectItem>
                </SelectContent>
              </Select>

              {/* Specific Dates */}
              {menuData.availability.type === "specific" && (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Επιλέξτε Ημερομηνίες
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Προσθήκη Ημερομηνίας
                        <CalendarIcon className="ml-auto w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={null}
                        onSelect={(date) =>
                          setMenuData((prev) => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              dates: [
                                ...new Set([
                                  ...prev.availability.dates,
                                  format(date, "yyyy-MM-dd"),
                                ]),
                              ],
                            },
                          }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="text-xs text-gray-500 mt-2">
                    {menuData.availability.dates?.join(", ")}
                  </div>
                </div>
              )}

              {/* Recurring Days */}
              {menuData.availability.type === "recurring" && (
                <div>
                  <label className="text-sm font-semibold block mb-1">
                    Επιλογή Ημερών
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {greekDays.map((day) => (
                      <Button
                        key={day}
                        variant={
                          menuData.availability.daysOfWeek.includes(day)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => toggleDay(day)}
                        className="text-sm"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Time Range */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-semibold block mb-1">
                  Ώρα Έναρξης
                </label>
                <Select
                  value={menuData.availability.timeRange.start}
                  onValueChange={(val) =>
                    setMenuData((prev) => ({
                      ...prev,
                      availability: {
                        ...prev.availability,
                        timeRange: {
                          ...prev.availability.timeRange,
                          start: val,
                        },
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold block mb-1">
                  Ώρα Λήξης
                </label>
                <Select
                  value={menuData.availability.timeRange.end}
                  onValueChange={(val) =>
                    setMenuData((prev) => ({
                      ...prev,
                      availability: {
                        ...prev.availability,
                        timeRange: {
                          ...prev.availability.timeRange,
                          end: val,
                        },
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="bg-green-600 text-white w-full"
              onClick={handleSave}
            >
              💾 Αποθήκευση Menu
            </Button>
          </div>

          <DialogFooter />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SpecialMenuManagement;
