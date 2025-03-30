import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateProfile } from "../store/authSlice";
import { updateRestaurantProfile } from "../store/restaurantSlice";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { format } from "date-fns";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import toast from "react-hot-toast";

const OwnerProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const restaurants = useSelector((state) => state.menus.restaurants);

  const restaurant = restaurants.find((r) => r.ownerId === user?.id);

  const [ownerData, setOwnerData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  const [restaurantData, setRestaurantData] = useState({
    phone: restaurant?.contact?.phone || "",
    email: restaurant?.contact?.email || "",
    facebook: restaurant?.contact?.socialMedia?.facebook || "",
    instagram: restaurant?.contact?.socialMedia?.instagram || "",
  });

  const handleOwnerChange = (field, value) => {
    setOwnerData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRestaurantChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    console.log("submit");
    e.preventDefault();
    dispatch(updateProfile(ownerData));

    dispatch(
      updateRestaurantProfile({
        restaurantId: restaurant.id,
        phone: restaurantData.phone,
        email: restaurantData.email,
        socialMedia: {
          facebook: restaurantData.facebook,
          instagram: restaurantData.instagram,
        },
      })
    );

    toast.success("Το προφίλ ενημερώθηκε με επιτυχία!");
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* 👤 Κάρτα Ιδιοκτήτη */}
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
              />
            </div>

            <div>
              <Label htmlFor="email">📧 Email</Label>
              <Input
                id="email"
                value={ownerData.email}
                onChange={(e) => handleOwnerChange("email", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone">📞 Τηλέφωνο</Label>
              <Input
                id="phone"
                value={ownerData.phone}
                onChange={(e) => handleOwnerChange("phone", e.target.value)}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">🔐 Ρόλος</p>
                <p className="text-md font-semibold text-gray-800 capitalize">
                  {user.role}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">🕒 Ημερομηνία Εγγραφής</p>
                <p className="text-md font-semibold text-gray-800">
                  {format(new Date(user.createdAt), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🏪 Κάρτα Καταστήματος */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🏪 Προφίλ Καταστήματος</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>📛 Όνομα Εστιατορίου</Label>
              <p className="text-gray-700 mt-1">{restaurant.name}</p>
            </div>

            <div>
              <Label>📍 Διεύθυνση</Label>
              <p className="text-gray-700 mt-1">
                {restaurant.address.street} {restaurant.address.number},{" "}
                {restaurant.address.area}, {restaurant.address.postalCode}
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
          <Button type="submit" className="bg-primary text-white px-6 py-3">
            💾 Αποθήκευση Αλλαγών
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OwnerProfile;
