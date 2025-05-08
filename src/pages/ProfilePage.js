import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import {
  useUpdateUser,
  useFavoriteRestaurants,
  useToggleWatchlist,
} from "../hooks/useDummyData";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Pencil, LogOut, Camera, Trash2 } from "lucide-react";
import Loading from "../components/Loading";

const ProfilePage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    restaurantId: null,
  });
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
  });

  const { data: favoriteRestaurants = [], isLoading } = useFavoriteRestaurants(user?.id);
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: toggleWatchlist } = useToggleWatchlist();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center text-gray-600">
        ❌ Πρέπει να συνδεθείς για να δεις το προφίλ σου.
      </div>
    );
  }

  const handleUpdateProfile = () => {
    updateUser({
      userId: user.id,
      updates: updatedUser,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRemoveFavorite = (restaurantId) => {
    toggleWatchlist({ userId: user.id, restaurantId });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">👤 Το Προφίλ μου</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start md:justify-center gap-8">
        {/* Profile Card */}
        <Card className="w-full md:w-1/3 shadow-xl p-6 text-center">
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={user.profileImage || "/images/default-avatar.jpg"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
            />
            <label className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full cursor-pointer">
              <Camera className="w-5 h-5" />
              <input type="file" className="hidden" />
            </label>
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-bold mt-4">{user.name}</CardTitle>
            <p className="text-gray-500">{user.email}</p>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-500 px-3 py-2 text-lg">
              🎟️ Loyalty Points: {user.loyaltyPoints}
            </Badge>
            <div className="mt-4 flex justify-center gap-4">
              <Button className="bg-gray-500 text-white" onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" /> Επεξεργασία
              </Button>
              <Button className="bg-red-500 text-white" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Αποσύνδεση
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Restaurants */}
        <Card className="w-full md:w-2/3 shadow-lg p-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">🍽️ Αγαπημένα Εστιατόρια</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loading />
            ) : favoriteRestaurants.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteRestaurants.map((resto) => (
                  <li
                    key={resto.id}
                    className="flex items-center justify-between gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={resto.photos[0]}
                        alt={resto.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{resto.name}</p>
                        <p className="text-sm text-gray-500">{resto.location}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:bg-red-100"
                      onClick={() =>
                        setConfirmDialog({ open: true, restaurantId: resto.id })
                      }
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Δεν έχεις προσθέσει αγαπημένα εστιατόρια.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Editing Profile */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>✏️ Επεξεργασία Προφίλ</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-600">Όνομα</label>
              <Input
                value={updatedUser.name}
                onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600">Email</label>
              <Input
                value={updatedUser.email}
                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-600">Τηλέφωνο</label>
              <Input
                value={updatedUser.phone}
                onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              ❌ Ακύρωση
            </Button>
            <Button className="bg-green-600 text-white" onClick={handleUpdateProfile}>
              ✅ Αποθήκευση
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Watchlist Removal */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>❗ Επιβεβαίωση</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">
            Θέλεις σίγουρα να αφαιρέσεις το εστιατόριο από τα αγαπημένα;
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, restaurantId: null })}
            >
              ❌ Άκυρο
            </Button>
            <Button
              className="bg-red-600 text-white"
              onClick={() => {
                handleRemoveFavorite(confirmDialog.restaurantId);
                setConfirmDialog({ open: false, restaurantId: null });
              }}
            >
              ✅ Αφαίρεση
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
