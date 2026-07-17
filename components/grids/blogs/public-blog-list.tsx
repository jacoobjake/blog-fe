"use client";

import BlogFilters from "@/components/blogs/blog-filters";
import PublicTagBrowse from "@/components/blogs/public-tag-browse";
import { blogApi } from "@/lib/apis";
import {
  parseTagsInput,
  toLikePattern,
  type BlogListFilters,
} from "@/lib/utils/blog-filters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import BlogListCard from "./blog-list-card";
import { PublicBlogCardSkeleton } from "./public-blog-list-skeleton";
import { PaginationState } from "@tanstack/react-table";
import { Separator } from "@heroui/react";
import StandardPagination from "@/components/ui/nav/standard-pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PublicBlogList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });

  const filters = useMemo<BlogListFilters>(() => {
    const title = searchParams.get("title");
    const author = searchParams.get("author");
    const tag = searchParams.get("tag");

    return {
      title: title ? toLikePattern(title) : undefined,
      author: author ? toLikePattern(author) : undefined,
      tags: tag ? parseTagsInput(tag) : undefined,
    };
  }, [searchParams]);

  const queryVariables = useMemo(
    () => ({
      pagination: paginationState,
      filters,
    }),
    [filters, paginationState],
  );

  const { data, isPending } = useQuery({
    queryKey: ["public-blogs", queryVariables],
    queryFn: async () => {
      const data = await blogApi.listPublicBlogs({
        first: paginationState.pageSize,
        page: paginationState.pageIndex + 1,
        title: filters.title,
        author: filters.author,
        tags: filters.tags,
        orderBy: [{ column: "created_at", order: "DESC" }],
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.paginatorInfo.lastPage ?? 1;
  const showCardSkeleton = isPending && !data;

  const setPageIndex = useCallback((pageIndex: number) => {
    setPaginationState((prev) => ({ ...prev, pageIndex }));
  }, []);

  const handleFiltersChange = (nextFilters: BlogListFilters) => {
    const params = new URLSearchParams(searchParams.toString());

    const title = nextFilters.title?.replace(/^%|%$/g, "");
    const author = nextFilters.author?.replace(/^%|%$/g, "");
    const tag = nextFilters.tags?.[0];

    if (title) params.set("title", title);
    else params.delete("title");

    if (author) params.set("author", author);
    else params.delete("author");

    if (tag) params.set("tag", tag);
    else params.delete("tag");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
  };

  useEffect(() => {
    setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters]);

  return (
    <div>
      <PublicTagBrowse />
      <BlogFilters
        filters={filters}
        onChange={handleFiltersChange}
        variant="naked"
      />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {showCardSkeleton
          ? Array.from({ length: paginationState.pageSize }).map((_, index) => (
              <PublicBlogCardSkeleton key={index} />
            ))
          : data?.data?.map((blog) => (
              <BlogListCard key={blog.slug} blog={blog} />
            ))}
      </div>
      <Separator className="my-8" />
      <div className="flex w-full justify-center">
        <StandardPagination
          page={paginationState.pageIndex + 1}
          totalPages={totalPages}
          setPage={(page) => setPageIndex(page - 1)}
        />
      </div>
    </div>
  );
}
