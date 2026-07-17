"use client";

import { Card, Skeleton } from "@heroui/react";

export default function AdminPanelLoading() {
  return (
    <div
      className="skeleton--shimmer h-full w-full space-y-4 p-8"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="flex items-center justify-between">
        <Skeleton animationType="none" className="h-8 w-40 rounded-md" />
        <Skeleton animationType="none" className="h-10 w-28 rounded-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="space-y-3 p-5">
            <Skeleton animationType="none" className="h-4 w-24 rounded-md" />
            <Skeleton animationType="none" className="h-9 w-16 rounded-md" />
          </Card>
        ))}
      </div>

      <Card className="space-y-3 p-4">
        <Skeleton animationType="none" className="h-10 w-full rounded-xl" />
        <Skeleton animationType="none" className="h-10 w-full rounded-xl" />
        <Skeleton animationType="none" className="h-10 w-3/4 rounded-xl" />
        <Skeleton animationType="none" className="h-10 w-full rounded-xl" />
        <Skeleton animationType="none" className="h-10 w-5/6 rounded-xl" />
      </Card>
    </div>
  );
}
