// src/components/common/table/pagination/PaginationSelection.tsx
"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";

interface PaginationSelectionProps<TData> {
  table: Table<TData>;
}

export default function PaginationSelection<TData>({
  table,
}: PaginationSelectionProps<TData>) {
  // Debugging: Log nilai yang diterima dari table
  console.log(
    "PaginationSelection - current pageSize (from table state):",
    table.getState().pagination.pageSize
  );

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium text-arkBg-700">Rows per page</p>
      <Select
        value={`${table.getState().pagination.pageSize}`} // Pastikan ini string
        onValueChange={(value) => {
          console.log("PaginationSelection - selected new pageSize:", value); // Debugging
          table.setPageSize(Number(value)); // <--- Ini harus memicu update state di table
        }}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue
            placeholder={`${table.getState().pagination.pageSize}`}
          />
        </SelectTrigger>
        <SelectContent>
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
