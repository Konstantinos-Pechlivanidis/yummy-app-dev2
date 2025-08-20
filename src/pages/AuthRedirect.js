import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/customer/useAuth"; // 👈 THE FIX: Use the unified hook
import PageLoading from "../components/PageLoading";
import toast from "react-hot-toast";

const AuthRedirect = () => {
  const navigate = useNavigate();
  // Use the single, unified auth status hook. It works for both customers and owners.
  const { data, isLoading, isError } = useAuthStatus();

  useEffect(() => {
    if (!isLoading && data) {
      if (data.loggedIn && data.user) {
        // Check the user's role from the successful auth check and navigate accordingly
        if (data.user.role === "owner") {
          navigate("/owner/dashboard", { replace: true });
        } else {
          // Default to the customer homepage for any other role
          navigate("/", { replace: true });
        }
      } else {
        // If not logged in for any reason, redirect to the main login page
        toast.error("Η αυτόματη σύνδεση απέτυχε. Παρακαλώ συνδεθείτε ξανά.");
        navigate("/login", { replace: true });
      }
    }
  }, [data, isLoading, navigate]);
  
  if (isError) {
      toast.error("Παρουσιάστηκε σφάλμα κατά τον έλεγχο της σύνδεσης.");
      navigate("/login", { replace: true });
  }

  // Display a loading indicator while the auth status is being checked
  return <PageLoading />;
};

export default AuthRedirect;