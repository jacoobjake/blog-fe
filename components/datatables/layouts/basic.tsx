"use client";

import { flexRender, Table } from "@tanstack/react-table";
import { Spinner } from "@heroui/react";
import { UseQueryResult } from "@tanstack/react-query";

type BasicTableLayoutProps<T> = {
  table: Table<T>;
  query: Pick<UseQueryResult, "isLoading" | "isError" | "isFetching" | "error">;
};

export default function BasicTableLayout<T>({
  table,
  query,
}: BasicTableLayoutProps<T>) {
  const rows = table.getRowModel().rows;
  const headerGroups = table.getHeaderGroups();
  const columnCount = headerGroups[0]?.headers.length || 1;
  const pageSize = table.getState().pagination.pageSize;

  const emptyRowsCount = Math.max(0, pageSize - rows.length);
  const showDataWithLoader = query.isFetching && rows.length > 0;

  return (
    <div className="relative">
      <table className="w-full">
        <TableHeader headerGroups={headerGroups} />
        <tbody>
          {query.isLoading && !showDataWithLoader && (
            <LoadingRows pageSize={pageSize} columnCount={columnCount} />
          )}

          {query.isError && !query.isLoading && !showDataWithLoader && (
            <ErrorState
              pageSize={pageSize}
              columnCount={columnCount}
              error={query.error}
            />
          )}

          {!query.isLoading && !query.isError && !showDataWithLoader && (
            <>
              {rows.length === 0 ? (
                <NoResultsState pageSize={pageSize} columnCount={columnCount} />
              ) : (
                <>
                  <DataRows rows={rows} />
                  {emptyRowsCount > 0 && (
                    <EmptyPlaceholderRows
                      count={emptyRowsCount}
                      columnCount={columnCount}
                    />
                  )}
                </>
              )}
            </>
          )}

          {showDataWithLoader && (
            <>
              <DataRows rows={rows} opacity={50} />
              {emptyRowsCount > 0 && (
                <EmptyPlaceholderRows
                  count={emptyRowsCount}
                  columnCount={columnCount}
                  opacity={50}
                />
              )}
            </>
          )}
        </tbody>
      </table>

      {showDataWithLoader && <LoadingOverlay />}
    </div>
  );
}

// Component: Table Header
function TableHeader({ headerGroups }: { headerGroups: any[] }) {
  return (
    <thead className="bg-surface-secondary text-left">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header: any) => (
            <th
              key={header.id}
              colSpan={header.colSpan}
              className="p-2 first:rounded-tl-lg last:rounded-tr-lg"
            >
              <div>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

// Component: Loading Skeleton Rows
function LoadingRows({
  pageSize,
  columnCount,
}: {
  pageSize: number;
  columnCount: number;
}) {
  return (
    <>
      {Array.from({ length: pageSize }).map((_, index) => (
        <tr key={`loading-${index}`} className="border-b bg-surface h-13.25">
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <td key={`loading-${index}-${colIndex}`} className="p-2">
              <div className="h-5 bg-surface-secondary animate-pulse rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Component: Error State
function ErrorState({
  pageSize,
  columnCount,
  error,
}: {
  pageSize: number;
  columnCount: number;
  error: Error | null;
}) {
  const errorMessage =
    error?.message || "Error loading data. Please try again.";

  return (
    <>
      <tr className="border-b bg-surface">
        <td colSpan={columnCount} rowSpan={pageSize} className="p-2">
          <div
            className="flex items-center justify-center"
            style={{ height: "100%" }}
          >
            <span className="text-danger">{errorMessage}</span>
          </div>
        </td>
      </tr>
      {Array.from({ length: pageSize - 1 }).map((_, index) => (
        <tr
          key={`error-spacer-${index}`}
          className="border-b bg-surface h-13.25"
        />
      ))}
    </>
  );
}

// Component: No Results State
function NoResultsState({
  pageSize,
  columnCount,
}: {
  pageSize: number;
  columnCount: number;
}) {
  return (
    <>
      <tr className="border-b bg-surface">
        <td colSpan={columnCount} rowSpan={pageSize} className="p-2">
          <div
            className="flex items-center justify-center"
            style={{ height: "100%" }}
          >
            <span className="text-default-500">No results found</span>
          </div>
        </td>
      </tr>
      {Array.from({ length: pageSize - 1 }).map((_, index) => (
        <tr
          key={`no-results-spacer-${index}`}
          className="border-b bg-surface h-13.25"
        />
      ))}
    </>
  );
}

// Component: Data Rows
function DataRows({ rows, opacity }: { rows: any[]; opacity?: number }) {
  const opacityClass = opacity ? `opacity-${opacity}` : "";

  return (
    <>
      {rows.map((row) => (
        <tr
          key={row.id}
          className={`border-b bg-surface h-13.25 ${opacityClass}`}
        >
          {row.getVisibleCells().map((cell: any) => (
            <td key={cell.id} className="p-2">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Component: Empty Placeholder Rows
function EmptyPlaceholderRows({
  count,
  columnCount,
  opacity,
}: {
  count: number;
  columnCount: number;
  opacity?: number;
}) {
  const opacityClass = opacity ? `opacity-${opacity}` : "";

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <tr
          key={`empty-${index}`}
          className={`border-b bg-surface h-13.25 ${opacityClass}`}
        >
          <td colSpan={columnCount} className="p-2">
            &nbsp;
          </td>
        </tr>
      ))}
    </>
  );
}

// Component: Loading Overlay
function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-sm">
      <Spinner size="lg" />
    </div>
  );
}
