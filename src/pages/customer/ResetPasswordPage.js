import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useResetPassword,
  useValidateResetToken,
} from "../../hooks/customer/usePasswordReset";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";
import { fadeIn } from "../../constants/animations";
import { IMAGES } from "../../constants/images";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidToken, setIsValidToken] = useState(null); // null = checking, true = valid, false = invalid
  const [tokenChecked, setTokenChecked] = useState(false);

  const validateMutation = useValidateResetToken();
  const resetMutation = useResetPassword();

  // Validate token on mount
  useEffect(() => {
    if (token && !tokenChecked) {
      setTokenChecked(true);
      validateMutation.mutate(token, {
        onSuccess: () => {
          setIsValidToken(true);
        },
        onError: () => {
          setIsValidToken(false);
        },
      });
    } else if (!token) {
      setIsValidToken(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (password !== confirmPassword) {
      toast.error("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }

    if (password.length < 8) {
      toast.error("Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες.");
      return;
    }

    resetMutation.mutate({ token, password });
  };

  // Show loading while validating token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Show error if token invalid
  if (isValidToken === false) {
    return (
      <div className="relative min-h-full w-4xl overflow-hidden rounded-none md:rounded-3xl md:mx-16 md:my-auto">
        <img
          src={IMAGES.BACKGROUND_LOGIN}
          alt="Φόντο - Yummy"
          width="1920"
          height="1080"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />

        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <motion.div
            {...fadeIn}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 space-y-6 mx-6"
          >
            <div className="text-center space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold mb-2">
                  Μη έγκυρο ή ληγμένο token
                </p>
                <p className="text-red-700 text-sm">
                  Ο σύνδεσμος επαναφοράς κωδικού έχει λήξει ή δεν είναι έγκυρος.
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  to="/forgot-password"
                  className="block w-full bg-red-600 text-white hover:bg-red-700 font-semibold py-2 px-4 rounded-md text-center transition"
                >
                  Ζήτησε Νέο Email Επαναφοράς
                </Link>

                <Link
                  to="/login"
                  className="block w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold py-2 px-4 rounded-md text-center transition"
                >
                  Επιστροφή στη Σύνδεση
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show reset form if token valid
  return (
    <div className="relative min-h-full w-4xl overflow-hidden rounded-none md:rounded-3xl md:mx-16 md:my-auto">
      {/* Background Image */}
      <img
        src="/images/wide11.jpg"
        alt="Φόντο Επαναφοράς Κωδικού - Yummy"
        width="1920"
        height="1080"
        loading="eager"
        fetchpriority="high"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Form */}
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
              Ορισμός Νέου Κωδικού
            </h1>
            <p className="text-gray-700 text-sm">
              Εισήγαγε τον νέο σου κωδικό πρόσβασης
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Νέος Κωδικός
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Επιβεβαίωση Κωδικού
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={resetMutation.isLoading}
              className="w-full bg-red-600 text-white hover:bg-red-700 font-semibold transition"
            >
              {resetMutation.isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loading />
                  Επαναφορά...
                </span>
              ) : (
                "Ορισμός Νέου Κωδικού"
              )}
            </Button>
          </form>

          {/* Links */}
          <p className="text-sm text-gray-700 text-center">
            <Link
              to="/login"
              className="text-red-600 font-medium hover:underline"
            >
              ← Επιστροφή στη Σύνδεση
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

