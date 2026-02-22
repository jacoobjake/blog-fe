"use client";

import { useAuth } from "@/hooks/auth";
import { Avatar, Button, Popover } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

export default function AdminAccountMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <Popover>
      <Popover.Trigger>
        <div className="flex gap-3 items-center">
          <Avatar />
          <div>{user?.name}</div>
        </div>
      </Popover.Trigger>
      <Popover.Content className="w-48" placement="bottom">
        <div className="p-4 flex flex-col gap-2">
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
