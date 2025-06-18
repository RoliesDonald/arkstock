// src/app/invoices/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { format } from "date-fns";

// --- IMPORT DATA DARI sampleDataInvoice.ts ---
import { invoiceData } from "@/lib/sampleTableData"; // Pastikan path ini benar!
// --- IMPORT TYPE DARI types/invoice.ts ---
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { useAppSelector } from "@/store/hooks";
import TableMain from "@/components/common/table/TableMain";
import WoDialog from "@/components/woDialog/_components/WoDialog";

// TableMain tampaknya tidak digunakan atau digantikan oleh TablesArea.
// Jika Anda memang ingin menggunakan TablesArea, import TableMain ini bisa dihapus.
// import TableMain from "@/components/common/table/TableMain";

export default function InvoicePage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  // Gunakan data yang diimpor sebagai nilai awal state
  const [allInvoices] = useState<Invoice[]>(invoiceData);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isNewInvoiceDialogOpen, setIsNewInvoiceDialogOpen] = useState(false);

  const invoiceColumns: ColumnDef<Invoice>[] = useMemo(
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
      { accessorKey: "invNum", header: "Inv. Number" }, // Sesuaikan dengan invNum
      { accessorKey: "customer", header: "Customer" }, // Sesuaikan dengan 'customer' di sample data
      {
        accessorKey: "totalAmount", // Menggunakan totalAmount dari sample data
        header: "Amount",
        cell: ({ row }) =>
          `Rp ${row.original.totalAmount.toLocaleString("id-ID")}`,
      },
      {
        accessorKey: "date", // invoiceDate
        header: "Issue Date",
        cell: ({ row }) =>
          // Pastikan row.original.date adalah objek Date
          format(new Date(row.original.date), "dd/MM/yyyy"),
      },
      {
        accessorKey: "finished", // Menggunakan 'finished' sebagai Due Date sementara
        header: "Due Date",
        cell: ({ row }) =>
          format(new Date(row.original.finished), "dd/MM/yyyy"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          // Status dari sampleDataInvoice.ts adalah string, cocokkan dengan enum InvoiceStatus
          const status = row.original.status as InvoiceStatus; // Type assertion untuk keamanan
          let statusColor = "";
          switch (status) {
            case InvoiceStatus.PAID:
              statusColor = "bg-green-500 text-white";
              break;
            case InvoiceStatus.PENDING:
            case InvoiceStatus.SENT:
            case InvoiceStatus.PARTIALLY_PAID:
              statusColor = "bg-yellow-500 text-black";
              break;
            case InvoiceStatus.OVERDUE:
              statusColor = "bg-red-500 text-white";
              break;
            case InvoiceStatus.DRAFT:
              statusColor = "bg-blue-300 text-blue-800";
              break;
            case InvoiceStatus.CANCELLED:
              statusColor = "bg-gray-500 text-white";
              break;
            case InvoiceStatus.REJECTED:
              statusColor = "bg-red-700 text-white";
              break;
            default:
              statusColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "action",
        enableHiding: false,
        cell: ({ row }) => {
          const invoiceData = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open Menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={
                    () => alert(`View Invoice ${invoiceData.invNum}`) // Menggunakan invNum
                  }
                >
                  View Invoice
                </DropdownMenuItem>
                <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const filteredInvoices = useMemo(() => {
    let currentInvoices = allInvoices;
    if (activeTab !== "all") {
      currentInvoices = currentInvoices.filter((inv) => {
        if (activeTab === "paid") return inv.status === InvoiceStatus.PAID;
        if (activeTab === "draft") return inv.status === InvoiceStatus.DRAFT;
        if (activeTab === "pending")
          return inv.status === InvoiceStatus.PENDING;
        if (activeTab === "sent") return inv.status === InvoiceStatus.SENT;
        if (activeTab === "partially_paid")
          return inv.status === InvoiceStatus.PARTIALLY_PAID;
        if (activeTab === "overdue")
          return inv.status === InvoiceStatus.OVERDUE;
        if (activeTab === "cancelled")
          return inv.status === InvoiceStatus.CANCELLED;
        if (activeTab === "rejected")
          return inv.status === InvoiceStatus.REJECTED;
        return true;
      });
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentInvoices = currentInvoices.filter((inv) =>
        Object.values(inv).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
    return currentInvoices;
  }, [allInvoices, activeTab, searchQuery]);

  const invoiceTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allInvoices.length },
      {
        value: "paid",
        label: "Paid",
        count: allInvoices.filter((inv) => inv.status === InvoiceStatus.PAID)
          .length,
      },
      {
        value: "pending",
        label: "Pending",
        count: allInvoices.filter((inv) => inv.status === InvoiceStatus.PENDING)
          .length,
      },
      {
        value: "sent",
        label: "Sent",
        count: allInvoices.filter((inv) => inv.status === InvoiceStatus.SENT)
          .length,
      },
      {
        value: "partially_paid", // Sesuaikan value dengan enum atau string status
        label: "Partially Paid",
        count: allInvoices.filter(
          (inv) => inv.status === InvoiceStatus.PARTIALLY_PAID
        ).length,
      },
      {
        value: "overdue",
        label: "Overdue",
        count: allInvoices.filter((inv) => inv.status === InvoiceStatus.OVERDUE)
          .length,
      },
      {
        value: "cancelled",
        label: "Cancelled",
        count: allInvoices.filter(
          (inv) => inv.status === InvoiceStatus.CANCELLED
        ).length,
      },
      {
        value: "rejected",
        label: "Rejected",
        count: allInvoices.filter(
          (inv) => inv.status === InvoiceStatus.REJECTED
        ).length,
      },
    ];
  }, [allInvoices]);

  const handleDialogClose = () => {
    setIsNewInvoiceDialogOpen(false);
  };

  return (
    <TableMain<Invoice>
      searchQuery={searchQuery} // Menggunakan TablesArea dan memberikan tipe Invoice
      data={filteredInvoices}
      columns={invoiceColumns}
      tabItems={invoiceTabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="No invoices found."
      isDialogOpen={isNewInvoiceDialogOpen}
      onOpenChange={setIsNewInvoiceDialogOpen}
      dialogContent={<WoDialog onClose={handleDialogClose} />}
      dialogTitle="Create New Invoice"
      dialogDescription="Fill in the details to create a new invoice."
    />
  );
}
