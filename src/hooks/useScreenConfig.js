import { useEffect, useState, useMemo } from "react";

// 📱 Breakpoints in pixels
const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 1024,
};

const getConfigFromWidth = (width) => {
  if (width < BREAKPOINTS.MOBILE) {
    return {
      itemsPerPage: 4,
      itemsPerSlide: 2,
      carouselWidth: "w-[50%]",
    };
  }

  if (width < BREAKPOINTS.TABLET) {
    return {
      itemsPerPage: 6,
      itemsPerSlide: 6,
      carouselWidth: "w-[50%]",
    };
  }

  return {
    itemsPerPage: 6,
    itemsPerSlide: 6,
    carouselWidth: "w-[25%]",
  };
};

export const useScreenConfig = () => {
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const config = useMemo(() => getConfigFromWidth(windowWidth), [windowWidth]);

  return config;
};
