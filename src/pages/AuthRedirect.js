// pages/AuthRedirect.jsx
import { useEffect } from "react";
import { useAuthStatus } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const AuthRedirect = () => {
  const { data, isLoading } = useAuthStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (data?.loggedIn) {
        navigate("/"); // ή "/profile" ή "/dashboard"
      } else {
        navigate("/login");
      }
    }
  }, [data, isLoading, navigate]);

  return <Loading />;
};

export default AuthRedirect;
