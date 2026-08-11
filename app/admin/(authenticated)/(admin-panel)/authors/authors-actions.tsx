"use client";

import { Button } from "@heroui/react";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function AdminAuthorsActions() {
  const router = useRouter();

  return (
    <Button
      variant="primary"
      size="sm"
      onPress={() => router.push("/admin/authors/create")}
    >
      <FiPlus />
      Create author
    </Button>
  );
}
