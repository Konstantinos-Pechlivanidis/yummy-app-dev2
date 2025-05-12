import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

const LoyaltyProgram = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-300 shadow-md rounded-2xl overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl sm:text-2xl font-bold text-blue-800">
          🎖️ Πρόγραμμα Επιβράβευσης
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm sm:text-base text-gray-700 space-y-4 pt-2">
        <p className="leading-relaxed">
          Κέρδισε πόντους με κάθε κράτηση ή αγορά κουπονιού και απόκτησε
          μοναδικά προνόμια και αποκλειστικές εκπτώσεις!
        </p>

        <div className="flex justify-center pt-2">
          <Link to="/loyalty">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition">
              Μάθε Περισσότερα →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyProgram;
