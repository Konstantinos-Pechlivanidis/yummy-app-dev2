import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { fadeIn } from "../../constants/animations";

const features = [
  {
    title: "🚀 Ταχύτατες Κρατήσεις",
    desc: "Κλείσε τραπέζι μέσα σε λίγα δευτερόλεπτα χωρίς τηλεφωνήματα!",
  },
  {
    title: "🎯 Προσφορές & Happy Hours",
    desc: "Εκπτώσεις έως 50% σε επιλεγμένα εστιατόρια!",
  },
  {
    title: "⭐ Κριτικές Πελατών",
    desc: "Διάβασε πραγματικές εμπειρίες και επέλεξε το καλύτερο εστιατόριο!",
  },
];

const WhyYummySection = () => {
  return (
    <motion.section
      {...fadeIn}
      className="text-center px-4 sm:px-6 md:px-10 py-10 sm:py-12"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 sm:mb-10">
        🎉 Γιατί να επιλέξεις το Yummy;
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map(({ title, desc }, idx) => (
          <Card
            key={idx}
            className="bg-white/70 backdrop-blur-lg p-5 sm:p-6 rounded-xl shadow-xl transition-transform hover:scale-[1.03] text-left"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {title}
            </h3>
            <p className="text-gray-600 mt-2 text-sm sm:text-base leading-snug">
              {desc}
            </p>
          </Card>
        ))}
      </div>
    </motion.section>
  );
};

export default WhyYummySection;
