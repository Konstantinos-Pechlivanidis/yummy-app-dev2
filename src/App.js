import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/authSlice"; // Το slice του auth
import { users } from "./data/dummyData"; // Οι χρήστες από το dummy data
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoyaltyPage from "./pages/LoyaltyPage";
import ReserveTablePage from "./pages/ReserveTablePage";
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import ConfirmationPage from "./pages/Confirmation";
import ScrollToTop from "./lib/ScrollToTop";
import ProfilePage from "./pages/ProfilePage";
import OwnerDashboard from "./pages/OwnerDashboard";
import NotFound from "./pages/NotFound";
import OwnerProfile from "./pages/OwnerProfile";
import { Toaster } from "react-hot-toast";

// import Login from "./pages/Login";
// import NotFound from "./pages/NotFound";

function App() {
  // const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // **Auto-login με έναν προκαθορισμένο χρήστη**
  useEffect(() => {
    if (!isAuthenticated) {
      const testUser = users.find((u) => u.role === "owner"); // Επιλογή ενός τυχαίου πελάτη
      if (testUser) {
        dispatch(login({ email: testUser.email, password: testUser.password }));
      }
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#1f2937", // Gray-800
            border: "1px solid #e5e7eb", // Gray-200
            padding: "16px",
            fontSize: "16px",
            borderRadius: "12px",
            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
          },
          success: {
            icon: "✅",
            style: {
              background: "#ecfdf5",
              border: "1px solid #10b981", // Green-500
              color: "#065f46",
            },
          },
          error: {
            icon: "❌",
            style: {
              background: "#fef2f2",
              border: "1px solid #ef4444", // Red-500
              color: "#991b1b",
            },
          },
        }}
      />
      <ScrollToTop />
      <Navbar />
      <div className="pt-16">
        <Routes>
          
          {/* <Route path="/login" element={<Login />} /> */}

          {isAuthenticated && user.role === "customer" && (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/reserve" element={<ReserveTablePage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
              <Route path="/loyalty" element={<LoyaltyPage />} />
              <Route path="/my-reservations" element={<MyReservationsPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </>
          )}

          {isAuthenticated && user.role === "owner" && (
            <>
              <Route path="/" element={<OwnerDashboard />} />
              <Route path="/profile" element={<OwnerProfile />} />
            </>
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
