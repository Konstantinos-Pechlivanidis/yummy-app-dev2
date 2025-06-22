import { useOwnerAuthStatus } from "../hooks/owner/useOwnerAuth";
import { useAuthStatus } from "../hooks/customer/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const AuthRedirect = ({ role = "customer" }) => {
  const navigate = useNavigate();

  // Χρησιμοποιούμε και τα δύο hooks πάντα
  const ownerStatus = useOwnerAuthStatus();
  const customerStatus = useAuthStatus();

  // Επιλέγουμε το σωστό status μετά την κλήση των hooks
  const authStatus = role === "owner" ? ownerStatus : customerStatus;
  const { data, isLoading } = authStatus;

  useEffect(() => {
    if (!isLoading) {
      if (data?.loggedIn) {
        navigate(role === "owner" ? "/owner/dashboard" : "/");
      } else {
        navigate(role === "owner" ? "/owner/login" : "/login");
      }
    }
  }, [data, isLoading, navigate, role]);

  return <Loading />;
};

export default AuthRedirect;
