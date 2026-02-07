import React from "react";

export function AnimatedLine({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-animate-item
      className="text-lg md:text-xl text-foreground/90 leading-relaxed font-light"
    >
      {children}
    </div>
  );
}
