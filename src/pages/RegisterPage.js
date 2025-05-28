import { useState } from "react";
import { useRegister } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Loading from "../components/Loading";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    newsletterSubscribed: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="relative min-h-full w-4xl overflow-hidden rounded-none md:rounded-3xl md:mx-16 md:my-auto">
      {/* Background image */}
      <img
        src="/images/wide12.jpg"
        alt="Φόντο Εγγραφής - Yummy"
        width="1920"
        height="1080"
        loading="eager"
        fetchpriority="high"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Register Form - Right Side */}
      <div className="relative z-20 flex items-start justify-start min-h-screen py-8">
        <motion.div
          {...fadeIn}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 space-y-6 my-auto mx-6 md:mx-auto md:ml-auto md:mr-36"
        >
          {/* Logo & Heading */}
          <div className="text-left space-y-2">
            <img
              src="/images/yummyLogo-2.png"
              alt="Yummy"
              className="w-14 h-14 drop-shadow"
            />
            <h1 className="text-3xl font-bold text-gray-900">
              Δημιουργία Λογαριασμού
            </h1>
            <p className="text-gray-700 text-sm">
              Ξεκίνα να κλείνεις τραπέζια εύκολα & γρήγορα!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Όνομα
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Κωδικός
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Τηλέφωνο (προαιρετικό)
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="newsletterSubscribed"
                name="newsletterSubscribed"
                type="checkbox"
                checked={formData.newsletterSubscribed}
                onChange={handleChange}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label
                htmlFor="newsletterSubscribed"
                className="text-sm text-gray-700"
              >
                Εγγραφή στο newsletter
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 text-white text-base font-semibold"
              disabled={registerMutation.isLoading}
            >
              {registerMutation.isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loading />
                  Εγγραφή...
                </span>
              ) : (
                "Δημιουργία Λογαριασμού"
              )}
            </Button>
          </form>

          {/* Link to Login */}
          <p className="text-sm text-gray-700">
            Έχεις ήδη λογαριασμό;{" "}
            <Link
              to="/login"
              className="text-red-600 font-medium hover:underline"
            >
              Σύνδεση
            </Link>
          </p>

          {/* Divider */}
          <div className="relative text-center text-sm text-gray-500">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <span className="relative bg-white px-4">ή</span>
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <a
              href="http://localhost:5000/user/auth/google"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 text-sm"
            >
              <FcGoogle size={20} />
              Εγγραφή με Google
            </a>

            <a
              href="http://localhost:5000/user/auth/facebook"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 text-sm text-blue-700"
            >
              <FaFacebook size={20} />
              Εγγραφή με Facebook
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
