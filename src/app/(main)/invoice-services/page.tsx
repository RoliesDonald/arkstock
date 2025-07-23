"use client";

import TableMain from "@/components/common/table/TableMain";
import InvoiceServiceDialogWrapper from "@/components/dialog/invoiceServiceDialog/_components/InvoiceServiceDialogWrapper"; 
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
import { InvoiceService, RawInvoiceServiceApiResponse } from "@/types/invoiceServices"; 
import { InvoiceServiceFormValues } from "@/schemas/invoiceService"; 
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
import { fetchInvoiceServices, formatInvoiceServiceDates } from "@/store/slices/invoiceServiceSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function InvoiceServiceListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allInvoiceServices = useAppSelector((state) => state.invoiceServices.invoiceServices);
  const loading = useAppSelector((state) => state.invoiceServices.status === 'loading');
  const error = useAppSelector((state) => state.invoiceServices.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isInvoiceServiceDialogOpen, setIsInvoiceServiceDialogOpen] = useState<boolean>(false);
  const [editInvoiceServiceData, setEditInvoiceServiceData] = useState<InvoiceService | undefined>(undefined);
  const [invoiceServiceToDelete, setInvoiceServiceToDelete] = useState<InvoiceService | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchInvoiceServices());
  }, [dispatch]);

  const handleDetailInvoiceService = useCallback(
    (is: InvoiceService) => {
      router.push(`/invoice-services/${is.id}`);
    },
    [router]
  );

  const handleEditInvoiceService = useCallback((is: InvoiceService) => {
    setEditInvoiceServiceData(is);
    setIsInvoiceServiceDialogOpen(true);
  }, []);

  const handleSubmitInvoiceService = useCallback(
    async (values: InvoiceServiceFormValues) => {
      console.log("Submit Invoice Service:", values);
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
        const url = `http://localhost:3000/api/invoice-services${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<InvoiceService | RawInvoiceServiceApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<InvoiceService | RawInvoiceServiceApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Jasa Invoice berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsInvoiceServiceDialogOpen(false);
        setEditInvoiceServiceData(undefined);
        dispatch(fetchInvoiceServices()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Jasa Invoice.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteInvoiceService = useCallback(
    async (isId: string) => {
      console.log("Delete Invoice Service ID:", isId);
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
        await api.delete(`http://localhost:3000/api/invoice-services/${isId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Jasa Invoice berhasil dihapus.",
        });
        setInvoiceServiceToDelete(undefined);
        dispatch(fetchInvoiceServices()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Jasa Invoice.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const invoiceServiceColumns: ColumnDef<InvoiceService>[] = useMemo(
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
      { accessorKey: "invoice.invoiceNumber", header: "Nomor Invoice" },
      { accessorKey: "service.name", header: "Nama Jasa" },
      { accessorKey: "quantity", header: "Kuantitas" },
      { accessorKey: "unitPrice", header: "Harga Satuan", cell: ({ row }) => `Rp${row.original.unitPrice.toLocaleString('id-ID')}` },
      { accessorKey: "totalPrice", header: "Total Harga", cell: ({ row }) => `Rp${row.original.totalPrice.toLocaleString('id-ID')}` },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const is = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailInvoiceService(is)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditInvoiceService(is)}>
                  Edit Jasa Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setInvoiceServiceToDelete(is)} className="text-red-600">
                  Hapus Jasa Invoice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailInvoiceService, handleEditInvoiceService]
  );

  const invoiceServiceTabItems = useMemo(() => {
    // For InvoiceService, tabs might be based on invoice number or service category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allInvoiceServices.length },
    ];
  }, [allInvoiceServices]);

  const filteredInvoiceServices = useMemo(() => {
    let data = allInvoiceServices;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((is) =>
      (is.invoice?.invoiceNumber && is.invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (is.service?.name && is.service.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allInvoiceServices, activeTab, searchQuery]);

  const handleAddNewInvoiceServiceClick = useCallback(() => {
    setEditInvoiceServiceData(undefined);
    setIsInvoiceServiceDialogOpen(true);
  }, []);

  const handleInvoiceServiceDialogClose = useCallback(() => {
    setIsInvoiceServiceDialogOpen(false);
    setEditInvoiceServiceData(undefined);
  }, []);

  return (
    <>
      <TableMain<InvoiceService>
        searchQuery={searchQuery}
        data={filteredInvoiceServices}
        columns={invoiceServiceColumns}
        tabItems={invoiceServiceTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewInvoiceServiceClick}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Jasa Invoice ditemukan."
        }
      />

      <Dialog open={isInvoiceServiceDialogOpen} onOpenChange={setIsInvoiceServiceDialogOpen}>
        <InvoiceServiceDialogWrapper 
          onClose={handleInvoiceServiceDialogClose}
          initialData={editInvoiceServiceData}
          onSubmit={handleSubmitInvoiceService}
        />
      </Dialog>

      <AlertDialog open={!!invoiceServiceToDelete} onOpenChange={(open) => !open && setInvoiceServiceToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jasa invoice &quot;
              {invoiceServiceToDelete?.service?.name} untuk {invoiceServiceToDelete?.invoice?.invoiceNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInvoiceServiceToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => invoiceServiceToDelete && handleDeleteInvoiceService(invoiceServiceToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
