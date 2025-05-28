import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./store/authSlice";
import { useAuthStatus } from "./hooks/useAuth";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./lib/ScrollToTop";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/customer/HomePage";
import LoyaltyPage from "./pages/customer/LoyaltyPage";
import ReserveTablePage from "./pages/customer/ReserveTablePage";
import RestaurantDetailsPage from "./pages/customer/RestaurantDetailsPage";
import MyReservationsPage from "./pages/customer/MyReservationsPage";
import ConfirmationPage from "./pages/customer/Confirmation";
import ProfilePage from "./pages/customer/ProfilePage";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProfile from "./pages/owner/OwnerProfile";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import AuthRedirect from "./pages/AuthRedirect";
import { showLoading, hideLoading } from "./store/loadingSlice";
import PageLoading from "./components/PageLoading";

const LoadingHandler = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showLoading());

    const timeout = setTimeout(() => {
      dispatch(hideLoading());
    }, 3000);

    return () => clearTimeout(timeout);
  }, [location.pathname, dispatch]);

  return null;
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isLoading } = useAuthStatus();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (data?.loggedIn) {
      dispatch(setUser(data.user));
    } else {
      dispatch(clearUser());
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (user?.role === "owner") {
      const publicPaths = ["/", "/reserve", "/restaurant"];
      const isPublic = publicPaths.some((p) =>
        location.pathname === p || location.pathname.startsWith(`${p}/`)
      );
      if (isPublic) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  if (isLoading) return null;

  const isAuthenticated = !!user;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/auth-redirect" element={<AuthRedirect />} />
      <Route path="/reserve" element={<ReserveTablePage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Only */}
      {isAuthenticated && user.role === "customer" && (
        <>
          <Route path="/loyalty" element={<LoyaltyPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
          <Route path="/confirmation/:id" element={<ConfirmationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </>
      )}

      {/* Owner Only */}
      {isAuthenticated && user.role === "owner" && (
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
  const isLoading = useSelector((state) => state.loading.isLoading);
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
      <LoadingHandler />
      <Navbar />
      <div className="pt-16">
      {isLoading ? <PageLoading /> : <AppRoutes />}
      </div>
      <Footer />
    </Router>
  );
}

export default App;
