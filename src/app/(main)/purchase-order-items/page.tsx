"use client";

import TableMain from "@/components/common/table/TableMain";
import PurchaseOrderItemDialogWrapper from "@/components/dialog/purchaseOrderItemDialog/_components/PurchaseOrderItemDialogWrapper"; 
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
import { PurchaseOrderItem, RawPurchaseOrderItemApiResponse } from "@/types/purchaseOrderItems"; 
import { PurchaseOrderItemFormValues } from "@/schemas/purchaseOrderItem"; 
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
import { fetchPurchaseOrderItems, formatPurchaseOrderItemDates } from "@/store/slices/purchaseOrderItemSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function PurchaseOrderItemListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allPurchaseOrderItems = useAppSelector((state) => state.purchaseOrderItems.purchaseOrderItems);
  const loading = useAppSelector((state) => state.purchaseOrderItems.status === 'loading');
  const error = useAppSelector((state) => state.purchaseOrderItems.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isPurchaseOrderItemDialogOpen, setIsPurchaseOrderItemDialogOpen] = useState<boolean>(false);
  const [editPurchaseOrderItemData, setEditPurchaseOrderItemData] = useState<PurchaseOrderItem | undefined>(undefined);
  const [purchaseOrderItemToDelete, setPurchaseOrderItemToDelete] = useState<PurchaseOrderItem | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchPurchaseOrderItems());
  }, [dispatch]);

  const handleDetailPurchaseOrderItem = useCallback(
    (poi: PurchaseOrderItem) => {
      router.push(`/purchase-order-items/${poi.id}`);
    },
    [router]
  );

  const handleEditPurchaseOrderItem = useCallback((poi: PurchaseOrderItem) => {
    setEditPurchaseOrderItemData(poi);
    setIsPurchaseOrderItemDialogOpen(true);
  }, []);

  const handleSubmitPurchaseOrderItem = useCallback(
    async (values: PurchaseOrderItemFormValues) => {
      console.log("Submit Purchase Order Item:", values);
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
        const url = `http://localhost:3000/api/purchase-order-items${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<PurchaseOrderItem | RawPurchaseOrderItemApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<PurchaseOrderItem | RawPurchaseOrderItemApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Item Purchase Order berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsPurchaseOrderItemDialogOpen(false);
        setEditPurchaseOrderItemData(undefined);
        dispatch(fetchPurchaseOrderItems()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Item Purchase Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeletePurchaseOrderItem = useCallback(
    async (poiId: string) => {
      console.log("Delete Purchase Order Item ID:", poiId);
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
        await api.delete(`http://localhost:3000/api/purchase-order-items/${poiId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Item Purchase Order berhasil dihapus.",
        });
        setPurchaseOrderItemToDelete(undefined);
        dispatch(fetchPurchaseOrderItems()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Item Purchase Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const purchaseOrderItemColumns: ColumnDef<PurchaseOrderItem>[] = useMemo(
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
      { accessorKey: "purchaseOrder.poNumber", header: "Nomor PO" },
      { accessorKey: "sparePart.partName", header: "Nama Spare Part" },
      { accessorKey: "sparePart.partNumber", header: "Nomor Part" },
      { accessorKey: "quantity", header: "Kuantitas" },
      { accessorKey: "unitPrice", header: "Harga Satuan", cell: ({ row }) => `Rp${row.original.unitPrice.toLocaleString('id-ID')}` },
      { accessorKey: "totalPrice", header: "Total Harga", cell: ({ row }) => `Rp${row.original.totalPrice.toLocaleString('id-ID')}` },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const poi = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailPurchaseOrderItem(poi)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditPurchaseOrderItem(poi)}>
                  Edit Item Purchase Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPurchaseOrderItemToDelete(poi)} className="text-red-600">
                  Hapus Item Purchase Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailPurchaseOrderItem, handleEditPurchaseOrderItem]
  );

  const purchaseOrderItemTabItems = useMemo(() => {
    // For PurchaseOrderItem, tabs might be based on PO status or spare part category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allPurchaseOrderItems.length },
    ];
  }, [allPurchaseOrderItems]);

  const filteredPurchaseOrderItems = useMemo(() => {
    let data = allPurchaseOrderItems;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((poi) =>
      (poi.purchaseOrder?.poNumber && poi.purchaseOrder.poNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (poi.sparePart?.partName && poi.sparePart.partName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (poi.sparePart?.partNumber && poi.sparePart.partNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allPurchaseOrderItems, searchQuery]);

  const handleAddNewPurchaseOrderItemClick = useCallback(() => {
    setEditPurchaseOrderItemData(undefined);
    setIsPurchaseOrderItemDialogOpen(true);
  }, []);

  const handlePurchaseOrderItemDialogClose = useCallback(() => {
    setIsPurchaseOrderItemDialogOpen(false);
    setEditPurchaseOrderItemData(undefined);
  }, []);

  return (
    <>
      <TableMain<PurchaseOrderItem>
        searchQuery={searchQuery}
        data={filteredPurchaseOrderItems}
        columns={purchaseOrderItemColumns}
        tabItems={purchaseOrderItemTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewPurchaseOrderItemClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Item Purchase Order ditemukan."
        }
      />

      <Dialog open={isPurchaseOrderItemDialogOpen} onOpenChange={setIsPurchaseOrderItemDialogOpen}>
        <PurchaseOrderItemDialogWrapper 
          onClose={handlePurchaseOrderItemDialogClose}
          initialData={editPurchaseOrderItemData}
          onSubmit={handleSubmitPurchaseOrderItem}
        />
      </Dialog>

      <AlertDialog open={!!purchaseOrderItemToDelete} onOpenChange={(open) => !open && setPurchaseOrderItemToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus item purchase order &quot;
              {purchaseOrderItemToDelete?.sparePart?.partName} untuk {purchaseOrderItemToDelete?.purchaseOrder?.poNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPurchaseOrderItemToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => purchaseOrderItemToDelete && handleDeletePurchaseOrderItem(purchaseOrderItemToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
