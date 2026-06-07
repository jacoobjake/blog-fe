import { Pagination } from "@heroui/react";

export type PaginationPageItem = number | "ellipsis";

export function getPages(
    page: number,
    totalPages: number,
): PaginationPageItem[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
        return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }

    if (page >= totalPages - 3) {
        return [
            1,
            "ellipsis",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
}

type StandardPaginationProps = {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
};

export default function StandardPagination({
    page,
    totalPages,
    setPage,
}: StandardPaginationProps) {
    const pages = getPages(page, totalPages);

    return (
        <Pagination className="justify-center">
            <Pagination.Content className="self-center">
                <Pagination.Item>
                    <Pagination.Previous
                        aria-label="Previous page"
                        isDisabled={page === 1}
                        onPress={() => setPage(page - 1)}
                    >
                        <Pagination.PreviousIcon />
                    </Pagination.Previous>
                </Pagination.Item>
                {pages.map((item, index) => (
                    <Pagination.Item
                        key={
                            item === "ellipsis"
                                ? `ellipsis-${index}`
                                : item
                        }
                    >
                        {item === "ellipsis" ? (
                            <Pagination.Ellipsis />
                        ) : (
                            <Pagination.Link
                                isActive={item === page}
                                onPress={() => setPage(item)}
                            >
                                {item}
                            </Pagination.Link>
                        )}
                    </Pagination.Item>
                ))}
                <Pagination.Item>
                    <Pagination.Next
                        aria-label="Next page"
                        isDisabled={page === totalPages}
                        onPress={() => setPage(page + 1)}
                    >
                        <Pagination.NextIcon />
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination>
    );
}
