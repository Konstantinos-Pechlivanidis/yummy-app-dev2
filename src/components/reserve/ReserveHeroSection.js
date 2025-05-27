import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const ReserveHeroSection = () => (
  <section className="relative h-[400px] flex items-center justify-center text-center rounded-3xl overflow-hidden shadow-xl">
    <img
      src="/images/wide2.jpg"
      alt="hero"
      className="absolute inset-0 object-cover w-full h-full"
    />
    <div className="absolute inset-0 bg-black/60 z-0" />
    <motion.div
      {...fadeIn}
      className="relative z-10 text-white px-4 flex flex-col items-center"
    >
      <div className="mb-6 relative flex items-center justify-center">
        <div className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full bg-white/25 blur-3xl z-0" />
        <img
          src="/images/yummyLogo-2.png"
          alt="Yummy Logo"
          className="h-40 w-40 md:h-48 md:w-48 object-contain relative z-10"
        />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-xl">
        Βρες το Ιδανικό Εστιατόριο
      </h1>
      <p className="text-xl mt-4 drop-shadow-md max-w-xl">
        Φιλτράρισε και βρες το τέλειο μέρος για την κράτησή σου!
      </p>
    </motion.div>
  </section>
);

export default ReserveHeroSection;
