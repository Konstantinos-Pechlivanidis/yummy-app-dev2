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

// import Login from "./pages/Login";
// import NotFound from "./pages/NotFound";

function App() {
  // const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // **Auto-login με έναν προκαθορισμένο χρήστη**
  useEffect(() => {
    if (!isAuthenticated) {
      const testUser = users.find((u) => u.role === "customer"); // Επιλογή ενός τυχαίου πελάτη
      if (testUser) {
        dispatch(login({ email: testUser.email, password: testUser.password }));
      }
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <ScrollToTop/>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reserve" element={<ReserveTablePage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
          {/* <Route path="/login" element={<Login />} /> */}

  
          {isAuthenticated && user.role === "customer" && (
            <>
              <Route path="/loyalty" element={<LoyaltyPage />} />
              <Route path="/my-reservations" element={<MyReservationsPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </>
          )}

          {isAuthenticated && user.role === "owner" && (
            <>
              <Route path="/dashboard" element={<OwnerDashboard />} />
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
