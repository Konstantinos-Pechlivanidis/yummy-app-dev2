import { useEffect, useMemo, useState } from "react";

/**
 * Centralized layout config by viewport width.
 * Adds helpful flags (isMobile/isTablet/isDesktop) and throttled resize handling.
 */
const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 1024,
};

const computeConfig = (width) => {
  if (width < BREAKPOINTS.MOBILE) {
    return {
      itemsPerPage: 4,
      itemsPerSlide: 2,
      carouselWidth: "w-[50%]",
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    };
  }
  if (width < BREAKPOINTS.TABLET) {
    return {
      itemsPerPage: 6,
      itemsPerSlide: 6,
      carouselWidth: "w-[50%]",
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    };
  }
  return {
    itemsPerPage: 6,
    itemsPerSlide: 6,
    carouselWidth: "w-[25%]",
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  };
};

export const useScreenConfig = () => {
  const getWidth = () =>
    typeof window !== "undefined" ? window.innerWidth : BREAKPOINTS.TABLET;

  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let rafId;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const config = useMemo(() => computeConfig(width), [width]);

  return config;
};
