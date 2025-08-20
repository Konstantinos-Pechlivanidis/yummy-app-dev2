// components/owner/SpecialMenuManagement.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { PlusCircle, Trash } from "lucide-react";

import { useOwnerRestaurant } from "../../hooks/owner/useOwnerRestaurant";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "../ui/dialog";
import { Table, TableHead, TableRow, TableCell, TableBody } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

// Reuseable axios instance settings (cookies for auth)
const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// simple 30-min slots if you later want time-based availability
const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

const SpecialMenuManagement = () => {
  const qc = useQueryClient();

  // Pull the owner’s restaurant, its special menus and menu items
  const { data: restaurant, isLoading, error } = useOwnerRestaurant();

  const specialMenus = restaurant?.special_menus ?? [];
  const menuItems = restaurant?.menu_items ?? [];
  const restaurantId = restaurant?.id;

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    discounted_price: "",
    availability: {
      type: "permanent", // "permanent" | "daysOfWeek" | "range"
      daysOfWeek: [], // e.g., ["Mon","Tue"] if you later implement it
      timeRange: { start: "12:00", end: "22:00" },
    },
  });

  // Mutations
  const createSpecialMenuMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/specialMenus", payload);
      return data?.specialMenu;
    },
  });

  const linkItemMutation = useMutation({
    mutationFn: async ({ special_menu_id, menu_item_id }) => {
      const { data } = await api.post("/special-menu-items", {
        special_menu_id,
        menu_item_id,
      });
      return data;
    },
  });

  const recomputePricesMutation = useMutation({
    // We PATCH discounted_price to itself (or same value) to trigger recompute on server
    mutationFn: async ({ id, discounted_price }) => {
      const { data } = await api.patch(`/specialMenus/${id}`, {
        discounted_price,
      });
      return data?.specialMenu;
    },
  });

  const deleteSpecialMenuMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/specialMenus/${id}`);
      return data;
    },
  });

  // Effects: basic error surfacing for initial load
  useEffect(() => {
    if (error) {
      toast.error(error?.response?.data?.message || "Αποτυχία φόρτωσης δεδομένων.");
    }
  }, [error]);

  const openDialog = () => {
    setIsDialogOpen(true);
    setSelectedItems([]);
    setMenuData({
      name: "",
      description: "",
      discounted_price: "",
      availability: { type: "permanent", daysOfWeek: [], timeRange: { start: "12:00", end: "22:00" } },
    });
  };
  const closeDialog = () => setIsDialogOpen(false);

  const handleToggleItem = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    if (!restaurantId) {
      toast.error("Δεν βρέθηκε το εστιατόριο.");
      return;
    }
    if (!menuData.name || !menuData.discounted_price || selectedItems.length === 0) {
      toast.error("Συμπληρώστε όνομα, τιμή προσφοράς και επιλέξτε τουλάχιστον ένα πιάτο.");
      return;
    }

    try {
      // 1) create special menu (server ignores client original/discount% and will recompute)
      const created = await createSpecialMenuMutation.mutateAsync({
        name: menuData.name.trim(),
        description: (menuData.description || "").trim() || null,
        discounted_price: parseFloat(menuData.discounted_price),
        photo_url: null,
        restaurant_id: restaurantId,
        availability: menuData.availability || null,
      });

      // 2) link selected items
      await Promise.all(
        selectedItems.map((menu_item_id) =>
          linkItemMutation.mutateAsync({ special_menu_id: created.id, menu_item_id })
        )
      );

      // 3) force recompute of original_price & discount_percentage after linking
      await recomputePricesMutation.mutateAsync({
        id: created.id,
        discounted_price: parseFloat(menuData.discounted_price),
      });

      // 4) refresh owner restaurant (so table updates)
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["ownerRestaurant"] }),
        qc.invalidateQueries({ queryKey: ["ownerOverview"] }),
      ]);

      toast.success("Το special menu δημιουργήθηκε!");
      closeDialog();
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        "Η δημιουργία special menu απέτυχε.";
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSpecialMenuMutation.mutateAsync(id);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["ownerRestaurant"] }),
        qc.invalidateQueries({ queryKey: ["ownerOverview"] }),
      ]);
      toast.success("Το special menu διαγράφηκε.");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Η διαγραφή απέτυχε.");
    }
  };

  const isSaving =
    createSpecialMenuMutation.isPending ||
    linkItemMutation.isPending ||
    recomputePricesMutation.isPending;

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Διαχείριση Special Menus</h2>
        <Button className="bg-green-600 text-white" onClick={openDialog}>
          <PlusCircle className="w-5 h-5 mr-2" /> Δημιουργία Special Menu
        </Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell>Όνομα</TableCell>
              <TableCell>Τιμή Προσφοράς</TableCell>
              <TableCell>Αρχική Τιμή</TableCell>
              <TableCell>Έκπτωση</TableCell>
              <TableCell className="text-right">Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Φόρτωση...</TableCell>
              </TableRow>
            ) : specialMenus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Δεν υπάρχουν special menus.
                </TableCell>
              </TableRow>
            ) : (
              specialMenus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>{menu.name}</TableCell>
                  <TableCell>€{menu.discounted_price}</TableCell>
                  <TableCell>€{menu.original_price ?? "—"}</TableCell>
                  <TableCell>{menu.discount_percentage ?? "—"}%</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(menu.id)}
                      disabled={deleteSpecialMenuMutation.isPending}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-4">
        {isLoading ? (
          <div className="text-center">Φόρτωση...</div>
        ) : specialMenus.length === 0 ? (
          <div className="text-center text-gray-500">Δεν υπάρχουν special menus.</div>
        ) : (
          specialMenus.map((menu) => (
            <div key={menu.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{menu.name}</h3>
              <p className="text-gray-600">💰 Προσφορά: €{menu.discounted_price}</p>
              <p className="text-gray-600">🏷️ Αρχική: €{menu.original_price ?? "—"}</p>
              <p className="text-gray-600">📉 Έκπτωση: {menu.discount_percentage ?? "—"}%</p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(menu.id)}
                  disabled={deleteSpecialMenuMutation.isPending}
                >
                  <Trash className="w-4 h-4 mr-1" /> Διαγραφή
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Νέο Special Menu</DialogTitle>
            <DialogDescription>
              Δημιουργήστε μια προσφορά συνδυάζοντας πιάτα από το μενού σας.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Input
              placeholder="Όνομα (π.χ. 'Μεσημεριανό Deal')"
              value={menuData.name}
              onChange={(e) => setMenuData({ ...menuData, name: e.target.value })}
            />
            <Input
              placeholder="Περιγραφή (προαιρετική)"
              value={menuData.description}
              onChange={(e) => setMenuData({ ...menuData, description: e.target.value })}
            />
            <Input
              placeholder="Τιμή Προσφοράς (€)"
              type="number"
              value={menuData.discounted_price}
              onChange={(e) => setMenuData({ ...menuData, discounted_price: e.target.value })}
            />

            {/* Availability skeleton (kept simple; backend stores JSONB) */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Διαθεσιμότητα</label>
              <Select
                value={menuData.availability?.type ?? "permanent"}
                onValueChange={(v) =>
                  setMenuData((m) => ({
                    ...m,
                    availability: { ...(m.availability || {}), type: v },
                  }))
                }
              >
                <SelectTrigger><SelectValue placeholder="Επιλέξτε τύπο" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Μόνιμο</SelectItem>
                  <SelectItem value="daysOfWeek">Ημέρες Εβδομάδας</SelectItem>
                  <SelectItem value="range">Εύρος Ώρας</SelectItem>
                </SelectContent>
              </Select>

              {/* Simple time range controls (optional) */}
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={menuData.availability?.timeRange?.start ?? "12:00"}
                  onValueChange={(v) =>
                    setMenuData((m) => ({
                      ...m,
                      availability: {
                        ...(m.availability || {}),
                        timeRange: { ...(m.availability?.timeRange || {}), start: v },
                      },
                    }))
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Έναρξη" /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={menuData.availability?.timeRange?.end ?? "22:00"}
                  onValueChange={(v) =>
                    setMenuData((m) => ({
                      ...m,
                      availability: {
                        ...(m.availability || {}),
                        timeRange: { ...(m.availability?.timeRange || {}), end: v },
                      },
                    }))
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Λήξη" /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items selection */}
            <div>
              <label className="text-sm font-medium block mb-2">Επιλογή Πιάτων</label>
              <div className="max-h-48 overflow-y-auto space-y-2 p-2 border rounded-md">
                {menuItems.map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleToggleItem(item.id)}
                    />
                    <span>{item.name} (€{item.price})</span>
                  </label>
                ))}
                {menuItems.length === 0 && (
                  <p className="text-sm text-gray-500">Δεν υπάρχουν διαθέσιμα πιάτα.</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Άκυρο</Button>
            <Button
              className="bg-green-600 text-white"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Αποθήκευση..." : "Αποθήκευση"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SpecialMenuManagement;
