/**
 * Protected Route Component
 * Wraps routes that require authentication and/or specific roles
 */

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authSlice";

/**
 * ProtectedRoute component that checks authentication and role
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} [props.requiredRole] - Required role ("customer", "owner", "admin")
 * @param {string} [props.fallbackPath] - Path to redirect to if not authorized (default: "/login")
 * @returns {JSX.Element} Either the children or a Navigate component
 */
export const ProtectedRoute = ({ children, requiredRole, fallbackPath = "/login" }) => {
  const user = useSelector(selectCurrentUser);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // If role is required and doesn't match, redirect to home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

