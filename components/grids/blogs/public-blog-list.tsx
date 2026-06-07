"use client";

import { blogApi } from "@/lib/apis";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import BlogListCard from "./blog-list-card";
import { PaginationState } from "@tanstack/react-table";
import { Separator } from "@heroui/react";
import StandardPagination from "@/components/ui/nav/standard-pagination";

export default function PublicBlogList() {
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 12,
    });

    const { data } = useQuery({
        queryKey: ["public-blogs", paginationState],
        queryFn: async () => {
            const data = await blogApi.listPublicBlogs({
                first: paginationState.pageSize,
                page: paginationState.pageIndex + 1,
            });
            return data;
        },
        placeholderData: keepPreviousData,
    });

    const totalPages = data?.paginatorInfo.lastPage ?? 1;

    const setPageIndex = useCallback((pageIndex: number) => {
        setPaginationState((prev) => ({ ...prev, pageIndex }))
    }, [setPaginationState])

    return (
        <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
                {
                    data?.data?.map((blog) => <BlogListCard key={blog.slug} blog={blog} />)
                }
            </div>
            <Separator className="my-8" />
            <div className="w-full flex justify-center">
                <StandardPagination page={paginationState.pageIndex + 1} totalPages={totalPages} setPage={(page) => setPageIndex(page - 1)} />
            </div>
        </div>
    );
}