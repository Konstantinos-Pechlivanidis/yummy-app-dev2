import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { users } from "../data/dummyData";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Reserve a Table", path: "/reserve" },
  ];

  const customerLinks = [
    { name: "Home", path: "/" },
    { name: "Reserve a Table", path: "/reserve" },
    { name: "My Reservations", path: "/my-reservations" },
    { name: "Profile", path: "/profile" },
  ];

  const ownerLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderLinks = () => {
    if (!isAuthenticated) return publicLinks;
    if (user.role === "customer") return customerLinks;
    if (user.role === "owner") return ownerLinks;
    return [];
  };

  const logoLink = isAuthenticated && user?.role === "owner" ? "/dashboard" : "/";

  const handleSwitchRole = (role) => {
    const demoUser = users.find((u) => u.role === role);
    if (demoUser) {
      dispatch(login({ email: demoUser.email, password: demoUser.password }));
      navigate(role === "owner" ? "/dashboard" : "/");
      setMobileMenuOpen(false); // Close menu on switch (optional)
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to={logoLink} className="text-2xl font-bold text-primary">
          🍽️ Yummy
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {renderLinks().map((link) => (
            <Link key={link.name} to={link.path} className="hover:text-primary">
              {link.name}
            </Link>
          ))}
        </div>

        {/* User Menu (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Role Switcher */}
          <select
            value={user?.role || ""}
            onChange={(e) => handleSwitchRole(e.target.value)}
            className="border px-2 py-1 rounded-md text-sm bg-white"
          >
            <option disabled value="">Switch Role</option>
            <option value="customer">Login as Customer</option>
            <option value="owner">Login as Owner</option>
          </select>

          {isAuthenticated ? (
            <div className="relative group">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>{user.name}</span>
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
                <Button onClick={handleLogout} className="block px-4 py-2 w-full text-left hover:bg-gray-100">
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 py-4 space-y-2">
          {renderLinks().map((link) => (
            <Link key={link.name} to={link.path} className="block px-2 py-2 hover:bg-gray-100 rounded-md">
              {link.name}
            </Link>
          ))}

          {/* Mobile Role Switcher */}
          <select
            value={user?.role || ""}
            onChange={(e) => handleSwitchRole(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm bg-gray-50"
          >
            <option disabled value="">Switch Role</option>
            <option value="customer">Login as Customer</option>
            <option value="owner">Login as Owner</option>
          </select>

          {isAuthenticated ? (
            <button onClick={handleLogout} className="block w-full text-left mt-2 px-2 py-2 hover:bg-gray-100 rounded-md">
              Logout
            </button>
          ) : (
            <Link to="/login" className="block px-2 py-2 hover:bg-gray-100 rounded-md">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
