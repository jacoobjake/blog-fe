"use client";

import { useAdminNav } from "@/hooks/nav";
import { RxHamburgerMenu } from "react-icons/rx";
import { motion } from "motion/react";
import MobileMenu from "./mobile-menu";
import { ThemeSwitch } from "@/components/ui/theme";
import { Button } from "@heroui/react";
import AdminAccountMenu from "./account-menu";

export default function AdminHeader() {
  const isSideMenuOpen = useAdminNav((state) => state.isSideMenuOpen);
  const setIsSideMenuOpen = useAdminNav((state) => state.setIsSideMenuOpen);

  return (
    <div className="w-full bg-surface h-20 border-b-2 flex justify-end items-center px-2 shrink-0">
      <motion.div
        initial={false}
        animate={{ opacity: isSideMenuOpen ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="hidden md:block"
      >
        <Button
          isIconOnly
          aria-label="Open sidebar"
          variant="ghost"
          className="rounded-md"
          onClick={() => setIsSideMenuOpen(true)}
        >
          <RxHamburgerMenu size={12} />
        </Button>
      </motion.div>
      <MobileMenu />
      <div className="grow flex justify-end gap-2 items-center">
        <AdminAccountMenu />
        <ThemeSwitch className="hidden md:block" />
      </div>
    </div>
  );
}
