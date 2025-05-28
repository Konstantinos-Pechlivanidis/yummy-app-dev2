import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const HeroSection = () => {
  return (
    <section className="relative h-[550px] flex items-center justify-center text-center rounded-3xl overflow-hidden shadow-xl">
      {/* Background image */}
      <img
        src="/images/wide3.jpg"
        alt="Yummy App - Κράτηση τραπεζιού με προσφορές σε εστιατόρια"
        width="1920"
        height="1080"
        className="absolute inset-0 object-cover w-full h-full"
        fetchpriority="high"
        loading="eager"
      />

      {/* Gradient + dark blur overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-0" />

      {/* Foreground content */}
      <motion.div
        {...fadeIn}
        className="relative z-10 text-white px-4 flex flex-col items-center"
      >
        {/* Glowing logo with blur */}
        <div className="mb-10 relative flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full bg-white/5 blur-2xl z-0 shadow-[0_0_60px_rgba(255,255,255,0.1)]" />

          {/* Subtle internal blur layer */}
          <div className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full bg-white/5 blur-xl z-0" />

          {/* Logo image */}
          <img
            src="/images/yummyLogo-2.png"
            alt="Λογότυπο Yummy App"
            width="192"
            height="192"
            loading="eager"
            fetchpriority="high"
            className="h-44 w-44 md:h-52 md:w-52 object-contain relative z-10 drop-shadow-2xl"
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-2xl text-center">
          Κλείσε Τραπέζι σε Δευτερόλεπτα!
        </h1>

        {/* Subtext */}
        <p className="text-xl md:text-2xl mt-4 drop-shadow-md text-center max-w-2xl">
          Ανακάλυψε τις καλύτερες γεύσεις με αποκλειστικές προσφορές.
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
