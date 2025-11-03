import { useState } from "react";
import { useRequestPasswordReset } from "../../hooks/customer/usePasswordReset";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Loading from "../../components/Loading";
import { fadeIn } from "../../constants/animations";
import { IMAGES } from "../../constants/images";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const requestResetMutation = useRequestPasswordReset();

  const handleSubmit = (e) => {
    e.preventDefault();
    requestResetMutation.mutate(email, {
      onSuccess: () => {
        setEmailSent(true);
      },
    });
  };

  return (
    <div className="relative min-h-full w-4xl overflow-hidden rounded-none md:rounded-3xl md:mx-16 md:my-auto">
      {/* Background Image */}
      <img
        src={IMAGES.BACKGROUND_LOGIN}
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
              Επαναφορά Κωδικού
            </h1>
            <p className="text-gray-700 text-sm">
              {emailSent
                ? "Έλεγξε τα εισερχόμενά σου για το email επαναφοράς κωδικού"
                : "Εισήγαγε το email σου για να στείλουμε οδηγίες επαναφοράς"}
            </p>
          </div>

          {!emailSent ? (
            <>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={requestResetMutation.isLoading}
                  className="w-full bg-red-600 text-white hover:bg-red-700 font-semibold transition"
                >
                  {requestResetMutation.isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loading />
                      Αποστολή...
                    </span>
                  ) : (
                    "Στείλε Email"
                  )}
                </Button>
              </form>

              {/* Links */}
              <p className="text-sm text-gray-700">
                Θυμήθηκες τον κωδικό;{" "}
                <Link
                  to="/login"
                  className="text-red-600 font-medium hover:underline"
                >
                  Σύνδεση
                </Link>
              </p>

              <p className="text-sm text-gray-700">
                Δεν έχεις λογαριασμό;{" "}
                <Link
                  to="/register"
                  className="text-red-600 font-medium hover:underline"
                >
                  Δημιούργησε τώρα
                </Link>
              </p>
            </>
          ) : (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  ✅ Το email επαναφοράς κωδικού στάλθηκε στο{" "}
                  <span className="font-semibold">{email}</span>
                </p>
                <p className="text-green-700 text-xs mt-2">
                  Αν δεν βρεις το email, έλεγξε τον φάκελο spam.
                </p>
              </div>

              {/* Link back to login */}
              <Button
                onClick={() => setEmailSent(false)}
                className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition"
              >
                Στείλε Ξανά
              </Button>

              <p className="text-sm text-gray-700 text-center">
                <Link
                  to="/login"
                  className="text-red-600 font-medium hover:underline"
                >
                  ← Επιστροφή στη Σύνδεση
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

