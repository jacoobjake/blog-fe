"use client";

import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";

export default function ScrollTopButton() {
  const scrollToTop = () => {
    // Increase duration of the scroll
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show button only when scrolled down
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Animate appearance of the button
  const buttonClass = isVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-2";

  return (
    <Button
      onClick={scrollToTop}
      isIconOnly
      className={`transition-all duration-300 fixed rounded-full bottom-30 right-10 z-50 bg-accent text-accent-foreground hover:bg-accent-hover focus:ring-0 ${buttonClass}`}
    >
      <MdKeyboardArrowUp />
    </Button>
  );
}
