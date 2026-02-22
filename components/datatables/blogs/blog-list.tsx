"use client";

import { getBrowserApi } from "@/lib/apis";
import { Blog, GraphqlResponseWithPaginatorInfo } from "@/lib/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import BasicTableLayout from "../layouts/basic";
import { Button, Chip } from "@heroui/react";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Pagination from "../layouts/pagination";
import RowCount from "../layouts/row-count";

type BlogListProps = {
  initialData?: GraphqlResponseWithPaginatorInfo<Blog>;
};

export default function BlogList({ initialData }: BlogListProps) {
  const router = useRouter();
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
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
      },
      {
        id: "actions",
        cell: (info) => {
          const row = info.row;
          return (
            <div className="flex items-center justify-end">
              <Button
                variant="ghost"
                isIconOnly
                onPress={() => router.push(`/admin/blogs/${row.original.slug}`)}
              >
                <FiEdit />
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );
  const [paginationState, setPaginationState] = useState<PaginationState>(
    () => {
      if (initialData) {
        return {
          pageIndex: initialData.paginatorInfo.currentPage - 1,
          pageSize: initialData.paginatorInfo.perPage,
        };
      }
      return {
        pageIndex: 0,
        pageSize: 10,
      };
    },
  );
  const api = getBrowserApi();
  const { data, ...query } = useQuery({
    queryKey: ["blogs", paginationState],
    queryFn: async () => {
      const data = await api.blogs.listBlogs({
        first: paginationState.pageSize,
        page: paginationState.pageIndex + 1,
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });

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

  return (
    <div className="w-full min-h-full flex flex-col gap-4">
      <RowCount table={table} />
      <Pagination table={table} />
      <div className="grow">
        <BasicTableLayout table={table} query={query} />
      </div>
    </div>
  );
}
