import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const NotFound = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 🌄 Background */}
      <img
        src="/images/wide10.jpg"
        alt="404 Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* 💬 Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-6">
        <motion.div
          {...fadeIn}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 text-center space-y-6"
        >
          {/* Logo */}
          <img
            src="/images/yummyLogo-2.png"
            alt="Λογότυπο Yummy App"
            width="192"
            height="192"
            loading="eager"
            fetchpriority="high"
            className="w-16 h-16 mx-auto drop-shadow"
          />

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
            Δεν Βρέθηκε
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 text-base sm:text-lg">
            Η σελίδα που ψάχνεις δεν υπάρχει ή έχει μετακινηθεί.
          </p>

          {/* CTA */}
          <div>
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-base sm:text-lg rounded-xl shadow-md transition-all">
                🏠 Επιστροφή στην Αρχική
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
