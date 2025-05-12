import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle, Edit, Trash, Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import {
  addMenuItem,
  removeMenuItem,
  editMenuItem,
  uploadMenuItemImage,
} from "../../store/menusSlice";
import { TabsContent } from "../ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

const MenuManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const menuItems = useSelector((state) => state.menus.menuItems);
  const restaurants = useSelector((state) => state.menus.restaurants);
  const ownerRestaurants = restaurants.filter((r) => r.ownerId === user.id);

  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState("");
  const [file, setFile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemData, setItemData] = useState({
    name: "",
    price: "",
    category: "",
    restaurantId: ownerRestaurants.length ? ownerRestaurants[0].id : "",
    photoUrl: "",
  });

  const openDialog = (item, action) => {
    setActionType(action);
    setIsDialogOpen(true);

    if (action === "add") {
      setItemData({
        name: "",
        price: "",
        category: "",
        restaurantId: ownerRestaurants.length ? ownerRestaurants[0].id : "",
        photoUrl: "",
      });
      setSelectedItem(null);
    } else {
      setItemData({
        name: item.name,
        price: item.price,
        category: item.category,
        restaurantId: item.restaurantId,
        photoUrl: item.photoUrl,
      });
      setSelectedItem(item);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
    setFile(null);
  };

  const handleSave = () => {
    if (actionType === "edit" && selectedItem) {
      dispatch(editMenuItem({ id: selectedItem.id, updatedData: itemData }));
    } else {
      dispatch(addMenuItem({ id: `item${menuItems.length + 1}`, ...itemData }));
    }
    closeDialog();
  };

  const handleUpload = () => {
    if (!file || !selectedItem) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(
        uploadMenuItemImage({ id: selectedItem.id, imageUrl: reader.result })
      );
      closeDialog();
    };
    reader.readAsDataURL(file);
  };

  return (
    <section>
      <div className="flex justify-end mb-4">
        <Button
          className="bg-green-500 text-white flex items-center"
          onClick={() => openDialog(null, "add")}
        >
          <PlusCircle className="mr-2" /> Προσθήκη Πιάτου
        </Button>
      </div>

      <div className="overflow-x-auto hidden md:block">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell>Πιάτο</TableCell>
              <TableCell>Τιμή</TableCell>
              <TableCell>Κατηγορία</TableCell>
              <TableCell>Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>€{item.price}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Button
                    className="bg-blue-500 text-white mr-2"
                    onClick={() => openDialog(item, "edit")}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    className="bg-red-500 text-white"
                    onClick={() => dispatch(removeMenuItem(item.id))}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
          >
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600">💰 Τιμή: €{item.price}</p>
            <p className="text-gray-600">📂 Κατηγορία: {item.category}</p>
            <div className="flex gap-2 mt-2">
              <Button
                className="bg-blue-500 text-white flex-1"
                onClick={() => openDialog(item, "edit")}
              >
                <Edit className="w-4 h-4" /> Επεξεργασία
              </Button>
              <Button
                className="bg-red-500 text-white flex-1"
                onClick={() => dispatch(removeMenuItem(item.id))}
              >
                <Trash className="w-4 h-4" /> Διαγραφή
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-bold">
              {actionType === "edit"
                ? "Επεξεργασία Πιάτου"
                : actionType === "upload"
                ? "Ανέβασμα Φωτογραφίας"
                : "Προσθήκη Νέου Πιάτου"}
            </h2>
          </DialogHeader>
          {actionType !== "upload" ? (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Όνομα"
                value={itemData.name}
                onChange={(e) =>
                  setItemData({ ...itemData, name: e.target.value })
                }
                className="border p-2 rounded-md"
              />
              <input
                type="number"
                placeholder="Τιμή"
                value={itemData.price}
                onChange={(e) =>
                  setItemData({ ...itemData, price: e.target.value })
                }
                className="border p-2 rounded-md"
              />
              <Select
                value={itemData.category}
                onValueChange={(value) =>
                  setItemData({ ...itemData, category: value })
                }
              >
                <SelectTrigger className="border p-2 rounded-md">
                  <SelectValue placeholder="Επιλέξτε κατηγορία" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ορεκτικά">Ορεκτικά</SelectItem>
                  <SelectItem value="Κυρίως Πιάτα">Κυρίως Πιάτα</SelectItem>
                  <SelectItem value="Επιδόρπια">Επιδόρπια</SelectItem>
                  <SelectItem value="Ποτά">Ποτά</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded-md"
            />
          )}
          <DialogFooter className="gap-2">
            <Button className="bg-gray-500 text-white" onClick={closeDialog}>
              Άκυρο
            </Button>
            <Button
              className="bg-green-500 text-white"
              onClick={actionType === "upload" ? handleUpload : handleSave}
            >
              {actionType === "upload" ? "Ανέβασμα" : "Αποθήκευση"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MenuManagement;
