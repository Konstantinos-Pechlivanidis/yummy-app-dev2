/**
 * Animation Constants
 * Centralized animation configurations for consistent UX
 */
import { motion } from "framer-motion";

export const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 },
};

/**
 * Reusable motion component with fadeIn
 */
export const FadeInMotion = ({ children, className = "" }) => (
  <motion.div {...fadeIn} className={className}>
    {children}
  </motion.div>
);

