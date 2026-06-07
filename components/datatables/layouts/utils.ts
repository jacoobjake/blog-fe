import { SortDescriptor } from "@heroui/react";
import { SortingState } from "@tanstack/react-table";

export function toSortDescriptor(
  sorting: SortingState,
): SortDescriptor | undefined {
  const first = sorting[0];
  if (!first) return undefined;
  return {
    column: first.id,
    direction: first.desc ? "descending" : "ascending",
  };
}
// Convert React Aria SortDescriptor → TanStack SortingState
export function toSortingState(descriptor: SortDescriptor): SortingState {
  return [
    {
      desc: descriptor.direction === "descending",
      id: descriptor.column as string,
    },
  ];
}
