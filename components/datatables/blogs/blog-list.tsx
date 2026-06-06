"use client";

import { blogApi } from "@/lib/apis";
import { Blog } from "@/lib/types";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Chip } from "@heroui/react";
import OpenEditorButton from "@/components/editors/open-editor-btn";
import HeroTableLayout from "../layouts/hero-table";
import { dateToDatetimeString } from "@/lib/utils";

export default function BlogList() {
  const queryClient = useQueryClient();
  const columns = useMemo<ColumnDef<Blog>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "author",
        header: "Author",
      },
      {
        accessorKey: "is_published",
        cell: (info) => {
          const is_published = info.getValue();

          return (
            <Chip variant="soft" color={is_published ? "success" : "default"}>
              {is_published ? "Published" : "Unpublished"}
            </Chip>
          );
        },
        header: "Published",
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: (info) => {
          const dt = new Date(info.row.original.created_at);
          return dateToDatetimeString(dt);
        }
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: (info) => {
          const dt = new Date(info.row.original.updated_at);
          return dateToDatetimeString(dt);
        }
      },
      {
        id: "actions",
        cell: (info) => {
          const row = info.row;
          return (
            <div className="flex items-center justify-end">
              <OpenEditorButton variant="ghost" slug={row.original.slug} />
            </div>
          );
        },
      },
    ],
    [],
  );
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const query = useQuery({
    queryKey: ["blogs", paginationState],
    queryFn: async () => {
      const data = await blogApi.listBlogs({
        first: paginationState.pageSize,
        page: paginationState.pageIndex + 1,
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });

  const { data, isPlaceholderData } = query;

  const defaultData = useMemo(() => [], []);

  const table = useReactTable({
    data: data?.data ?? defaultData,
    columns,
    rowCount: data?.paginatorInfo?.total ?? 0,
    state: {
      pagination: paginationState,
    },
    onPaginationChange: setPaginationState,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  // Prefetch next page
  useEffect(() => {
    if (!isPlaceholderData && data?.paginatorInfo?.hasMorePages) {
      queryClient.setQueryData(
        [
          "blogs",
          {
            pageIndex: paginationState.pageIndex + 1,
            pageSize: paginationState.pageSize,
          },
        ],
        data,
      );
    }
  }, [isPlaceholderData, paginationState, data, queryClient]);

  return (
    <div className="w-full min-h-full flex flex-col gap-4">
      <HeroTableLayout table={table} query={query} />
    </div>
  );
}
