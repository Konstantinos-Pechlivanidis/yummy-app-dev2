import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useLogout } from "../hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const Navbar = () => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const { mutate: logout } = useLogout();

  const isAuthenticated = !!user;

  const publicLinks = [
    { name: "Αρχική", path: "/" },
    { name: "Κράτηση Τραπεζιού", path: "/reserve" },
  ];

  const customerLinks = [
    { name: "Αρχική", path: "/" },
    { name: "Εστιατόρια", path: "/reserve" },
    { name: "Οι Κρατήσεις Μου", path: "/my-reservations" },
    { name: "Προφίλ", path: "/profile" },
  ];

  const ownerLinks = [
    { name: "Πίνακας Ελέγχου", path: "/dashboard" },
    { name: "Προφίλ", path: "/profile" },
  ];

  const renderLinks = () => {
    if (!isAuthenticated) return publicLinks;
    if (user.role === "customer") return customerLinks;
    if (user.role === "owner") return ownerLinks;
    return [];
  };

  const logoLink =
    isAuthenticated && user?.role === "owner" ? "/dashboard" : "/";

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to={logoLink} className="text-2xl font-bold text-primary">
          Yummy
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {renderLinks().map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="hover:text-primary transition"
            >
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
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Προφίλ
                </Link>
                <Button
                  onClick={() => setLogoutDialogOpen(true)}
                  className="w-full text-left px-4 py-2"
                >
                  Αποσύνδεση
                </Button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button>Σύνδεση</Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 py-4 space-y-2">
          {renderLinks().map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-2 hover:bg-gray-100 rounded-md"
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <Button
              onClick={() => setLogoutDialogOpen(true)}
              className="w-full text-left px-4 py-2"
            >
              Αποσύνδεση
            </Button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center font-semibold text-white bg-red-600 hover:bg-red-700 transition rounded-md py-2 shadow-md"
            >
              Σύνδεση
            </Link>
          )}
        </div>
      )}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>❗ Επιβεβαίωση Αποσύνδεσης</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700">
            Θέλεις σίγουρα να αποσυνδεθείς από τον λογαριασμό σου;
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Άκυρο
            </Button>
            <Button
              className="bg-red-600 text-white"
              onClick={() => {
                logout();
                setLogoutDialogOpen(false);
              }}
            >
              Αποσύνδεση
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
