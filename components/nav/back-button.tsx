"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

type BackButtonProps = {
  href?: string;
};

export default function BackButton({ href }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button variant="ghost" isIconOnly onClick={handleClick}>
      <FiArrowLeft />
    </Button>
  );
}
