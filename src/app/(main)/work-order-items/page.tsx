"use client";

import TableMain from "@/components/common/table/TableMain";
import WorkOrderItemDialogWrapper from "@/components/dialog/workOrderItemDialog/_components/WorkOrderItemDialogWrapper"; 
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
import { WorkOrderItem, RawWorkOrderItemApiResponse } from "@/types/workOrderItems"; 
import { WorkOrderItemFormValues } from "@/schemas/workOrderItem"; 
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
import { fetchWorkOrderItems, formatWorkOrderItemDates } from "@/store/slices/workOrderItemSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function WorkOrderItemListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allWorkOrderItems = useAppSelector((state) => state.workOrderItems.workOrderItems);
  const loading = useAppSelector((state) => state.workOrderItems.status === 'loading');
  const error = useAppSelector((state) => state.workOrderItems.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isWorkOrderItemDialogOpen, setIsWorkOrderItemDialogOpen] = useState<boolean>(false);
  const [editWorkOrderItemData, setEditWorkOrderItemData] = useState<WorkOrderItem | undefined>(undefined);
  const [workOrderItemToDelete, setWorkOrderItemToDelete] = useState<WorkOrderItem | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchWorkOrderItems());
  }, [dispatch]);

  const handleDetailWorkOrderItem = useCallback(
    (woi: WorkOrderItem) => {
      router.push(`/work-order-items/${woi.id}`);
    },
    [router]
  );

  const handleEditWorkOrderItem = useCallback((woi: WorkOrderItem) => {
    setEditWorkOrderItemData(woi);
    setIsWorkOrderItemDialogOpen(true);
  }, []);

  const handleSubmitWorkOrderItem = useCallback(
    async (values: WorkOrderItemFormValues) => {
      console.log("Submit Work Order Item:", values);
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
        const url = `http://localhost:3000/api/work-order-items${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<WorkOrderItem | RawWorkOrderItemApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<WorkOrderItem | RawWorkOrderItemApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Item Work Order berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsWorkOrderItemDialogOpen(false);
        setEditWorkOrderItemData(undefined);
        dispatch(fetchWorkOrderItems()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Item Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteWorkOrderItem = useCallback(
    async (woiId: string) => {
      console.log("Delete Work Order Item ID:", woiId);
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
        await api.delete(`http://localhost:3000/api/work-order-items/${woiId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Item Work Order berhasil dihapus.",
        });
        setWorkOrderItemToDelete(undefined);
        dispatch(fetchWorkOrderItems()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Item Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const workOrderItemColumns: ColumnDef<WorkOrderItem>[] = useMemo(
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
      { accessorKey: "workOrder.workOrderNumber", header: "Nomor WO" },
      { accessorKey: "sparePart.partName", header: "Nama Spare Part" },
      { accessorKey: "sparePart.partNumber", header: "Nomor Part" },
      { accessorKey: "quantity", header: "Kuantitas" },
      { accessorKey: "unitPrice", header: "Harga Satuan", cell: ({ row }) => `Rp${row.original.unitPrice.toLocaleString('id-ID')}` },
      { accessorKey: "totalPrice", header: "Total Harga", cell: ({ row }) => `Rp${row.original.totalPrice.toLocaleString('id-ID')}` },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const woi = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailWorkOrderItem(woi)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditWorkOrderItem(woi)}>
                  Edit Item Work Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWorkOrderItemToDelete(woi)} className="text-red-600">
                  Hapus Item Work Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailWorkOrderItem, handleEditWorkOrderItem]
  );

  const workOrderItemTabItems = useMemo(() => {
    // For WorkOrderItem, tabs might be based on work order status or spare part category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allWorkOrderItems.length },
    ];
  }, [allWorkOrderItems]);

  const filteredWorkOrderItems = useMemo(() => {
    let data = allWorkOrderItems;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((woi) =>
      (woi.workOrder?.workOrderNumber && woi.workOrder.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (woi.sparePart?.partName && woi.sparePart.partName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (woi.sparePart?.partNumber && woi.sparePart.partNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allWorkOrderItems, searchQuery]);

  const handleAddNewWorkOrderItemClick = useCallback(() => {
    setEditWorkOrderItemData(undefined);
    setIsWorkOrderItemDialogOpen(true);
  }, []);

  const handleWorkOrderItemDialogClose = useCallback(() => {
    setIsWorkOrderItemDialogOpen(false);
    setEditWorkOrderItemData(undefined);
  }, []);

  return (
    <>
      <TableMain<WorkOrderItem>
        searchQuery={searchQuery}
        data={filteredWorkOrderItems}
        columns={workOrderItemColumns}
        tabItems={workOrderItemTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewWorkOrderItemClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Item Work Order ditemukan."
        }
      />

      <Dialog open={isWorkOrderItemDialogOpen} onOpenChange={setIsWorkOrderItemDialogOpen}>
        <WorkOrderItemDialogWrapper 
          onClose={handleWorkOrderItemDialogClose}
          initialData={editWorkOrderItemData}
          onSubmit={handleSubmitWorkOrderItem}
        />
      </Dialog>

      <AlertDialog open={!!workOrderItemToDelete} onOpenChange={(open) => !open && setWorkOrderItemToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus item work order &quot;
              {workOrderItemToDelete?.sparePart?.partName} untuk Work Order {workOrderItemToDelete?.workOrder?.workOrderNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWorkOrderItemToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => workOrderItemToDelete && handleDeleteWorkOrderItem(workOrderItemToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
