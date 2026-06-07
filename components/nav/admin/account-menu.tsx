"use client";

import { useAuth } from "@/hooks/auth";
import { Avatar, Button, Popover, cn } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function AdminAccountMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <Popover key={pathname}>
      <Popover.Trigger>
        <div className="flex gap-3 items-center">
          <Avatar />
          <div>{user?.name}</div>
        </div>
      </Popover.Trigger>
      <Popover.Content className="w-48" placement="bottom">
        <div className="p-4 flex flex-col gap-2">
          <Link
            href="/admin/profile"
            className={cn(
              buttonVariants({ variant: "ghost", fullWidth: true }),
              "justify-start",
            )}
          >
            <FiUser />
            Profile
          </Link>
          <Button
            variant="ghost"
            onPress={handleLogout}
            className="w-full justify-start"
          >
            <FiLogOut />
            Logout
          </Button>
        </div>
      </Popover.Content>
    </Popover>
  );
}
