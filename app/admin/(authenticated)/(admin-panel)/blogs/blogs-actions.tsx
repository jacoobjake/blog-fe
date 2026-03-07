"use client";

import { Button } from "@heroui/react";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function AdminBlogsActions() {
  const router = useRouter();

  return (
    <Button
      variant="primary"
      size="sm"
      onPress={() => router.push("/admin/editor/blogs")}
    >
      <FiPlus />
      New Blog
    </Button>
  );
}
