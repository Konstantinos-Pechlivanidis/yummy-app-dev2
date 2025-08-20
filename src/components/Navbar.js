import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useLogout } from "../hooks/customer/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

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
    { name: "Πίνακας Ελέγχου", path: "/owner/dashboard" },
    { name: "Προφίλ", path: "/owner/profile" }, // Corrected path
  ];

  const renderLinks = () => {
    if (!isAuthenticated) return publicLinks;
    if (user.role === "customer") return customerLinks;
    if (user.role === "owner") return ownerLinks;
    return [];
  };

  const logoLink = isAuthenticated && user?.role === "owner" ? "/owner/dashboard" : "/";

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to={logoLink} className="text-2xl font-bold text-primary">
          Yummy
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {renderLinks().map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-700 hover:text-primary transition font-medium"
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
                   to={user.role === 'owner' ? '/owner/profile' : '/profile'}
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                 >
                   Προφίλ
                 </Link>
                 <button
                   onClick={() => setLogoutDialogOpen(true)}
                   className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                 >
                   Αποσύνδεση
                 </button>
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
              variant="ghost"
              onClick={() => {
                setLogoutDialogOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start text-red-600"
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
      
      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>❗ Επιβεβαίωση Αποσύνδεσης</DialogTitle>
            <DialogDescription>
              Θέλεις σίγουρα να αποσυνδεθείς από τον λογαριασμό σου;
            </DialogDescription>
          </DialogHeader>
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
