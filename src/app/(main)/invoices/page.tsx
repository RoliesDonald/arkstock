"use client";

import TableMain from "@/components/common/table/TableMain";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Invoice, RawInvoiceApiResponse } from "@/types/invoice";
import { InvoiceFormValues } from "@/schemas/invoice";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { fetchInvoices, formatInvoiceDates } from "@/store/slices/invoiceSlice";
import { api } from "@/lib/utils/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import InvoiceDialogWrapper from "@/components/dialog/invoiceDialog/InvoiceDialogWrapper";

export default function InvoiceListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allInvoices = useAppSelector((state) => state.invoices.invoices);
  const loading = useAppSelector((state) => state.invoices.status === 'loading');
  const error = useAppSelector((state) => state.invoices.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState<boolean>(false);
  const [editInvoiceData, setEditInvoiceData] = useState<Invoice | undefined>(undefined);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const handleDetailInvoice = useCallback(
    (invoice: Invoice) => {
      router.push(`/invoices/${invoice.id}`);
    },
    [router]
  );

  const handleEditInvoice = useCallback((invoice: Invoice) => {
    setEditInvoiceData(invoice);
    setIsInvoiceDialogOpen(true);
  }, []);

  const handleSubmitInvoice = useCallback(
    async (values: InvoiceFormValues) => {
      console.log("Submit Invoice:", values);
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Tidak ada token otentikasi. Silakan login kembali.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      try {
        const url = `http://localhost:3000/api/invoices${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<Invoice | RawInvoiceApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<Invoice | RawInvoiceApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Invoice berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsInvoiceDialogOpen(false);
        setEditInvoiceData(undefined);
        dispatch(fetchInvoices()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Invoice.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteInvoice = useCallback(
    async (invoiceId: string) => {
      console.log("Delete Invoice ID:", invoiceId);
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Tidak ada token otentikasi. Silakan login kembali.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      try {
        await api.delete(`http://localhost:3000/api/invoices/${invoiceId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Invoice berhasil dihapus.",
        });
        setInvoiceToDelete(undefined);
        dispatch(fetchInvoices()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Invoice.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const invoiceColumns: ColumnDef<Invoice>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() ? true : (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all rows"
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
      { accessorKey: "invoiceNumber", header: "Nomor Invoice" },
      { 
        accessorKey: "workOrder.workOrderNumber", // Menampilkan nomor Work Order
        header: "Nomor Work Order",
        cell: ({ row }) => row.original.workOrder?.workOrderNumber || "N/A"
      },
      { 
        accessorKey: "invoiceDate", 
        header: "Tanggal Invoice",
        cell: ({ row }) => format(row.original.invoiceDate, "dd MMM yyyy", { locale: localeId }) 
      },
      { accessorKey: "totalAmount", header: "Jumlah Total", cell: ({ row }) => `Rp${row.original.totalAmount.toLocaleString('id-ID')}` },
      { accessorKey: "status", header: "Status" },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const invoice = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailInvoice(invoice)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                  Edit Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setInvoiceToDelete(invoice)} className="text-red-600">
                  Hapus Invoice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailInvoice, handleEditInvoice]
  );

  const invoiceTabItems = useMemo(() => {
    const statusCounts = allInvoices.reduce((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {} as Record<Invoice['status'], number>);

    return [
      { value: "all", label: "All", count: allInvoices.length },
      { value: "DRAFT", label: "Draft", count: statusCounts.DRAFT || 0 },
      { value: "PENDING", label: "Pending", count: statusCounts.PENDING || 0 },
      { value: "PAID", label: "Paid", count: statusCounts.PAID || 0 },
      { value: "CANCELED", label: "Canceled", count: statusCounts.CANCELED || 0 },
      { value: "OVERDUE", label: "Overdue", count: statusCounts.OVERDUE || 0 },
      { value: "REJECTED", label: "Rejected", count: statusCounts.REJECTED || 0 },
      { value: "SENT", label: "Sent", count: statusCounts.SENT || 0 },
      { value: "PARTIALLY_PAID", label: "Partially Paid", count: statusCounts.PARTIALLY_PAID || 0 },
    ];
  }, [allInvoices]);

  const filteredInvoices = useMemo(() => {
    let data = allInvoices;

    if (activeTab !== "all") {
      data = data.filter((invoice) => invoice.status === activeTab);
    }

    return data.filter((invoice) =>
      (invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (invoice.workOrder?.workOrderNumber && invoice.workOrder.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (invoice.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allInvoices, activeTab, searchQuery]);

  const handleAddNewInvoiceClick = useCallback(() => {
    setEditInvoiceData(undefined);
    setIsInvoiceDialogOpen(true);
  }, []);

  const handleInvoiceDialogClose = useCallback(() => {
    setIsInvoiceDialogOpen(false);
    setEditInvoiceData(undefined);
  }, []);

  return (
    <>
      <TableMain<Invoice>
        searchQuery={searchQuery}
        data={filteredInvoices}
        columns={invoiceColumns}
        tabItems={invoiceTabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showAddButton={true}
        onAddClick={handleAddNewInvoiceClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Invoice ditemukan."
        }
      />

      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <InvoiceDialogWrapper
          onClose={handleInvoiceDialogClose}
          initialData={editInvoiceData}
          onSubmit={handleSubmitInvoice}
        />
      </Dialog>

      <AlertDialog open={!!invoiceToDelete} onOpenChange={(open) => !open && setInvoiceToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus invoice &quot;
              {invoiceToDelete?.invoiceNumber}
              {invoiceToDelete?.workOrder?.workOrderNumber ? ` (WO: ${invoiceToDelete.workOrder.workOrderNumber})` : ''}
              &quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInvoiceToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => invoiceToDelete && handleDeleteInvoice(invoiceToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
