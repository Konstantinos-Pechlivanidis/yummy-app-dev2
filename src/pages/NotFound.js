import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-100 px-6 text-center">
      
      {/* Icon */}
      <div className="text-6xl sm:text-7xl mb-4">😕</div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
        404 – Δεν Βρέθηκε
      </h1>

      {/* Subtext */}
      <p className="mt-4 text-lg text-gray-600 max-w-md">
        Η σελίδα που ψάχνεις δεν υπάρχει ή έχει μετακινηθεί.
      </p>

      {/* CTA */}
      <div className="mt-8">
        <Link to="/">
          <Button className="bg-primary text-white px-6 py-3 text-base sm:text-lg rounded-full shadow-md hover:scale-105 transition">
            🏠 Επιστροφή στην Αρχική
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
