import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSelector } from "react-redux";

const Footer = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Reserve a Table", path: "/reserve" },
  ];

  const customerLinks = [
    ...publicLinks,
    { name: "My Reservations", path: "/my-reservations" },
    { name: "Profile", path: "/profile" },
  ];

  const ownerLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
  ];

  const resolvedLinks = !isAuthenticated
    ? publicLinks
    : user?.role === "customer"
    ? customerLinks
    : user?.role === "owner"
    ? ownerLinks
    : [];

  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold">Quick Links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {resolvedLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path}>
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/privacy-policy">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-xl font-semibold">Join Our Newsletter</h2>
          <p className="mt-2 text-sm text-gray-400">
            Subscribe to receive the latest restaurant deals and updates.
          </p>
          <div className="flex mt-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-800 border-none text-white"
            />
            <Button className="ml-2 bg-primary text-white">Subscribe</Button>
          </div>
        </div>

        {/* Socials */}
        <div>
          <h2 className="text-xl font-semibold">Follow Us</h2>
          <p className="mt-2 text-sm text-gray-400">
            Stay connected with us on social media.
          </p>
          <div className="flex mt-4 space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="w-6 h-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Yummy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
