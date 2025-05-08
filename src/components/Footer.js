import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSelector } from "react-redux";

const Footer = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const publicLinks = [
    { name: "Αρχική", path: "/" },
    { name: "Εστιατόρια", path: "/reserve" },
  ];

  const customerLinks = [
    ...publicLinks,
    { name: "Οι Κρατήσεις Μου", path: "/my-reservations" },
    { name: "Προφίλ", path: "/profile" },
  ];

  const ownerLinks = [
    { name: "Πίνακας Ελέγχου", path: "/dashboard" },
    { name: "Προφίλ", path: "/profile" },
  ];

  const resolvedLinks = !isAuthenticated
    ? publicLinks
    : user?.role === "customer"
    ? customerLinks
    : user?.role === "owner"
    ? ownerLinks
    : [];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 mt-20">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        
        {/* Γρήγοροι Σύνδεσμοι */}
        <div>
          <h2 className="text-lg font-semibold tracking-wide">Γρήγοροι Σύνδεσμοι</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            {resolvedLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="hover:text-white transition">
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/privacy-policy" className="hover:text-white transition">
                Πολιτική Απορρήτου
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-lg font-semibold tracking-wide">Ενημερωτικό Δελτίο</h2>
          <p className="mt-2 text-sm text-gray-400">
            Εγγράψου για να λαμβάνεις προσφορές και νέα για τα καλύτερα εστιατόρια!
          </p>
          <div className="flex mt-4">
            <Input
              type="email"
              placeholder="Το email σου"
              className="flex-1 bg-gray-800 border-none text-white placeholder:text-gray-400"
            />
            <Button className="ml-2 bg-primary text-white hover:scale-105 transition">
              Εγγραφή
            </Button>
          </div>
        </div>

        {/* Socials */}
        <div>
          <h2 className="text-lg font-semibold tracking-wide">Ακολούθησέ μας</h2>
          <p className="mt-2 text-sm text-gray-400">
            Μείνε ενημερωμένος μέσω των κοινωνικών μας δικτύων.
          </p>
          <div className="flex mt-4 space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="w-6 h-6 hover:text-blue-500 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="w-6 h-6 hover:text-pink-500 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="w-6 h-6 hover:text-sky-400 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Yummy. Όλα τα δικαιώματα διατηρούνται.
      </div>
    </footer>
  );
};

export default Footer;
