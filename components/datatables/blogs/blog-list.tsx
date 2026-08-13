"use client";

import BlogFilters from "@/components/blogs/blog-filters";
import DeleteBlogButton from "@/components/blogs/delete-blog-button";
import OpenEditorButton from "@/components/editors/open-editor-btn";
import { useBlogTags } from "@/hooks/blogs";
import { useAuth } from "@/hooks/auth";
import { blogApi } from "@/lib/apis";
import { Blog } from "@/lib/types";
import { canManageBlog } from "@/lib/utils/blog-permissions";
import {
  sortingStateToOrderBy,
  type BlogListFilters,
} from "@/lib/utils/blog-filters";
import { dateToDatetimeString } from "@/lib/utils";
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
import { Chip } from "@heroui/react";
import Link from "next/link";
import HeroTableLayout from "../layouts/hero-table";
import { toSortingState } from "../layouts/utils";

export default function BlogList() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: tagOptions = [] } = useBlogTags();
  const [filters, setFilters] = useState<BlogListFilters>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "updated_at", desc: true },
  ]);

  const columns = useMemo<ColumnDef<Blog>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
        cell: (info) => (
          <Link
            href={`/admin/blogs/${info.row.original.slug}`}
            className="font-medium hover:text-accent"
          >
            {info.getValue<string>()}
          </Link>
        ),
      },
      {
        id: "author_profile.name",
        accessorFn: (row) => row.author_profile.name,
        header: "Author",
        enableSorting: false,
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: (info) => {
          const tags = info.row.original.tags ?? [];
          if (tags.length === 0) return <span className="text-muted">—</span>;

          return (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Chip key={tag.name} size="sm" variant="soft">
                  {tag.name}
                </Chip>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "is_published",
        enableSorting: false,
        cell: (info) => {
          const is_published = info.getValue<boolean>();

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
        enableSorting: true,
        cell: (info) => {
          const dt = new Date(info.row.original.created_at);
          return dateToDatetimeString(dt);
        },
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        enableSorting: true,
        cell: (info) => {
          const dt = new Date(info.row.original.updated_at);
          return dateToDatetimeString(dt);
        },
      },
      {
        id: "actions",
        cell: (info) => {
          const row = info.row;
          const canManage = canManageBlog(user, row.original);

          return (
            <div className="flex items-center justify-end gap-2">
              <OpenEditorButton variant="ghost" slug={row.original.slug} />
              {canManage && (
                <DeleteBlogButton
                  slug={row.original.slug}
                  title={row.original.title}
                />
              )}
            </div>
          );
        },
      },
    ],
    [user],
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
      orderBy: sortingStateToOrderBy(sorting),
    }),
    [filters, paginationState, sorting],
  );

  const query = useQuery({
    queryKey: ["blogs", queryVariables],
    queryFn: async () => {
      const data = await blogApi.listBlogs({
        first: paginationState.pageSize,
        page: paginationState.pageIndex + 1,
        title: filters.title,
        author: filters.author,
        tags: filters.tags,
        is_published: filters.is_published,
        orderBy: sortingStateToOrderBy(sorting),
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
      queryClient.setQueryData(["blogs", queryVariables], data);
    }
  }, [data, isPlaceholderData, queryClient, queryVariables]);

  return (
    <div className="w-full min-h-full flex flex-col gap-4">
      <BlogFilters
        filters={filters}
        onChange={setFilters}
        showPublishedFilter
        tagSuggestions={tagOptions.map((tag) => tag.name)}
      />
      <HeroTableLayout
        table={table}
        query={query}
        onSortChange={(descriptor) => table.setSorting(toSortingState(descriptor))}
      />
    </div>
  );
}
