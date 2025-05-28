import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white/60 dark:bg-zinc-800/60 backdrop-blur-2xl border border-white/30 dark:border-zinc-700 shadow-2xl rounded-3xl px-10 py-12 flex flex-col items-center gap-6 max-w-sm w-full"
      >
        {/* Spinner Ring */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28">
          <div className="absolute inset-0 rounded-full border-[6px] border-t-rose-500 border-l-transparent border-b-transparent border-r-transparent animate-spin shadow-[0_0_12px_#f43f5e]"></div>
          <img
            src="/images/yummyLogo-2.png"
            alt="Λογότυπο Yummy App"
            width="192"
            height="192"
            loading="eager"
            fetchpriority="high"
            className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 object-contain m-auto drop-shadow-md"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;
