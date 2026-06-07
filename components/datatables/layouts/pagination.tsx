import { Table } from "@tanstack/react-table";
import { Button, Input, ListBox, Select, Separator } from "@heroui/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

export default function Pagination<T>({ table }: { table: Table<T> }) {
  return (
    <div className="flex items-center gap-2 justify-end">
      <Button
        isIconOnly
        aria-label="First page"
        variant="outline"
        onClick={() => table.firstPage()}
        isDisabled={!table.getCanPreviousPage()}
      >
        <FiChevronsLeft />
      </Button>
      <Button
        isIconOnly
        aria-label="Previous page"
        variant="outline"
        onClick={() => table.previousPage()}
        isDisabled={!table.getCanPreviousPage()}
      >
        <FiChevronLeft />
      </Button>
      <Button
        isIconOnly
        aria-label="Next page"
        variant="outline"
        onClick={() => table.nextPage()}
        isDisabled={!table.getCanNextPage()}
      >
        <FiChevronRight />
      </Button>
      <Button
        isIconOnly
        aria-label="Last page"
        variant="outline"
        onClick={() => table.lastPage()}
        isDisabled={!table.getCanNextPage()}
      >
        <FiChevronsRight />
      </Button>
      <span className="flex items-center gap-2">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount().toLocaleString()}
        </strong>
      </span>
      <Separator orientation="vertical" />
      <span className="flex items-center gap-2">
        Go to page:
        <Input
          aria-label="Go to page"
          type="number"
          min="1"
          max={table.getPageCount()}
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
        />
      </span>
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
              <ListBox.Item key={pageSize} id={pageSize} textValue={pageSize.toString()}>
                Show {pageSize}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
