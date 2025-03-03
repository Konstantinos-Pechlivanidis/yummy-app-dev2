import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { Star, Gift, Trophy } from "lucide-react";

const LoyaltyPage = () => {
  const { user } = useSelector((state) => state.auth);
  const points = user ? user.loyaltyPoints : 0;

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] flex items-center justify-center text-center bg-cover bg-center rounded-3xl shadow-lg overflow-hidden"
        style={{ backgroundImage: "url('/images/wide4.jpg')" }}>
        
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

        <div className="relative z-10 px-6 text-white">
          <h1 className="text-3xl sm:text-5xl font-bold drop-shadow-lg">
            🎖️ Πρόγραμμα Επιβράβευσης Yummy
          </h1>
          <p className="text-lg mt-4 drop-shadow-md">
            Κέρδισε πόντους με κάθε κράτηση και εξαργύρωσέ τους για μοναδικές ανταμοιβές!
          </p>
        </div>
      </section>

      <Separator className="my-10" />

      {/* Πόντοι Χρήστη */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">🎯 Οι Πόντοι σου</h2>
        <Card className="max-w-md mx-auto mt-6 p-6 text-center">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-primary">{points} πόντοι</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={Math.min(points / 5, 100)} className="h-3 bg-gray-300" />
            <p className="text-gray-600 mt-4">
              Κέρδισε ακόμα <strong>{5 - (points % 5)}</strong> πόντους για να ξεκλειδώσεις την επόμενη ανταμοιβή!  
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-10" />

      {/* Πώς Κερδίζεις Πόντους */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">📈 Πώς Κερδίζεις Πόντους</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <Card className="p-6 text-center shadow-md hover:scale-105 transition-all">
            <Star className="mx-auto w-10 h-10 text-yellow-500" />
            <h3 className="text-xl font-semibold mt-4">🌟 10 πόντοι ανά κράτηση</h3>
            <p className="text-gray-600 mt-2">Κλείσε τραπέζι και κέρδισε πόντους αυτόματα.</p>
          </Card>

          <Card className="p-6 text-center shadow-md hover:scale-105 transition-all">
            <Gift className="mx-auto w-10 h-10 text-red-500" />
            <h3 className="text-xl font-semibold mt-4">🎁 5 πόντοι ανά αξιολόγηση</h3>
            <p className="text-gray-600 mt-2">Γράψε κριτική μετά την κράτηση και κέρδισε!</p>
          </Card>

          <Card className="p-6 text-center shadow-md hover:scale-105 transition-all">
            <Trophy className="mx-auto w-10 h-10 text-blue-500" />
            <h3 className="text-xl font-semibold mt-4">🏆 Bonus πόντοι σε events</h3>
            <p className="text-gray-600 mt-2">Συμμετείχε σε ειδικές προωθητικές ενέργειες.</p>
          </Card>
        </div>
      </section>

      <Separator className="my-10" />

      {/* Εξαργύρωση Πόντων */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">💰 Εξαργύρωση Πόντων</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <Card className="p-6 text-center shadow-md hover:scale-105 transition-all">
            <h3 className="text-xl font-semibold text-primary">🎟️ 50 πόντοι</h3>
            <p className="text-gray-600 mt-2">Λάβε 10% έκπτωση σε οποιοδήποτε γεύμα.</p>
            <Button className="mt-4 bg-primary text-white">Εξαργύρωση</Button>
          </Card>

          <Card className="p-6 text-center shadow-md hover:scale-105 transition-all">
            <h3 className="text-xl font-semibold text-red-500">🍽️ 100 πόντοι</h3>
            <p className="text-gray-600 mt-2">Κέρδισε ένα δωρεάν ορεκτικό!</p>
            <Button className="mt-4 bg-primary text-white">Εξαργύρωση</Button>
          </Card>

          <Card className="p-6 text-center shadow-md hover:scale-105 transition-all">
            <h3 className="text-xl font-semibold text-yellow-500">🏅 200 πόντοι</h3>
            <p className="text-gray-600 mt-2">Γίνε VIP μέλος για έναν μήνα.</p>
            <Button className="mt-4 bg-primary text-white">Εξαργύρωση</Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LoyaltyPage;
