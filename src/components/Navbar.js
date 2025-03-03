import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Menu, X } from "lucide-react"; // Icons
import { Button } from "./ui/button"; // Shadcn UI

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Links for different user roles
  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Reserve a Table", path: "/reserve" },
  ];

  const customerLinks = [
    { name: "My Reservations", path: "/my-reservations" },
    { name: "Profile", path: "/profile" }, // Already included
  ];

  const ownerLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" }, // Already included
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          🍽️ Yummy
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {publicLinks.map((link) => (
            <Link key={link.name} to={link.path} className="hover:text-primary">
              {link.name}
            </Link>
          ))}

          {isAuthenticated && user.role === "customer" &&
            customerLinks.map((link) => (
              <Link key={link.name} to={link.path} className="hover:text-primary">
                {link.name}
              </Link>
            ))}

          {isAuthenticated && user.role === "owner" &&
            ownerLinks.map((link) => (
              <Link key={link.name} to={link.path} className="hover:text-primary">
                {link.name}
              </Link>
            ))}
        </div>

        {/* User Menu */}
        <div className="hidden md:flex items-center space-x-4">
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

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          {publicLinks.map((link) => (
            <Link key={link.name} to={link.path} className="block px-4 py-2 hover:bg-gray-100">
              {link.name}
            </Link>
          ))}

          {isAuthenticated && user.role === "customer" &&
            customerLinks.map((link) => (
              <Link key={link.name} to={link.path} className="block px-4 py-2 hover:bg-gray-100">
                {link.name}
              </Link>
            ))}

          {isAuthenticated && user.role === "owner" &&
            ownerLinks.map((link) => (
              <Link key={link.name} to={link.path} className="block px-4 py-2 hover:bg-gray-100">
                {link.name}
              </Link>
            ))}

          {isAuthenticated ? (
            <button onClick={handleLogout} className="block px-4 py-2 w-full text-left hover:bg-gray-100">
              Logout
            </button>
          ) : (
            <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
