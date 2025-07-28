// src/components/common/table/pagination/PaginationArea.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import PaginationSelection from "./PaginationSelection";
import { Table } from "@tanstack/react-table";

interface PaginationAreaProps<TData> {
  table: Table<TData>;
}

export default function PaginationArea<TData>({
  table,
}: PaginationAreaProps<TData>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // Debugging: Log state pagination dari props table
  console.log(
    "PaginationArea - Current Page Index:",
    table.getState().pagination.pageIndex
  );
  console.log(
    "PaginationArea - Page Size:",
    table.getState().pagination.pageSize
  );
  console.log("PaginationArea - Total Pages:", table.getPageCount());
  console.log("PaginationArea - Can Go Prev:", table.getCanPreviousPage());
  console.log("PaginationArea - Can Go Next:", table.getCanNextPage());

  return (
    <div
      className={`relative w-full h-[80px] max-sm:h-[260px] max-sm:pt-4 max-sm:pb-4 overflow-hidden flex justify-between item-center px-6 border-t max-sm:flex-col max-sm:gap-2`}
    >
      <PaginationSelection table={table} />
      <div className="flex gap-6 items-center max-sm:flex-col max-sm:mt-4 max-sm:gap-2">
        <span className="text-arkBg-700 text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <div className="flex items-center justify-end space-x-2">
          {/* BUTTON FIRST PAGE */}
          <Button
            variant={"outline"}
            className="size-9 w-12"
            size={"sm"}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronFirst />
          </Button>
          {/* BUTTON PREVIOUS PAGE */}
          <Button
            variant={"outline"}
            className="size-9 w-12"
            size={"sm"}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          {/* BUTTON NEXT PAGE */}
          <Button
            variant={"outline"}
            className="size-9 w-12"
            size={"sm"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          {/* BUTTON LAST PAGE */}
          <Button
            variant={"outline"}
            className="size-9 w-12"
            size={"sm"}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()} // Gunakan getCanNextPage() untuk tombol last page
          >
            <ChevronLast />
          </Button>
        </div>
      </div>
    </div>
  );
}
