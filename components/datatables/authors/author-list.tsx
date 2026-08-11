"use client";

import AuthorFilters from "@/components/authors/author-filters";
import { authorApi } from "@/lib/apis";
import type { AuthorProfile } from "@/lib/types";
import {
  authorOrderByToGraphql,
  sortingStateToAuthorOrderBy,
  type AuthorListFilters,
} from "@/lib/utils/author-filters";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import HeroTableLayout from "../layouts/hero-table";
import { toSortingState } from "../layouts/utils";

export default function AuthorList() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [filters, setFilters] = useState<AuthorListFilters>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const columns = useMemo<ColumnDef<AuthorProfile>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        cell: (info) => (
          <Link
            href={`/admin/authors/${info.row.original.id}`}
            className="font-medium hover:text-accent"
          >
            {info.getValue<string>()}
          </Link>
        ),
      },
      {
        id: "user.name",
        accessorFn: (row) => row.user?.name,
        header: "Linked user",
        enableSorting: false,
        cell: (info) => {
          const user = info.row.original.user;

          if (!user) {
            return <span className="text-muted">Not linked</span>;
          }

          return (
            <div>
              <p>{user.name}</p>
              {user.email && (
                <p className="text-sm text-muted">{user.email}</p>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: (info) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              isIconOnly
              aria-label="Edit author"
              variant="ghost"
              onPress={() =>
                router.push(`/admin/authors/${info.row.original.id}`)
              }
            >
              <FiEdit2 />
            </Button>
          </div>
        ),
      },
    ],
    [router],
  );

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const queryVariables = useMemo(
    () => ({
      pagination: paginationState,
      filters,
      sorting,
      orderBy: sortingStateToAuthorOrderBy(sorting),
    }),
    [filters, paginationState, sorting],
  );

  const query = useQuery({
    queryKey: ["authors", queryVariables],
    queryFn: async () => {
      return authorApi.listAuthorProfiles({
        first: paginationState.pageSize,
        page: paginationState.pageIndex + 1,
        name: filters.name,
        orderBy: authorOrderByToGraphql(sortingStateToAuthorOrderBy(sorting)),
      });
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
      sorting,
    },
    onPaginationChange: setPaginationState,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableSortingRemoval: false,
  });

  useEffect(() => {
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, sorting]);

  useEffect(() => {
    if (!isPlaceholderData && data?.paginatorInfo?.hasMorePages) {
      queryClient.setQueryData(["authors", queryVariables], data);
    }
  }, [data, isPlaceholderData, queryClient, queryVariables]);

  return (
    <div className="w-full min-h-full flex flex-col gap-4">
      <AuthorFilters filters={filters} onChange={setFilters} />
      <HeroTableLayout
        table={table}
        query={query}
        onSortChange={(descriptor) => table.setSorting(toSortingState(descriptor))}
      />
    </div>
  );
}
