"use client";

import TableMain from "@/components/common/table/TableMain";
import InvoiceItemDialogWrapper from "@/components/dialog/invoiceItemDialog/_components/InvoiceItemDialogWrapper"; 
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
import { InvoiceItem, RawInvoiceItemApiResponse } from "@/types/invoiceItems"; 
import { InvoiceItemFormValues } from "@/schemas/invoiceItem"; 
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
import { fetchInvoiceItems, formatInvoiceItemDates } from "@/store/slices/invoiceItemSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function InvoiceItemListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allInvoiceItems = useAppSelector((state) => state.invoiceItems.invoiceItems);
  const loading = useAppSelector((state) => state.invoiceItems.status === 'loading');
  const error = useAppSelector((state) => state.invoiceItems.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isInvoiceItemDialogOpen, setIsInvoiceItemDialogOpen] = useState<boolean>(false);
  const [editInvoiceItemData, setEditInvoiceItemData] = useState<InvoiceItem | undefined>(undefined);
  const [invoiceItemToDelete, setInvoiceItemToDelete] = useState<InvoiceItem | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchInvoiceItems());
  }, [dispatch]);

  const handleDetailInvoiceItem = useCallback(
    (ii: InvoiceItem) => {
      router.push(`/invoice-items/${ii.id}`);
    },
    [router]
  );

  const handleEditInvoiceItem = useCallback((ii: InvoiceItem) => {
    setEditInvoiceItemData(ii);
    setIsInvoiceItemDialogOpen(true);
  }, []);

  const handleSubmitInvoiceItem = useCallback(
    async (values: InvoiceItemFormValues) => {
      console.log("Submit Invoice Item:", values);
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
        const url = `http://localhost:3000/api/invoice-items${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<InvoiceItem | RawInvoiceItemApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<InvoiceItem | RawInvoiceItemApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Item Invoice berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsInvoiceItemDialogOpen(false);
        setEditInvoiceItemData(undefined);
        dispatch(fetchInvoiceItems()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Item Invoice.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteInvoiceItem = useCallback(
    async (iiId: string) => {
      console.log("Delete Invoice Item ID:", iiId);
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
        await api.delete(`http://localhost:3000/api/invoice-items/${iiId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Item Invoice berhasil dihapus.",
        });
        setInvoiceItemToDelete(undefined);
        dispatch(fetchInvoiceItems()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Item Invoice.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const invoiceItemColumns: ColumnDef<InvoiceItem>[] = useMemo(
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
      { accessorKey: "sparePart.partName", header: "Nama Spare Part" },
      { accessorKey: "sparePart.partNumber", header: "Nomor Part" },
      { accessorKey: "quantity", header: "Kuantitas" },
      { accessorKey: "unitPrice", header: "Harga Satuan", cell: ({ row }) => `Rp${row.original.unitPrice.toLocaleString('id-ID')}` },
      { accessorKey: "totalPrice", header: "Total Harga", cell: ({ row }) => `Rp${row.original.totalPrice.toLocaleString('id-ID')}` },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const ii = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailInvoiceItem(ii)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditInvoiceItem(ii)}>
                  Edit Item Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setInvoiceItemToDelete(ii)} className="text-red-600">
                  Hapus Item Invoice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailInvoiceItem, handleEditInvoiceItem]
  );

  const invoiceItemTabItems = useMemo(() => {
    // For InvoiceItem, tabs might be based on invoice status or spare part category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allInvoiceItems.length },
    ];
  }, [allInvoiceItems]);

  const filteredInvoiceItems = useMemo(() => {
    let data = allInvoiceItems;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((ii) =>
      (ii.invoice?.invoiceNumber && ii.invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ii.sparePart?.partName && ii.sparePart.partName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ii.sparePart?.partNumber && ii.sparePart.partNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allInvoiceItems, searchQuery]);

  const handleAddNewInvoiceItemClick = useCallback(() => {
    setEditInvoiceItemData(undefined);
    setIsInvoiceItemDialogOpen(true);
  }, []);

  const handleInvoiceItemDialogClose = useCallback(() => {
    setIsInvoiceItemDialogOpen(false);
    setEditInvoiceItemData(undefined);
  }, []);

  return (
    <>
      <TableMain<InvoiceItem>
        searchQuery={searchQuery}
        data={filteredInvoiceItems}
        columns={invoiceItemColumns}
        tabItems={invoiceItemTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewInvoiceItemClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Item Invoice ditemukan."
        }
      />

      <Dialog open={isInvoiceItemDialogOpen} onOpenChange={setIsInvoiceItemDialogOpen}>
        <InvoiceItemDialogWrapper 
          onClose={handleInvoiceItemDialogClose}
          initialData={editInvoiceItemData}
          onSubmit={handleSubmitInvoiceItem}
        />
      </Dialog>

      <AlertDialog open={!!invoiceItemToDelete} onOpenChange={(open) => !open && setInvoiceItemToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus item invoice &quot;
              {invoiceItemToDelete?.sparePart?.partName} untuk {invoiceItemToDelete?.invoice?.invoiceNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInvoiceItemToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => invoiceItemToDelete && handleDeleteInvoiceItem(invoiceItemToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
