"use client";

import { ThemeSwitch } from "@/components/ui/theme";
import { getIcon } from "@/lib/resolvers/icon-resolver";
import { ADMIN_NAV_ROUTES } from "@/constants/routes";
import {
  Button,
  CloseButton,
  cn,
  Link,
  Modal,
  Separator,
  useOverlayState,
} from "@heroui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { usePathname } from "next/navigation";
import { matchesRoutePattern } from "@/lib/utils/route";

export default function MobileMenu() {
  const { isOpen, open, close, setOpen } = useOverlayState();
  const pathname = usePathname();

  const isActivePath = (pattern: string) =>
    matchesRoutePattern(pathname, pattern);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        isIconOnly
        aria-label="Open navigation menu"
        className="text-accent rounded-md"
        onPress={open}
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
            "data-entering:slide-in-from-left-5",
            "data-entering:duration-400",
            "data-entering:zoom-in-100",
            "data-exiting:animate-out",
            "data-exiting:ease-out-quint",
            "data-exiting:slide-out-to-left-5",
            "data-exiting:duration-400",
            "data-exiting:zoom-out-100",
          )}
        >
          <Modal.Dialog
            aria-label="Navigation menu"
            className="fixed rounded-l-none rounded-r-md inset-y-0 left-0 w-5/8 bg-surface space-y-4 shadow-sm shadow-accent-foreground"
          >
            <Modal.Header className="flex flex-row w-full items-center gap-2">
              <CloseButton
                aria-label="Close navigation menu"
                onClick={close}
                className="bg-transparent transition-transform hover:scale-130 text-accent"
              />
              <ThemeSwitch />
            </Modal.Header>
            <Separator />
            <Modal.Body className="flex flex-col items-start gap-6">
              {ADMIN_NAV_ROUTES.map((route) => (
                <div key={route.href}>
                  <Link
                    className={cn(
                      "decoration-0 text-2xl transition-all hover:scale-105 gap-2",
                      {
                        "text-accent": isActivePath(route.pattern),
                        "text-foreground": !isActivePath(route.pattern),
                      },
                    )}
                    href={route.href}
                  >
                    {route.label}
                    <Link.Icon
                      className={cn("size-10", {
                        "text-accent/70": isActivePath(route.pattern),
                        "text-foreground/70": !isActivePath(route.pattern),
                      })}
                    >
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
