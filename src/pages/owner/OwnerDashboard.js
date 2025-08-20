import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import MenuManagement from "../../components/owner/MenuManagement";
import SpecialMenuManagement from "../../components/owner/SpecialMenuManagement";
import CouponManagement from "../../components/owner/CouponManagement";
import ReservationManagement from "../../components/owner/ReservationManagement";
import OverviewManagement from "../../components/owner/OverviewManagement";

const OwnerDashboard = () => {
  const { user, isAuthenticated } = useSelector(selectAuth);
  const navigate = useNavigate();

  if (!isAuthenticated || user?.role !== "owner") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-red-500 text-lg">
          ❌ Δεν έχετε πρόσβαση σε αυτήν τη σελίδα.
        </p>
        <Button
          className="mt-4 bg-gray-500 text-white"
          onClick={() => navigate("/")}
        >
          🏠 Επιστροφή στην Αρχική
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        📊 Πίνακας Διαχείρισης
      </h1>
      <Separator className="mb-6" />
      <Tabs defaultValue="overview">
        {/* Wrapper Section για τα Tabs */}
        <section className="bg-gray-100 py-4 px-3 rounded-lg shadow-md">
          <TabsList className="flex flex-wrap justify-center gap-1 md:gap-2 h-full">
            <TabsTrigger value="overview" className="text-md">
              🏠 Επισκόπηση
            </TabsTrigger>
            <TabsTrigger value="reservations" className="text-md">
              📅 Κρατήσεις
            </TabsTrigger>
            <TabsTrigger value="menu" className="text-md">
              🍽️ Μενού
            </TabsTrigger>
            <TabsTrigger value="special-menu" className="text-md">
              🍽️ Special Μενού
            </TabsTrigger>
            <TabsTrigger value="coupons" className="text-md">
              🎟️ Κουπόνια
            </TabsTrigger>
          </TabsList>
        </section>
        <Separator className="mb-6" />

        <TabsContent value="overview">
          <OverviewManagement />
        </TabsContent>

        <TabsContent value="reservations">
          <ReservationManagement />
        </TabsContent>

        <TabsContent value="menu">
          <MenuManagement />
        </TabsContent>

        <TabsContent value="special-menu">
          <SpecialMenuManagement />
        </TabsContent>

        <TabsContent value="coupons">
          <CouponManagement />
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default OwnerDashboard;
