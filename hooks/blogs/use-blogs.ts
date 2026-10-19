"use client";

import { deleteBlogAction } from "@/lib/actions/blogs";
import { blogApi } from "@/lib/apis";
import type {
  BlogListFilters,
  BlogOrderByClause,
} from "@/lib/utils/blog-filters";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { PaginationState, SortingState } from "@tanstack/react-table";

export type BlogListQueryVariables = {
  pagination: PaginationState;
  filters?: BlogListFilters;
  sorting?: SortingState;
  orderBy?: BlogOrderByClause[];
};

export const blogQueryKeys = {
  all: ["blogs"] as const,
  list: (variables: BlogListQueryVariables) =>
    [...blogQueryKeys.all, "list", variables] as const,
  publicAll: ["public-blogs"] as const,
  publicList: (variables: BlogListQueryVariables) =>
    [...blogQueryKeys.publicAll, "list", variables] as const,
  tags: ["blog-tags"] as const,
  publicTags: ["public-blog-tags"] as const,
  dashboard: ["admin-dashboard"] as const,
};

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteBlogAction(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.publicAll });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.dashboard });
    },
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: blogQueryKeys.tags,
    queryFn: () => blogApi.listBlogTags(),
  });
}

export function usePublicBlogTags() {
  return useQuery({
    queryKey: blogQueryKeys.publicTags,
    queryFn: () => blogApi.listPublicBlogTags(),
  });
}

export function useAdminDashboardData() {
  return useQuery({
    queryKey: blogQueryKeys.dashboard,
    queryFn: () => blogApi.getAdminDashboard(),
    placeholderData: keepPreviousData,
    retry: 1,
  });
}
