import { useState } from "react";
import { useLogin } from "../hooks/customer/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Loading from "../components/Loading";
import { getOAuthUrl } from "../config/api";
import { fadeIn } from "../constants/animations";
import { IMAGES } from "../constants/images";

const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: ({ user }) => {
        if (!user.confirmed_user) {
          navigate("/profile");
        } else if (user.role === "owner") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      },
    });
  };

  return (
    <div className="relative min-h-full w-4xl overflow-hidden rounded-none md:rounded-3xl md:mx-16 md:my-auto">
      {/* Background Image */}
      <img
        src={IMAGES.BACKGROUND_LOGIN}
        alt="Φόντο Σύνδεσης - Yummy"
        width="1920"
        height="1080"
        loading="eager"
        fetchpriority="high"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Login Form */}
      <div className="relative z-20 flex items-start justify-start min-h-screen">
        <motion.div
          {...fadeIn}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 space-y-6 my-auto ml-6 mr-6 md:ml-36 sm:my-auto sm:ml-10"
        >
          {/* Header */}
          <div className="text-left space-y-2">
            <img
              src={IMAGES.LOGO}
              alt="Λογότυπο Yummy App"
              width="192"
              height="192"
              loading="eager"
              fetchpriority="high"
              className="w-14 h-14 drop-shadow"
            />
            <h1 className="text-3xl font-bold text-gray-900">
              Σύνδεση στο Yummy
            </h1>
            <p className="text-gray-700 text-sm">Καλώς ήρθες πίσω 👋</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="you@example.com"
                className="mt-1"
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
                placeholder="••••••••"
                className="mt-1"
              />
              <div className="mt-1 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-red-600 hover:underline"
                >
                  Ξέχασες τον κωδικό;
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isLoading}
              className="w-full bg-red-600 text-white hover:bg-red-700 font-semibold transition"
            >
              {loginMutation.isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loading />
                  Σύνδεση...
                </span>
              ) : (
                "Σύνδεση"
              )}
            </Button>
          </form>

          {/* Links */}
          <p className="text-sm text-gray-700">
            Δεν έχεις λογαριασμό;{" "}
            <Link
              to="/register"
              className="text-red-600 font-medium hover:underline"
            >
              Δημιούργησε τώρα
            </Link>
          </p>

          <p className="text-sm text-gray-700">
            Είσαι ιδιοκτήτης;{" "}
            <Link
              to="/login-owner"
              className="text-blue-600 font-medium hover:underline"
            >
              Σύνδεση ως ιδιοκτήτης
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
              href={getOAuthUrl("google", "user")}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 text-sm"
            >
              <FcGoogle size={20} />
              Σύνδεση με Google
            </a>
            <a
              href={getOAuthUrl("facebook", "user")}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 text-sm text-blue-700"
            >
              <FaFacebook size={20} />
              Σύνδεση με Facebook
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
