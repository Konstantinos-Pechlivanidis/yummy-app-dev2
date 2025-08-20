// pages/owner/OwnerProfile.jsx
import { useEffect, useMemo, useState } from "react";
import { useOwnerProfile, useResendVerification } from "../../hooks/owner/useOwnerAuth";
import { useOwnerRestaurant, useUpdateOwnerContact } from "../../hooks/owner/useOwnerRestaurant";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { format } from "date-fns";
import toast from "react-hot-toast";

const safeFormatDate = (value) => {
  try {
    if (!value) return "Ημερομηνία μη διαθέσιμη";
    // backend uses created_at (snake), but keep compatibility if frontend stores camelCase
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Ημερομηνία μη διαθέσιμη";
    return format(d, "dd/MM/yyyy");
  } catch {
    return "Ημερομηνία μη διαθέσιμη";
  }
};

const OwnerProfile = () => {
  /* ---------- data ---------- */
  const { data: user, isLoading: loadingUser } = useOwnerProfile();
  const { data: restaurant, isLoading: loadingRestaurant } = useOwnerRestaurant();
  const { mutate: resendVerification, isPending: resending } = useResendVerification();

  const {
    mutate: updateContact,
    isPending: saving,
  } = useUpdateOwnerContact();

  /* ---------- local form state ---------- */
  const [ownerData, setOwnerData] = useState({ name: "", email: "", phone: "" });
  const [restaurantData, setRestaurantData] = useState({
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
  });

  useEffect(() => {
    if (user) {
      setOwnerData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (restaurant) {
      setRestaurantData({
        phone: restaurant?.contact?.phone || "",
        email: restaurant?.contact?.email || "",
        facebook: restaurant?.contact?.socialMedia?.facebook || "",
        instagram: restaurant?.contact?.socialMedia?.instagram || "",
      });
    }
  }, [restaurant]);

  const createdAt = useMemo(
    () => safeFormatDate(user?.created_at || user?.createdAt),
    [user]
  );

  /* ---------- handlers ---------- */
  const handleOwnerChange = (field, value) =>
    setOwnerData((prev) => ({ ...prev, [field]: value }));

  const handleRestaurantChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!restaurant?.id) {
      toast.error("Δεν βρέθηκε το εστιατόριο.");
      return;
    }

    updateContact(
      {
        id: restaurant.id,
        contact: {
          phone: restaurantData.phone?.trim() || null,
          email: restaurantData.email?.trim() || null,
          socialMedia: {
            facebook: restaurantData.facebook?.trim() || null,
            instagram: restaurantData.instagram?.trim() || null,
          },
        },
      },
      {
        onSuccess: () => toast.success("Οι αλλαγές αποθηκεύτηκαν."),
        onError: (err) => {
          const msg =
            err?.response?.data?.message || "Αποτυχία αποθήκευσης αλλαγών.";
          toast.error(msg);
        },
      }
    );
  };

  const handleResend = () => {
    if (!user?.email) return;
    resendVerification(user.email, {
      onSuccess: () => toast.success("Στάλθηκε ξανά email επιβεβαίωσης."),
      onError: () => toast.error("Η αποστολή απέτυχε."),
    });
  };

  /* ---------- loading ---------- */
  if (loadingUser || loadingRestaurant) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <p>Φόρτωση...</p>
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">👤 Προφίλ Ιδιοκτήτη</h1>

      {user && !user.confirmed_user && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative flex items-center justify-between gap-3">
          <span>📧 Δεν έχεις επιβεβαιώσει ακόμα το email σου.</span>
          <Button
            size="sm"
            className="bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Αποστολή..." : "Αποστολή ξανά"}
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* --------- Owner Card --------- */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">👤 Προφίλ Ιδιοκτήτη</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name">👤 Όνομα</Label>
              <Input
                id="name"
                value={ownerData.name}
                onChange={(e) => handleOwnerChange("name", e.target.value)}
                disabled
              />
            </div>

            <div>
              <Label htmlFor="email">📧 Email</Label>
              <Input
                id="email"
                value={ownerData.email}
                onChange={(e) => handleOwnerChange("email", e.target.value)}
                disabled
              />
            </div>

            <div>
              <Label htmlFor="phone">📞 Τηλέφωνο</Label>
              <Input
                id="phone"
                value={ownerData.phone}
                onChange={(e) => handleOwnerChange("phone", e.target.value)}
                disabled
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">🔐 Ρόλος</p>
                <p className="text-md font-semibold text-gray-800 capitalize">
                  {user?.role || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">🕒 Ημερομηνία Εγγραφής</p>
                <p className="text-md font-semibold text-gray-800">{createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --------- Restaurant Card --------- */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🏪 Προφίλ Καταστήματος</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>📛 Όνομα Εστιατορίου</Label>
              <p className="text-gray-700 mt-1">{restaurant?.name || "—"}</p>
            </div>

            <div>
              <Label>📍 Διεύθυνση</Label>
              <p className="text-gray-700 mt-1">
                {[
                  restaurant?.address?.street && `${restaurant.address.street} ${restaurant?.address?.number || ""}`,
                  restaurant?.address?.area,
                  restaurant?.address?.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>📞 Τηλέφωνο</Label>
                <Input name="phone" value={restaurantData.phone} onChange={handleRestaurantChange} />
              </div>
              <div>
                <Label>📧 Email</Label>
                <Input name="email" value={restaurantData.email} onChange={handleRestaurantChange} />
              </div>
            </div>

            <Separator />

            <div>
              <Label>🌐 Social Media</Label>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <FaFacebook className="text-blue-600" />
                  <Input
                    name="facebook"
                    placeholder="Facebook URL"
                    value={restaurantData.facebook}
                    onChange={handleRestaurantChange}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaInstagram className="text-pink-500" />
                  <Input
                    name="instagram"
                    placeholder="Instagram URL"
                    value={restaurantData.instagram}
                    onChange={handleRestaurantChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-primary text-white px-6 py-3"
            disabled={saving}
          >
            {saving ? "Αποθήκευση..." : "💾 Αποθήκευση Αλλαγών"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OwnerProfile;
