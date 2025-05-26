import { motion } from "framer-motion";
import { Card } from "../ui/card";
import Loading from "../Loading";
import { useTestimonials } from "../../hooks/useTestimonials";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const TestimonialsCarousel = () => {
  const { data: testimonials = [], isLoading } = useTestimonials(1, 6);

  return (
    <motion.section
      {...fadeIn}
      className="text-center px-4 sm:px-6 md:px-10 py-6 sm:py-8"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
        💬 Τι λένε οι χρήστες μας;
      </h2>

      {/* Swipe hint only on mobile */}
      <p className="text-[14px] text-gray-400 mb-4 block sm:hidden">
        Κάνε swipe για να δεις περισσότερα →
      </p>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 sm:pb-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="snap-start min-w-[90%] sm:min-w-[70%] md:min-w-[50%] lg:min-w-[40%] xl:min-w-[30%] 2xl:min-w-[25%] flex-shrink-0"
            >
              <Card className="p-5 sm:p-6 bg-white rounded-xl shadow-md h-full flex flex-col justify-center text-left w-full max-w-[350px] mx-auto">
                <p className="italic text-[15px] sm:text-[16px] text-gray-700 leading-snug">
                  "{testimonial.message}"
                </p>
                <p className="font-semibold text-gray-900 mt-3 text-[14px] sm:text-[15px]">
                  - {testimonial.author}
                </p>
              </Card>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default TestimonialsCarousel;
