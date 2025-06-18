// src/components/common/table/TableMain.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown, Printer, ChevronDown } from "lucide-react"; // MoreVertical bisa dihapus jika tidak digunakan di sini
import React, { useState, useMemo } from "react";
import PaginationArea from "./pagination/PaginationArea";
import { IoIosAddCircleOutline } from "react-icons/io";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { Checkbox } from "@/components/ui/checkbox";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

// Mendefinisikan interface untuk tab item agar reusable
interface TabItem {
  value: string;
  label: string;
  count: number;
}

// Mendefinisikan props untuk TableMain yang lebih generik
interface TableMainProps<TData extends object> {
  data: TData[]; // Data yang akan ditampilkan di tabel
  columns: ColumnDef<TData>[]; // Definisi kolom untuk tabel
  searchQuery?: string; // Query pencarian (opsional)
  tabItems?: TabItem[]; // Item tab (opsional, jika tabel membutuhkan tab filtering)
  onAddNewClick?: () => void; // Fungsi callback ketika tombol "Add New" diklik
  dialogContent?: React.ReactNode; // Konten untuk dialog "Add New" (opsional)
  dialogTitle?: string; // Judul dialog
  dialogDescription?: string; // Deskripsi dialog
  showAddButton?: boolean; // Menampilkan tombol "Add New" atau tidak
  onAddButtonClick?: () => void; // Callback ketika tombol "Add New" diklik (opsional)
  showDownloadPrintButtons?: boolean; // Menampilkan tombol Download/Print atau tidak
  emptyMessage?: string; // Pesan jika tidak ada hasil
  onTabChange?: (tab: string) => void; // Callback ketika tab berubah (opsional)
  activeTab?: string; // Tab aktif (opsional, jika ingin kontrol dari luar)
  isDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Gunakan React.memo untuk mencegah re-render yang tidak perlu jika props tidak berubah
export default function TableMain<TData extends object>({
  data,
  columns,
  searchQuery = "", // Default kosong
  tabItems, // Opsional
  onAddNewClick, // Opsional
  dialogContent, // Opsional
  dialogTitle, // Opsional
  dialogDescription, // Opsional
  showAddButton = true, // Default true
  showDownloadPrintButtons = true, // Default true
  emptyMessage = "No results.", // Default message
  onTabChange, // Opsional
  activeTab,
  isDialogOpen,
  onOpenChange,
}: TableMainProps<TData>) {
  // const [activeTab, setActiveTab] = useState(tabItems?.[0]?.value || "all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: pagination,
    },
    onPaginationChange: setPagination,
  });

  const currentTabLabel =
    tabItems?.find((tab) => tab.value === activeTab)?.label || "All";
  const currentTabCount =
    tabItems?.find((tab) => tab.value === activeTab)?.count || 0;

  return (
    <Card className="shadow-none">
      <div className="">
        <div className="w-full rounded-md">
          <div className="flex items-center justify-between mx-2 my-2 max-md:flex-col max-sm:h[132px] max-sm:w-full">
            {/* Dropdown Menu untuk Tabs (Hanya render jika tabItems disediakan) */}
            {tabItems && tabItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-10 max-sm:w-full"
                  >
                    {currentTabLabel} ({currentTabCount})
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {tabItems.map((tab) => (
                    <DropdownMenuItem
                      key={tab.value}
                      onClick={() => onTabChange && onTabChange(tab.value)}
                      className={
                        activeTab === tab.value
                          ? "bg-arkRed-500 text-white"
                          : ""
                      }
                    >
                      {tab.label} ({tab.count})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Buttons Download/Print/Add/New WO */}
            <div className="flex gap-2 max-sm:flex-row max-sm:w-full ">
              {showDownloadPrintButtons && (
                <>
                  <Button
                    size={"sm"}
                    className="flex items-center gap-2 max-lg:w-full max-sm:mt-2 bg-arkBlue-800 text-arkBg-50 rounded-full"
                  >
                    <FileDown className="size-4" />
                    <span>Download</span>
                  </Button>
                  <Button
                    size={"sm"}
                    className="flex items-center bg-arkBlue-800 text-arkBg-50 gap-2 max-lg:w-full max-sm:mt-2 rounded-full"
                  >
                    <Printer className="size-4" />
                    <span>Print</span>
                  </Button>
                  <Separator
                    orientation="vertical"
                    className="border border-arkBlue-500 mx-3 h-auto"
                  />
                </>
              )}

              {showAddButton && (
                <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-arkBlue-800 hover:bg-arkBlue-600 text-arkBg-50"
                    >
                      <IoIosAddCircleOutline size="24px" />
                    </Button>
                  </DialogTrigger>
                  {dialogContent && (
                    <DialogContent
                      className="max-w-[80vw] p-10"
                      onPointerDownOutside={(e) => e.preventDefault()}
                      onEscapeKeyDown={(e) => e.preventDefault()}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-arkBlue-800">
                          {dialogTitle || "Add New Item"}
                        </DialogTitle>
                        <DialogDescription>
                          {dialogDescription ||
                            "Fill in the details to add a new item to the system."}
                        </DialogDescription>
                      </DialogHeader>
                      {/* Render konten dialog yang disediakan melalui props */}
                      {dialogContent}
                    </DialogContent>
                  )}
                </Dialog>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="w-full mt-4">
            <div className="p-2">
              <Table className="w-full">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="py-3 text-arkBg-700 overflow-hidden whitespace-nowrap truncate"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {emptyMessage}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <PaginationArea table={table} />
    </Card>
  );
}
