"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image, { StaticImageData } from "next/image";
import { useRef } from "react";

type ParallaxBannerProps = {
  title: string;
  src: string | StaticImageData;
  isHero?: boolean;
  subtitle?: string;
  bgPos?: string;
  content?: React.ReactNode;
  distance?: number;
};

export default function ParallaxBanner({
  src,
  title,
  subtitle,
  content,
  isHero = false,
  bgPos,
  distance = 300,
}: ParallaxBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden w-full flex items-center justify-center text-white/90 font-sans"
    >
      <motion.div
        style={{ y }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={src}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover"
          priority={isHero}
          style={{
            objectPosition: bgPos || "center",
          }}
        />
      </motion.div>

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
