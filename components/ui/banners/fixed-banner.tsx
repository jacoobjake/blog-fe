"use client";

import { useEffect, useRef } from "react";

type FixedBannerProps = {
  title: string;
  subtitle?: string;
  bgImage: string;
  bgPos?: string;
  content?: React.ReactNode;
};

export default function FixedBanner({
  title,
  subtitle,
  bgImage,
  bgPos,
  content,
}: FixedBannerProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let ticking = false;

    const updateParallax = () => {
      if (!bgRef.current) return;

      // Get banner position relative to viewport
      const rect = bgRef.current.getBoundingClientRect();
      const scrolled = -rect.top;

      // Calculate parallax offset (slower movement than scroll)
      // 0.5 means it moves at 50% of the scroll speed
      const parallaxOffset = scrolled * 0.5;

      // Apply the transform for smooth GPU-accelerated movement
      bgRef.current.style.transform = `translateY(${parallaxOffset}px)`;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        scrollFrameRef.current = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Call once on mount to set initial state
    updateParallax();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center text-white/90 font-sans">
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: bgPos || "center",
          backgroundAttachment: "scroll",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }}
      ></div>
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 text-center">
        <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {title}
        </h2>
        {subtitle && <p className="text-2xl drop-shadow-lg">{subtitle}</p>}
        {content}
      </div>
    </div>
  );
}
