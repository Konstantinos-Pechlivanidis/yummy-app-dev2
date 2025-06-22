import { useUserPoints } from "../../hooks/customer/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Star, Gift, Store } from "lucide-react";
import LoyaltyInfoButton from "../../components/LoyaltyInfoButton";
import Loading from "../../components/Loading";
import SEOHelmet from "../../components/SEOHelmet";

const LoyaltyPage = () => {

  const { data, isLoading, isError } = useUserPoints();

  const points = data?.loyalty_points ?? 0;

  return (
    <>
      <SEOHelmet
        title="Πρόγραμμα Επιβράβευσης | Yummy App"
        description="Κέρδισε πόντους με κάθε κράτηση και εξαργύρωσέ τους για μοναδικά κουπόνια. Μάθε πώς λειτουργεί το πρόγραμμα επιβράβευσης του Yummy!"
        url="https://yummy-app.gr/loyalty"
        image="https://yummy-app.gr/images/yummyLogo-2.png"
      />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 py-12 space-y-24">
        {/* HERO */}
        <section className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl">
          <img
            src="/images/wide4.jpg"
            alt="Loyalty Program Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 backdrop-blur-sm z-0" />
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6 text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-2xl">
              🎖️ Πρόγραμμα Επιβράβευσης Yummy
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-2xl drop-shadow-md">
              Κέρδισε πόντους με κάθε κράτηση και εξαργύρωσέ τους για
              αποκλειστικά κουπόνια κάθε εστιατορίου.
            </p>
          </div>
        </section>

        {/* ΠΟΝΤΟΙ */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">🎯 Οι Πόντοι σου</h2>

          {isLoading ? (
            <Loading />
          ) : isError ? (
            <p className="text-red-600">
              ⚠️ Σφάλμα κατά την ανάκτηση των πόντων.
            </p>
          ) : (
            <Card className="mx-auto w-full max-w-md bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg">
              <CardHeader className="pt-6">
                <CardTitle className="text-4xl font-extrabold text-primary">
                  {points} πόντοι
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6 px-6 space-y-4">
                <Progress
                  value={points % 100}
                  max={100}
                  className="h-3 bg-gray-200"
                />
                <p className="text-sm text-gray-600">
                  Οι πόντοι σου χρησιμοποιούνται για την αγορά κουπονιών που
                  προσφέρουν ειδικές εκπτώσεις ή δώρα.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* ΠΩΣ ΚΕΡΔΙΖΕΙΣ */}
        <section className="space-y-10">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            📈 Πώς Κερδίζεις Πόντους
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Card className="bg-white/80 border border-gray-100 shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
              <Star className="w-10 h-10 text-yellow-500 mx-auto" />
              <h3 className="text-lg font-semibold mt-4">
                10 πόντοι ανά κράτηση
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Κάθε φορά που κάνεις κράτηση, προστίθενται αυτόματα 10 πόντοι.
              </p>
            </Card>

            <Card className="bg-white/80 border border-gray-100 shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
              <Gift className="w-10 h-10 text-pink-500 mx-auto" />
              <h3 className="text-lg font-semibold mt-4">
                Αγορά κουπονιών με πόντους
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Μπες στη σελίδα κάθε εστιατορίου και εξαργύρωσε πόντους για
                εκπτώσεις.
              </p>
            </Card>

            <Card className="bg-white/80 border border-gray-100 shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
              <Store className="w-10 h-10 text-blue-600 mx-auto" />
              <h3 className="text-lg font-semibold mt-4">Χρήση στην κράτηση</h3>
              <p className="text-sm text-gray-600 mt-2">
                Επέλεξε κουπόνι κατά την κράτηση και απόλαυσε την προσφορά.
              </p>
            </Card>
          </div>
        </section>

        <LoyaltyInfoButton />
      </div>
    </>
  );
};

export default LoyaltyPage;
