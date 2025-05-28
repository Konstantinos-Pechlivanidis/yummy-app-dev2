import { useState } from "react";
import { motion } from "framer-motion";
import {
  useUserProfile,
  useUserPoints,
  useFavoriteRestaurants,
  useToggleFavorite,
  useLogout,
  useUpdateUser,
  useResendVerification,
} from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import FavoriteRestaurantsCard from "../../components/profile/FavoriteRestaurantsCard";
import PurchasedCouponRestaurantsSection from "../../components/profile/PurchasedCouponRestaurantsCard";
import { Heart, Ticket, Mail } from "lucide-react";
import toast from "react-hot-toast";
import SEOHelmet from "../../components/SEOHelmet";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const ITEMS_PER_PAGE = 6;

const ProfilePage = () => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { data: profile } = useUserProfile();
  const { data: points } = useUserPoints();
  const { data: favoritesData } = useFavoriteRestaurants(1, ITEMS_PER_PAGE);
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { mutate: logout } = useLogout();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: resendVerification, isLoading: resending } =
    useResendVerification();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    restaurant_id: null,
  });
  const [updatedUser, setUpdatedUser] = useState({
    name: profile?.name,
    email: profile?.email,
    phone: profile?.phone,
  });

  if (!profile)
    return <div className="text-center py-20">🔐 Δεν είσαι συνδεδεμένος.</div>;

  const handleUpdateProfile = () => {
    updateUser({ updates: updatedUser });
    setIsEditing(false);
  };

  const handleResendEmail = () => resendVerification(profile.email);
  const handleToggleFavorite = async (id) => {
    if (!id) {
      toast.error("Λείπει το ID του εστιατορίου.");
      return;
    }

    try {
      const result = await toggleFavorite(id);

      if (result?.added) {
        toast.success("Το εστιατόριο προστέθηκε στα αγαπημένα.");
      } else if (result?.removed) {
        toast.success("Το εστιατόριο αφαιρέθηκε από τα αγαπημένα.");
      }
    } catch (err) {
      toast.error("Αποτυχία ενημέρωσης αγαπημένων.");
    }
  };

  return (
    <>
      <SEOHelmet
        title="Το Προφίλ μου | Yummy App"
        description="Δες και διαχειρίσου τα αγαπημένα σου εστιατόρια, τα κουπόνια σου και τις προσωπικές πληροφορίες στο Yummy App."
        url="https://yummy-app.gr/profile"
        image="https://yummy-app.gr/images/yummyLogo-2.png"
      />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-8 space-y-16">
        {/* 🖼 Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center text-center rounded-3xl overflow-hidden shadow-xl">
          <img
            src="/images/wide8.jpg"
            alt="hero"
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/60 z-0" />
          <motion.div
            {...fadeIn}
            className="relative z-10 text-white px-4 flex flex-col items-center"
          >
            <div className="mb-6 relative flex items-center justify-center">
              <div className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full bg-white/25 blur-3xl z-0" />
              <img
                src="/images/yummyLogo-2.png"
                alt="Yummy Logo"
                className="h-40 w-40 md:h-48 md:w-48 object-contain relative z-10"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-xl">
              Το Προφίλ μου
            </h1>
          </motion.div>
        </section>

        {/* ✅ Email Confirmation Alert */}
        {!profile.confirmed_user && (
          <motion.div
            {...fadeIn}
            className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-5 py-4 rounded-lg flex items-start gap-4 shadow-sm"
          >
            <Mail className="w-5 h-5 mt-1 text-yellow-700" />
            <div className="flex-1 text-sm">
              <p className="font-medium">Δεν έχεις επιβεβαιώσει το email σου</p>
              <p className="mt-1">
                Επιβεβαίωσε το <strong>{profile.email}</strong> για να
                συνεχίσεις.
              </p>
              <Button
                onClick={handleResendEmail}
                className="mt-3"
                size="sm"
                variant="outline"
                disabled={resending}
              >
                {resending ? "Αποστολή..." : "Αποστολή ξανά"}
              </Button>
            </div>
          </motion.div>
        )}

        {/* 👤 Μοντέρνο Profile Section */}
        <motion.section
          {...fadeIn}
          className="border border-red-300 bg-gradient-to-br from-white to-red-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start justify-between gap-6 transition shadow-sm"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-red-800 flex items-center gap-2">
              👤 {profile.name}
            </h2>
            <p className="text-base text-gray-700">{profile.email}</p>
            <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold mt-2 w-fit">
              Πόντοι: {points?.loyalty_points ?? 0}
            </span>
          </div>

          <div className="flex gap-4 items-end md:items-center">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="text-red-600 border-red-300 hover:bg-red-100"
            >
              ✏️ Επεξεργασία
            </Button>
            <Button
              className="bg-red-600 text-white"
              onClick={() => setLogoutDialogOpen(true)}
            >
              🔓 Αποσύνδεση
            </Button>
          </div>
        </motion.section>

        {/* ❤️ Favorites */}
        <motion.section {...fadeIn} className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Heart className="text-pink-600" size={20} />
            Αγαπημένα Εστιατόρια
          </h2>
          <FavoriteRestaurantsCard
            favorites={favoritesData?.favoriteRestaurants || []}
            total={favoritesData?.Pagination?.total || 0}
            isLoading={!favoritesData}
            onConfirmRemove={(id) =>
              setConfirmDialog({ open: true, restaurant_id: id })
            }
          />
        </motion.section>

        {/* 🎫 Coupons */}
        <motion.section {...fadeIn} className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Ticket className="text-purple-600" size={20} />
            Τα Κουπόνια μου
          </h2>
          <PurchasedCouponRestaurantsSection user_id={profile.id} />
        </motion.section>

        {/* 📝 Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="space-y-6">
            <DialogHeader>
              <DialogTitle>✏️ Επεξεργασία Προφίλ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field === "name"
                      ? "Όνομα"
                      : field === "phone"
                      ? "Τηλέφωνο"
                      : "Email"}
                  </label>
                  <Input
                    value={updatedUser[field]}
                    onChange={(e) =>
                      setUpdatedUser((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                ❌ Άκυρο
              </Button>
              <Button
                className="bg-green-600 text-white"
                onClick={handleUpdateProfile}
              >
                ✅ Αποθήκευση
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ❗ Confirm Remove Dialog */}
        <Dialog
          open={confirmDialog.open}
          onOpenChange={(open) =>
            setConfirmDialog((prev) => ({ ...prev, open }))
          }
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
                onClick={() =>
                  setConfirmDialog({ open: false, restaurant_id: null })
                }
              >
                Άκυρο
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={async () => {
                  await handleToggleFavorite(confirmDialog.restaurant_id);
                  setConfirmDialog({ open: false, restaurant_id: null });
                }}
              >
                Αφαίρεση
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogContent className="space-y-4">
            <DialogHeader>
              <DialogTitle>❗ Επιβεβαίωση Αποσύνδεσης</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-700">
              Είσαι σίγουρος ότι θέλεις να αποσυνδεθείς από τον λογαριασμό σου;
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(false)}
              >
                Άκυρο
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={() => {
                  logout();
                  setLogoutDialogOpen(false);
                }}
              >
                Αποσύνδεση
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ProfilePage;
