// src/components/common/table/TablesArea.tsx
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
import { FileDown, Printer, ChevronDown, MoreVertical } from "lucide-react";
import React, { useState, useMemo } from "react";
import PaginationArea from "./pagination/PaginationArea";
import Link from "next/link";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegSquarePlus } from "react-icons/fa6";

// --- IMPORT DIALOG COMPONENTS DARI SHADCN UI ---
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Import WoDialog (versi yang sekarang hanya form)
import WoDialog from "@/components/woDialog/_components/WoDialog"; // Path ini sekarang mengacu pada file yang hanya berisi form

import {
  WoProgressStatus,
  WoPriorityType,
  workOrderData,
} from "@/lib/sampleTableData";
import { Checkbox } from "@/components/ui/checkbox"; // Pastikan Checkbox diimpor
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

interface TablesAreaProps {
  searchQuery: string;
}

export default function TablesArea({ searchQuery }: TablesAreaProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State untuk mengontrol dialog

  const tabItems = useMemo(() => {
    // ... (definisi tabItems Anda) ...
    return [
      { value: "all", label: "All", count: workOrderData.length },
      {
        value: "onPorcess",
        label: "On Process",
        count: workOrderData.filter(
          (d) => d.progresStatus === WoProgressStatus.ON_PROCESS
        ).length,
      },
      {
        value: "done",
        label: "Done",
        count: workOrderData.filter(
          (d) => d.progresStatus === WoProgressStatus.FINISHED
        ).length,
      },
      {
        value: "waitApproval",
        label: "Wait Approval",
        count: workOrderData.filter(
          (d) =>
            d.progresStatus === WoProgressStatus.WAITING_ESTIMATION_APPROVAL ||
            d.progresStatus === WoProgressStatus.WAITING_PART
        ).length,
      },
      {
        value: "cancel",
        label: "Cancelled",
        count: workOrderData.filter(
          (d) => d.progresStatus === WoProgressStatus.CANCELED
        ).length,
      },
      {
        value: "rejected",
        label: "Rejected",
        count: workOrderData.filter(
          (d) => d.progresStatus === WoProgressStatus.REJECTED
        ).length,
      },
      {
        value: "draft",
        label: "Draft",
        count: workOrderData.filter(
          (d) => d.progresStatus === WoProgressStatus.DRAFT
        ).length,
      },
    ];
  }, []);

  const filteredData = useMemo(() => {
    return workOrderData.filter((d) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "onPorcess" &&
          d.progresStatus === WoProgressStatus.ON_PROCESS) ||
        (activeTab === "done" &&
          d.progresStatus === WoProgressStatus.FINISHED) ||
        (activeTab === "waitApproval" &&
          (d.progresStatus === WoProgressStatus.WAITING_ESTIMATION_APPROVAL ||
            d.progresStatus === WoProgressStatus.WAITING_PART)) ||
        (activeTab === "cancel" &&
          d.progresStatus === WoProgressStatus.CANCELED) ||
        (activeTab === "rejected" &&
          d.progresStatus === WoProgressStatus.REJECTED) ||
        (activeTab === "draft" && d.progresStatus === WoProgressStatus.DRAFT);

      const matchesSearch =
        !searchQuery ||
        d.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const columns: ColumnDef<(typeof workOrderData)[0]>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "woNumber",
        header: "WO Number",
      },
      {
        accessorKey: "date",
        header: "Request Date",
        cell: ({ row }) =>
          new Date(row.original.date).toLocaleDateString("id-ID"),
      },
      {
        accessorKey: "customer",
        header: "Customer",
      },
      {
        accessorKey: "vehicleMake",
        header: "Vehicle Make",
      },
      {
        accessorKey: "licensePlate",
        header: "License Plate",
      },
      {
        accessorKey: "progresStatus",
        header: "Progress Status",
        cell: ({ row }) => {
          const progresStatus = row.original.progresStatus;
          let statusColor = "";
          switch (progresStatus) {
            case WoProgressStatus.ON_PROCESS:
              statusColor = "bg-blue-500 text-white";
              break;
            case WoProgressStatus.FINISHED:
              statusColor = "bg-green-500 text-white";
              break;
            case WoProgressStatus.PENDING_APPROVAL_RENTAL:
            case WoProgressStatus.WAITING_PART:
              statusColor = "bg-yellow-500 text-black";
              break;
            case WoProgressStatus.CANCELED:
              statusColor = "bg-gray-500 text-white";
              break;
            case WoProgressStatus.PENDING_VENDOR_ASSIGN:
              statusColor = "bg-orange-500 text-white";
              break;
            case WoProgressStatus.REJECTED:
              statusColor = "bg-red-700 text-white";
              break;
            case WoProgressStatus.DRAFT:
              statusColor = "bg-purple-500 text-white";
              break;
            default:
              statusColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
            >
              {progresStatus}
            </span>
          );
        },
      },
      {
        accessorKey: "priorityType",
        header: "Priority Type",
        cell: ({ row }) => {
          const priorityType = row.original.priorityType;
          let priorityColor = "";
          switch (priorityType) {
            case WoPriorityType.NORMAL:
              priorityColor = "bg-green-300 text-green-800";
              break;
            case WoPriorityType.URGENT:
              priorityColor = "bg-yellow-300 text-yellow-800";
              break;
            case WoPriorityType.EMERGENCY:
              priorityColor = "bg-red-500 text-white";
              break;
            default:
              priorityColor = "bg-gray-300 text-gray-800";
          }
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColor}`}
            >
              {priorityType}
            </span>
          );
        },
      },
      {
        id: "action",
        enableHiding: false,
        cell: ({ row }) => {
          const workOrderData = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 ">
                  <span className="sr-only">Open Menu</span>
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(workOrderData.licensePlate)
                  }
                >
                  Copy License Plate
                </DropdownMenuItem>
                <DropdownMenuItem>View WO</DropdownMenuItem>
                <DropdownMenuItem>View WO Detail</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: pagination,
    },
    onPaginationChange: setPagination,
  });

  const currentTabLabel =
    tabItems.find((tab) => tab.value === activeTab)?.label || "All";

  // Handler submit form dari WoDialog
  const handleWoSubmit = async (values: any) => {
    // Gunakan WorkOrderFormValues jika Redux sudah diaktifkan
    console.log("TablesArea: Submitting new WO from dialog", values);
    // Contoh tanpa Redux Toolkit dulu (sesuai permintaan)
    console.log("WO data to save:", values);
    alert("Simulasi: Work Order baru berhasil dibuat (tanpa API/Redux)"); // Placeholder
    setIsDialogOpen(false); // Tutup dialog setelah simulasi sukses
    // Jika Anda ingin mengupdate data dummy secara lokal:
    // setWorkOrderData((prev) => [...prev, { ...values, id: Date.now().toString(), date: new Date(values.date), schedule: new Date(values.schedule) }]);
  };

  return (
    <Card className="shadow-none">
      <div className="">
        <div className="w-full border-dashed border-2 rounded-md">
          <div className="flex items-center justify-between mx-2 my-2 max-md:flex-col max-sm:h[132px] max-sm:w-full">
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10 max-sm:w-full"
                >
                  {currentTabLabel} (
                  {tabItems.find((tab) => tab.value === activeTab)?.count || 0})
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {tabItems.map((tab) => (
                  <DropdownMenuItem
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={
                      activeTab === tab.value ? "bg-arkRed-500 text-white" : ""
                    }
                  >
                    {tab.label} ({tab.count})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Buttons Download/Print/Add/New WO */}
            <div className="flex gap-2 max-sm:flex-row max-sm:w-full ">
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-arkBlue-800 hover:bg-arkBlue-600 text-arkBg-50"
                  >
                    <IoIosAddCircleOutline size="24px" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[80vw] p-10">
                  {/* --- DIALOG HEADER, TITLE, DESCRIPTION DI SINI --- */}
                  <DialogHeader>
                    <DialogTitle className="text-arkBlue-800">
                      Buat Work Order Baru
                    </DialogTitle>
                    <DialogDescription>
                      Isi detail Work Order untuk membuat WO baru di sistem.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Konten form dari WoDialog */}
                  {/* onFormSubmit akan memanggil handleWoSubmit di TablesArea */}
                  <WoDialog
                    onClose={() => setIsDialogOpen(false)} // Pass fungsi untuk menutup dialog
                    // Jika Anda ingin menggunakan status loading/error Redux setelah diaktifkan
                    // isLoading={woStatus === 'loading'}
                    // apiError={woError}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table */}
          <div className="w-full mt-9">
            <div>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="py-4">
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
                          <TableCell key={cell.id} className="py-3">
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
                        No results.
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
