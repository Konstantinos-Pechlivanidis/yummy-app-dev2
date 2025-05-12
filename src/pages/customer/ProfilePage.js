import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import {
  useFavoriteRestaurants,
  useUpdateUser,
  useToggleWatchlist,
} from "../../hooks/useDummyData";
import ProfileCard from "../../components/profile/ProfileCard";
import FavoriteRestaurantsCard from "../../components/profile/FavoriteRestaurantsCard";
import PurchasedCouponRestaurantsSection from "../../components/profile/PurchasedCouponRestaurantsCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const ITEMS_PER_PAGE = 6;

const ProfilePage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, restaurantId: null });
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: { data: favoriteRestaurants = [], total = 0 } = {},
    isLoading,
  } = useFavoriteRestaurants(user?.id, currentPage, ITEMS_PER_PAGE);

  const { mutate: updateUser } = useUpdateUser();
  const { mutate: toggleWatchlist } = useToggleWatchlist();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center text-gray-600 text-lg">
        ❌ Πρέπει να συνδεθείς για να δεις το προφίλ σου.
      </div>
    );
  }

  const handleUpdateProfile = () => {
    updateUser({ userId: user.id, updates: updatedUser });
    setIsEditing(false);
  };

  const handleLogout = () => dispatch(logout());

  const handleRemoveFavorite = (restaurantId) =>
    toggleWatchlist({ userId: user.id, restaurantId });

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-10 space-y-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
        👤 Το Προφίλ μου
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="lg:col-span-2">
          <ProfileCard
            user={user}
            onEdit={() => setIsEditing(true)}
            onLogout={handleLogout}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <FavoriteRestaurantsCard
            favorites={favoriteRestaurants}
            total={total}
            isLoading={isLoading}
            onConfirmRemove={(id) => setConfirmDialog({ open: true, restaurantId: id })}
          />
        </div>
      </div>

      <PurchasedCouponRestaurantsSection userId={user.id} />

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="space-y-6">
          <DialogHeader>
            <DialogTitle>✏️ Επεξεργασία Προφίλ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {["name", "email", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field === "name" ? "Όνομα" : field === "phone" ? "Τηλέφωνο" : "Email"}
                </label>
                <Input
                  value={updatedUser[field]}
                  onChange={(e) =>
                    setUpdatedUser((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              ❌ Άκυρο
            </Button>
            <Button className="bg-green-600 text-white" onClick={handleUpdateProfile}>
              ✅ Αποθήκευση
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Removal Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>❗ Επιβεβαίωση Αφαίρεσης</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Θέλεις σίγουρα να αφαιρέσεις το εστιατόριο από τα αγαπημένα;
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, restaurantId: null })}
            >
              Άκυρο
            </Button>
            <Button
              className="bg-red-600 text-white"
              onClick={() => {
                handleRemoveFavorite(confirmDialog.restaurantId);
                setConfirmDialog({ open: false, restaurantId: null });
              }}
            >
              Αφαίρεση
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
