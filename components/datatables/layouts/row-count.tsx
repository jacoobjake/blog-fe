import { Table } from "@tanstack/react-table";

export default function RowCount<T>({ table }: { table: Table<T> }) {
  return (
    <div className="self-end">
      Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
      {table.getRowCount().toLocaleString()} Rows
    </div>
  );
}
