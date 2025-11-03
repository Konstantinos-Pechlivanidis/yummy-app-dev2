// components/dashboard/MenuManagement.jsx
import { useEffect, useMemo, useState } from "react";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableHead, TableRow, TableCell, TableBody } from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import toast from "react-hot-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOwnerRestaurant } from "../../hooks/owner/useOwnerRestaurant";
import { menuItemApi } from "../../config/api";
import { queryKeys } from "../../config/queryKeys";
import { translateApiError } from "../../utils/apiErrorHandler";

/* ----------------------------- helper fns ----------------------------- */
const initialItem = {
  name: "",
  price: "",
  category: "",
  description: "",
  discount: 0,
};

const categories = ["Ορεκτικά", "Κυρίως Πιάτα", "Επιδόρπια", "Ποτά"];

const validateItem = (item, hasRestaurant) => {
  if (!hasRestaurant) {
    toast.error("Δεν βρέθηκε το εστιατόριο.");
    return false;
  }
  if (!item.name?.trim()) {
    toast.error("Το όνομα είναι υποχρεωτικό.");
    return false;
  }
  const price = Number(item.price);
  if (!Number.isFinite(price) || price <= 0) {
    toast.error("Η τιμή πρέπει να είναι θετικός αριθμός.");
    return false;
  }
  if (!item.category) {
    toast.error("Η κατηγορία είναι υποχρεωτική.");
    return false;
  }
  const discount = Number(item.discount ?? 0);
  if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
    toast.error("Η έκπτωση πρέπει να είναι μεταξύ 0 και 100.");
    return false;
  }
  return true;
};

/* ------------------------------ component ------------------------------ */
const MenuManagement = () => {
  const queryClient = useQueryClient();

  // Owner restaurant (+ menu items)
  const { data: restaurant, isLoading: loadingRestaurant } = useOwnerRestaurant();
  const menuItems = useMemo(() => restaurant?.menu_items ?? [], [restaurant?.menu_items]);

  // Dialog + form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [itemData, setItemData] = useState(initialItem);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!isDialogOpen) {
      setItemData(initialItem);
      setIsEditMode(false);
      setCurrentId(null);
    }
  }, [isDialogOpen]);

  const openDialog = (item = null) => {
    if (item) {
      setIsEditMode(true);
      setCurrentId(item.id);
      setItemData({
        name: item.name || "",
        price: item.price || "",
        category: item.category || "",
        description: item.description || "",
        discount: item.discount ?? 0,
      });
    } else {
      setIsEditMode(false);
      setCurrentId(null);
      setItemData(initialItem);
    }
    setIsDialogOpen(true);
  };

  /* ------------------------------- mutations ------------------------------- */
  const { mutate: createItem, isPending: creating } = useMutation({
    mutationFn: async (payload) => {
      const { data } = await menuItemApi.post("/", payload);
      return data.menuItem || data.menu_item || data;
    },
    onSuccess: () => {
      toast.success("Το πιάτο δημιουργήθηκε με επιτυχία!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
      setIsDialogOpen(false);
    },
    onError: (err) => {
      toast.error(translateApiError(err, "owner"));
    },
  });

  const { mutate: updateItem, isPending: updating } = useMutation({
    mutationFn: async ({ id, ...patch }) => {
      // controller expects restaurant_id for ownership on update
      const { data } = await menuItemApi.patch(`/${id}`, patch);
      return data.menuItem || data.menu_item || data;
    },
    onSuccess: () => {
      toast.success("Το πιάτο ενημερώθηκε.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
      setIsDialogOpen(false);
    },
    onError: (err) => {
      toast.error(translateApiError(err, "owner"));
    },
  });

  const { mutate: deleteItem, isPending: deletingGlobal } = useMutation({
    mutationFn: async (id) => {
      // DELETE /menuItems/:id (ownership enforced server-side)
      await menuItemApi.delete(`/${id}`);
    },
    onSuccess: () => {
      toast.success("Το πιάτο διαγράφηκε.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerRestaurant(),
      });
    },
    onError: (err) => {
      toast.error(translateApiError(err, "owner"));
    },
    onSettled: () => setDeletingId(null),
  });

  /* -------------------------------- actions -------------------------------- */
  const handleSave = () => {
    const hasRestaurant = !!restaurant?.id;
    if (!validateItem(itemData, hasRestaurant)) return;

    const payload = {
      name: itemData.name.trim(),
      price: Number(itemData.price),
      category: itemData.category,
      description: itemData.description?.trim() || null,
      discount: Number(itemData.discount ?? 0),
      restaurant_id: restaurant.id, // required by backend on create & update
    };

    if (isEditMode && currentId) {
      updateItem({ id: currentId, ...payload });
    } else {
      createItem(payload);
    }
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    deleteItem(id);
  };

  /* --------------------------------- render -------------------------------- */
  if (loadingRestaurant) return <p>Φόρτωση...</p>;

  return (
    <section>
      <div className="flex justify-end mb-4">
        <Button
          className="bg-green-500 text-white flex items-center"
          onClick={() => openDialog()}
          disabled={!restaurant?.id}
        >
          <PlusCircle className="mr-2" /> Προσθήκη Πιάτου
        </Button>
      </div>

      {/* Desktop View */}
      <div className="overflow-x-auto hidden md:block">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell>Πιάτο</TableCell>
              <TableCell>Τιμή</TableCell>
              <TableCell>Κατηγορία</TableCell>
              <TableCell className="text-right">Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  Δεν υπάρχουν πιάτα.
                </TableCell>
              </TableRow>
            ) : (
              menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>€{Number(item.price).toFixed(2)}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => openDialog(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingGlobal || deletingId === item.id}
                    >
                      <Trash className="w-4 h-4" />
                      {deletingId === item.id ? " Διαγραφή..." : " Διαγραφή"}
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
        {menuItems.length === 0 ? (
          <div className="text-center text-gray-500">Δεν υπάρχουν πιάτα.</div>
        ) : (
          menuItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">💰 Τιμή: €{Number(item.price).toFixed(2)}</p>
              <p className="text-gray-600">📂 Κατηγορία: {item.category}</p>
              <div className="flex gap-2 mt-2">
                <Button className="bg-blue-500 text-white flex-1" onClick={() => openDialog(item)}>
                  <Edit className="w-4 h-4 mr-1" /> Επεξεργασία
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingGlobal || deletingId === item.id}
                >
                  <Trash className="w-4 h-4 mr-1" />
                  {deletingId === item.id ? "Διαγραφή..." : "Διαγραφή"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Επεξεργασία Πιάτου" : "Προσθήκη Νέου Πιάτου"}
            </DialogTitle>
            {!isEditMode && (
              <DialogDescription>
                Συμπληρώστε τα βασικά στοιχεία του πιάτου.
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Input
              placeholder="Όνομα"
              value={itemData.name}
              onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Τιμή"
              value={itemData.price}
              onChange={(e) => setItemData({ ...itemData, price: e.target.value })}
              step="0.01"
              min="0"
            />
            <Select
              value={itemData.category}
              onValueChange={(value) => setItemData({ ...itemData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε κατηγορία" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Περιγραφή (προαιρετικό)"
              value={itemData.description}
              onChange={(e) =>
                setItemData({ ...itemData, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Έκπτωση (%)"
              value={itemData.discount}
              onChange={(e) => setItemData({ ...itemData, discount: e.target.value })}
              min={0}
              max={100}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Άκυρο
            </Button>
            <Button
              className="bg-green-500 text-white"
              onClick={handleSave}
              disabled={creating || updating}
            >
              {creating || updating ? "Αποθήκευση..." : "Αποθήκευση"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MenuManagement;
