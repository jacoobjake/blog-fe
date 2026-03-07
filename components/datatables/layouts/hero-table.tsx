"use client";

import { flexRender, Table } from "@tanstack/react-table";
import {
  Spinner,
  Table as HeroTable,
  cn,
  Select,
  Pagination,
  ListBox,
  Label,
  Input,
  EmptyState,
} from "@heroui/react";
import { UseQueryResult } from "@tanstack/react-query";
import { FaChevronUp } from "react-icons/fa6";
import { toSortDescriptor } from "./utils";
import { Fragment, useMemo } from "react";
import { PiTray } from "react-icons/pi";

type BasicTableLayoutProps<T> = {
  table: Table<T>;
  query: Pick<UseQueryResult, "isLoading" | "isError" | "isFetching" | "error">;
};

export default function HeroTableLayout<T>({
  table,
  query,
}: BasicTableLayoutProps<T>) {
  const rows = table.getRowModel().rows;
  const headerGroups = table.getHeaderGroups();
  const columnCount = headerGroups[0]?.headers.length || 1;
  const { pageSize, pageIndex } = table.getState().pagination;

  const emptyRowsCount = Math.max(0, pageSize - rows.length);
  const pageCount = table.getPageCount();
  const start = pageIndex * pageSize + 1;
  const end = start + rows.length - 1;
  const sorting = table.getState().sorting;

  const sortDescriptor = useMemo(() => toSortDescriptor(sorting), [sorting]);

  return (
    <div className="relative">
      <HeroTable>
        <HeroTable.ScrollContainer>
          <HeroTable.Content sortDescriptor={sortDescriptor}>
            <HeroTable.Header>
              {headerGroups.map((headerGroup) => (
                <Fragment key={headerGroup.id}>
                  {headerGroup.headers.map((header: any, index) => (
                    <HeroTable.Column
                      key={header.id}
                      isRowHeader={index === 0}
                      className="p-2 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {({ sortDirection }) => (
                        <SortableColumnHeader sortDirection={sortDirection}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </SortableColumnHeader>
                      )}
                    </HeroTable.Column>
                  ))}
                </Fragment>
              ))}
            </HeroTable.Header>
            <HeroTable.Body
              renderEmptyState={() => (
                <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                  <PiTray />
                  <span className="text-sm text-muted">No results found</span>
                </EmptyState>
              )}
            >
              {table.getRowModel().rows.map((row) => (
                <HeroTable.Row key={row.id} id={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <HeroTable.Cell key={cell.id} className="min-h-16">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </HeroTable.Cell>
                  ))}
                </HeroTable.Row>
              ))}
            </HeroTable.Body>
          </HeroTable.Content>
          <HeroTable.Footer>
            <Pagination size="sm">
              <Pagination.Summary>
                {start} to {end} of {table.getRowCount().toLocaleString()}{" "}
                results
              </Pagination.Summary>
              <Pagination.Content className="space-x-2">
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={!table.getCanPreviousPage()}
                    onPress={() => table.previousPage()}
                  >
                    <Pagination.PreviousIcon />
                    Prev
                  </Pagination.Previous>
                </Pagination.Item>
                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={!table.getCanNextPage()}
                    onPress={() => table.nextPage()}
                  >
                    Next
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
                <Pagination.Item>
                  <Label>
                    Page &nbsp;
                    <strong>
                      {pageIndex + 1} of {pageCount.toLocaleString()}
                    </strong>
                  </Label>
                </Pagination.Item>
                <Pagination.Item>
                  <span className="flex items-center gap-2">
                    Go to page:
                    <Input
                      type="number"
                      min="1"
                      max={table.getPageCount()}
                      defaultValue={table.getState().pagination.pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        table.setPageIndex(page);
                      }}
                    />
                  </span>
                </Pagination.Item>

                <Pagination.Item className="items-center gap-2">
                  <Select
                    className="w-28"
                    aria-label="Select number of items per page"
                    value={table.getState().pagination.pageSize}
                    onChange={(v) => {
                      table.setPageSize(Number(v));
                    }}
                  >
                    <Select.Trigger>
                      Show {table.getState().pagination.pageSize}
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <ListBox.Item key={pageSize} id={pageSize}>
                            Show {pageSize}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </HeroTable.Footer>
        </HeroTable.ScrollContainer>
      </HeroTable>
    </div>
  );
}

// Component: Sortable Column Header
function SortableColumnHeader({
  children,
  sortDirection,
}: {
  children: React.ReactNode;
  sortDirection?: "ascending" | "descending";
}) {
  return (
    <span className="flex items-center justify-between">
      {children}
      {!!sortDirection && (
        <FaChevronUp
          className={cn(
            "size-3 transform transition-transform duration-100 ease-out",
            sortDirection === "descending" ? "rotate-180" : "",
          )}
        />
      )}
    </span>
  );
}
