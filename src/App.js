import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/authSlice";
import { users } from "./data/dummyData";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/customer/HomePage";
import LoyaltyPage from "./pages/customer/LoyaltyPage";
import ReserveTablePage from "./pages/customer/ReserveTablePage";
import RestaurantDetailsPage from "./pages/customer/RestaurantDetailsPage";
import MyReservationsPage from "./pages/customer/MyReservationsPage";
import ConfirmationPage from "./pages/customer/Confirmation";
import ScrollToTop from "./lib/ScrollToTop";
import ProfilePage from "./pages/customer/ProfilePage";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProfile from "./pages/owner/OwnerProfile";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

// ✅ Περιλαμβάνει redirect λογική και προστατευμένα routes
const AppRoutes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  // Auto-login για testing
  useEffect(() => {
    if (!isAuthenticated) {
      const testUser = users.find((u) => u.role === "customer");
      if (testUser) {
        dispatch(login({ email: testUser.email, password: testUser.password }));
      }
    }

    const timeout = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timeout);
  }, [dispatch, isAuthenticated]);

  // ✅ Redirect owner από public routes
  useEffect(() => {
    if (isAuthenticated && user?.role === "owner") {
      const publicPaths = ["/", "/reserve", "/restaurant"];
      const isPublicPath = publicPaths.some(
        (path) =>
          location.pathname === path || location.pathname.startsWith(`${path}/`)
      );
      if (isPublicPath) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, location, navigate]);

  // Προστασία από flash 404
  if (loading) return null;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/reserve" element={<ReserveTablePage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />

      {/* Customer-only routes */}
      {isAuthenticated && user?.role === "customer" && (
        <>
          <Route path="/loyalty" element={<LoyaltyPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
          <Route path="/confirmation/:id" element={<ConfirmationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </>
      )}

      {/* Owner-only routes */}
      {isAuthenticated && user?.role === "owner" && (
        <>
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/profile" element={<OwnerProfile />} />
        </>
      )}

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            padding: "16px",
            fontSize: "16px",
            borderRadius: "12px",
            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
          },
          success: {
            icon: "✅",
            style: {
              background: "#ecfdf5",
              border: "1px solid #10b981",
              color: "#065f46",
            },
          },
          error: {
            icon: "❌",
            style: {
              background: "#fef2f2",
              border: "1px solid #ef4444",
              color: "#991b1b",
            },
          },
        }}
      />

      <ScrollToTop />
      <Navbar />
      <div className="pt-16">
        <AppRoutes />
      </div>
      <Footer />
    </Router>
  );
}

export default App;
