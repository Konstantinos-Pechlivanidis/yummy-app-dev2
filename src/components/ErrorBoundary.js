import React from "react";
import { Button } from "./ui/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, send to error reporting service
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="text-center space-y-4 max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
              <div className="text-6xl">😕</div>
              <h1 className="text-2xl font-bold text-gray-900">
                Κάτι πήγε στραβά
              </h1>
              <p className="text-gray-600">
                Παρουσιάστηκε ένα μη αναμενόμενο σφάλμα. Παρακαλώ ανανεώστε τη
                σελίδα ή επικοινωνήστε με την υποστήριξη αν το πρόβλημα
                συνεχίζεται.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                >
                  Ανανέωση Σελίδας
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
                  className="w-full"
                >
                  Επιστροφή στην Αρχική
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

