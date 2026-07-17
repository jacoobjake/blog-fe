"use client";

import { Skeleton } from "@heroui/react";

export function PublicBlogCardSkeleton() {
  return (
    <div className="h-96 overflow-hidden rounded-xl bg-surface">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-8 w-4/5 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="space-y-2 pt-6">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function PublicBlogListSkeleton({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <div
      className="skeleton--shimmer"
      aria-busy="true"
      aria-label="Loading blogs"
    >
      <div className="mb-6 space-y-3">
        <Skeleton animationType="none" className="h-6 w-36 rounded-md" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              animationType="none"
              className="h-8 w-16 rounded-full"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton animationType="none" className="h-4 w-16 rounded-md" />
              <Skeleton animationType="none" className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Skeleton animationType="none" className="h-9 w-28 rounded-full" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <PublicBlogCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
