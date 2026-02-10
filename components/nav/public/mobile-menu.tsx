"use client";

import ThemeSwitch from "@/components/ui/theme/theme-switch";
import { getIcon } from "@/lib/resolvers/icon-resolver";
import { NAV_ROUTES } from "@/lib/routes";
import {
  Button,
  CloseButton,
  cn,
  Link,
  Modal,
  Separator,
  useOverlayState,
} from "@heroui/react";
import { FiX } from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

export default function MobileMenu() {
  const { isOpen, open, close, setOpen } = useOverlayState();

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        isIconOnly
        className="text-accent rounded-md"
        onClick={open}
      >
        <RxHamburgerMenu />
      </Button>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={setOpen}
        className={cn(
          "data-entering:animate-in",
          "data-entering:ease-out-quint",
          "data-entering:fade-in-0",
          "data-entering:duration-400",
          "data-exiting:animate-out",
          "data-exiting:ease-out-quint",
          "data-exiting:fade-out-0",
          "data-exiting:duration-400",
        )}
      >
        <Modal.Container
          className={cn(
            "data-entering:animate-in",
            "data-entering:ease-out-quint",
            "data-entering:slide-in-from-right-5",
            "data-entering:duration-400",
            "data-entering:zoom-in-100",
            "data-exiting:animate-out",
            "data-exiting:ease-out-quint",
            "data-exiting:slide-out-to-right-5",
            "data-exiting:duration-400",
            "data-exiting:zoom-out-100",
          )}
        >
          <Modal.Dialog className="fixed rounded-r-none inset-y-0 right-0 w-5/8 bg-background space-y-4 shadow-sm shadow-accent-foreground">
            <Modal.Header className="flex flex-row justify-end w-full items-center gap-2">
              <ThemeSwitch />
              <CloseButton
                onClick={close}
                className="bg-transparent transition-transform hover:scale-130 text-accent"
              />
            </Modal.Header>
            <Separator />
            <Modal.Body className="flex flex-col items-end gap-6">
              {NAV_ROUTES.map((route) => (
                <div key={route.href}>
                  <Link
                    className="decoration-0 text-2xl text-accent transition-all hover:scale-105"
                    href={route.href}
                  >
                    {route.label}
                    <Link.Icon className="size-10 ml-2 text-accent/70">
                      {getIcon(route.icon, 30)}
                    </Link.Icon>
                  </Link>
                </div>
              ))}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
