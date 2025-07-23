"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Hapus import Dialog dan DialogTrigger dari sini, karena akan ditangani di parent
// import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Download, Printer } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setSearchQuery } from "@/store/slices/tableSearchSlice";

interface TableMainProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchQuery: string;
  tabItems: { value: string; label: string; count: number }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  showAddButton?: boolean;
  onAddClick?: () => void; // <-- Tambahkan prop ini
  showDownloadPrintButtons?: boolean;
  emptyMessage?: string;
  // Hapus props terkait dialog dari sini
  // isDialogOpen: boolean;
  // onOpenChange: (open: boolean) => void;
  // dialogContent: React.ReactNode;
  // dialogTitle: string;
  // dialogDescription: string;
}

export default function TableMain<TData>({
  columns,
  data,
  searchQuery,
  tabItems,
  activeTab,
  onTabChange,
  showAddButton = false,
  onAddClick, // <-- Terima prop ini
  showDownloadPrintButtons = false,
  emptyMessage = "No data found.",
}: // Hapus dari destructuring
// isDialogOpen,
// onOpenChange,
// dialogContent,
// dialogTitle,
// dialogDescription,
TableMainProps<TData>) {
  const dispatch = useAppDispatch();
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(event.target.value));
    },
    [dispatch]
  );

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input placeholder="Cari..." value={searchQuery} onChange={handleSearchChange} className="max-w-sm" />
        <div className="ml-auto flex gap-2">
          {showDownloadPrintButtons && (
            <>
              <Button variant="outline" className="ml-auto">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </>
          )}
          {showAddButton && (
            // Button ini sekarang hanya memicu onAddClick
            <Button onClick={onAddClick}>Tambah Baru</Button>
          )}
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={onTabChange} className="mb-4">
        <TabsList>
          {tabItems.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label} ({item.count})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
