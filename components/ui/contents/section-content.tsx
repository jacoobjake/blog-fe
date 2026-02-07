"use client";

import React, { useEffect, useRef, useState } from "react";

interface SectionContentProps {
  lines: (string | React.ReactNode)[];
}

export default function SectionContent({ lines }: SectionContentProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      className="relative z-10 w-full min-h-screen flex items-center justify-center py-20 px-6 md:px-8"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.02) 100%)`,
        willChange: "transform",
      }}
    >
      {/* Animated background elements for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, #E6D3A3 0%, transparent 70%)",
            willChange: "opacity",
          }}
        />
        <div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-5"
          style={{
            background: "radial-gradient(circle, #FF9A56 0%, transparent 70%)",
            willChange: "opacity",
          }}
        />
      </div>

      <div className="relative z-20 w-full max-w-4xl mx-auto">
        <div className="space-y-6 text-center">
          {lines.map((line, index) => (
            <LineItem key={`line-${index}`} line={line} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface LineItemProps {
  line: React.ReactNode;
  index: number;
}

function LineItem({ line, index }: LineItemProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Create observer for this specific line item
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Keep observing to allow re-triggering when scrolling back
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    if (lineRef.current) {
      observer.observe(lineRef.current);
    }

    return () => {
      if (lineRef.current) {
        observer.unobserve(lineRef.current);
      }
    };
  }, []);

  // If the line is a Separator or other component without text, we need special handling
  const isSeparator =
    React.isValidElement(line) &&
    (line.type === "hr" ||
      (line.type &&
        typeof line.type === "function" &&
        line.type.name?.includes("Separator")));

  return (
    <div
      ref={lineRef}
      className={`${
        isSeparator
          ? "flex justify-center items-center"
          : "text-lg md:text-xl text-foreground/90 leading-relaxed font-light"
      } transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-y-0 blur-none"
          : "opacity-0 translate-y-5 blur-sm"
      }`}
      style={{
        // Stagger the animation based on index
        transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
        willChange: "opacity, transform, filter",
      }}
    >
      {line}
    </div>
  );
}
