import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-200 text-center px-6">
      {/* Heading */}
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
        404 - Σελίδα Δεν Βρέθηκε
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-lg md:text-xl mt-4 max-w-md">
        Ωχ! Η σελίδα που ψάχνετε δεν υπάρχει ή έχει μετακινηθεί.
      </p>

      {/* Call to Action */}
      <div className="mt-6">
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg shadow-md transition">
            🏠 Επιστροφή στην Αρχική
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
