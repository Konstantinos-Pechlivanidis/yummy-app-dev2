import { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./store/authSlice";
import { useAuthStatus } from "./hooks/customer/useAuth";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./lib/ScrollToTop";
import { Toaster } from "react-hot-toast";
import PageLoading from "./components/PageLoading";
import { showLoading, hideLoading } from "./store/loadingSlice";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ErrorBoundary";
import { TIME } from "./constants/times";

// Lazy load heavy pages for better performance
const HomePage = lazy(() => import("./pages/customer/HomePage"));
const LoyaltyPage = lazy(() => import("./pages/customer/LoyaltyPage"));
const ReserveTablePage = lazy(() => import("./pages/customer/ReserveTablePage"));
const RestaurantDetailsPage = lazy(() => import("./pages/customer/RestaurantDetailsPage"));
const MyReservationsPage = lazy(() => import("./pages/customer/MyReservationsPage"));
const ConfirmationPage = lazy(() => import("./pages/customer/Confirmation"));
const ProfilePage = lazy(() => import("./pages/customer/ProfilePage"));
const OwnerDashboard = lazy(() => import("./pages/owner/OwnerDashboard"));
const OwnerProfile = lazy(() => import("./pages/owner/OwnerProfile"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthRedirect = lazy(() => import("./pages/AuthRedirect"));
const ForgotPasswordPage = lazy(() => import("./pages/customer/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/customer/ResetPasswordPage"));
const OwnerLoginPage = lazy(() => import("./pages/owner/OwnerLoginPage"));

const LoadingHandler = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showLoading());
    const timeout = setTimeout(() => {
      dispatch(hideLoading());
    }, TIME.LOADING_TIMEOUT);
    return () => clearTimeout(timeout);
  }, [location.pathname, dispatch]);

  return null;
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useAuthStatus();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (data?.loggedIn) {
      dispatch(setUser(data.user));
    } else {
      dispatch(clearUser());
    }
  }, [data, dispatch]);

  if (isLoading) return <PageLoading />; // Show loading indicator while checking auth

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
      <Route path="/login-owner" element={<OwnerLoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

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
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
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
    <HelmetProvider>
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
        <main className="pt-16">
          <ErrorBoundary>
            {isLoading ? (
              <PageLoading />
            ) : (
              <Suspense fallback={<PageLoading />}>
                <AppRoutes />
              </Suspense>
            )}
          </ErrorBoundary>
        </main>
        <Footer />
      </Router>
    </HelmetProvider>
  );
}

export default App;
