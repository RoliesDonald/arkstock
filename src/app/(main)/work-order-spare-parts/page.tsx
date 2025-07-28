"use client";

import TableMain from "@/components/common/table/TableMain";
import WorkOrderSparePartDialogWrapper from "@/components/dialog/workOrderSparePartDialog/_components/WorkOrderSparePartDialogWrapper"; 
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
import { WorkOrderSparePart, RawWorkOrderSparePartApiResponse } from "@/types/workOrderSpareParts"; 
import { WorkOrderSparePartFormValues } from "@/schemas/workOrderSparePart"; 
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
import { fetchWorkOrderSpareParts, formatWorkOrderSparePartDates } from "@/store/slices/workOrderSparePartSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function WorkOrderSparePartListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allWorkOrderSpareParts = useAppSelector((state) => state.workOrderSpareParts.workOrderSpareParts);
  const loading = useAppSelector((state) => state.workOrderSpareParts.status === 'loading');
  const error = useAppSelector((state) => state.workOrderSpareParts.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isWorkOrderSparePartDialogOpen, setIsWorkOrderSparePartDialogOpen] = useState<boolean>(false);
  const [editWorkOrderSparePartData, setEditWorkOrderSparePartData] = useState<WorkOrderSparePart | undefined>(undefined);
  const [workOrderSparePartToDelete, setWorkOrderSparePartToDelete] = useState<WorkOrderSparePart | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchWorkOrderSpareParts());
  }, [dispatch]);

  const handleDetailWorkOrderSparePart = useCallback(
    (wosp: WorkOrderSparePart) => {
      router.push(`/work-order-spare-parts/${wosp.id}`);
    },
    [router]
  );

  const handleEditWorkOrderSparePart = useCallback((wosp: WorkOrderSparePart) => {
    setEditWorkOrderSparePartData(wosp);
    setIsWorkOrderSparePartDialogOpen(true);
  }, []);

  const handleSubmitWorkOrderSparePart = useCallback(
    async (values: WorkOrderSparePartFormValues) => {
      console.log("Submit Work Order Spare Part:", values);
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
        const url = `http://localhost:3000/api/work-order-spare-parts${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<WorkOrderSparePart | RawWorkOrderSparePartApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<WorkOrderSparePart | RawWorkOrderSparePartApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Spare Part Work Order berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsWorkOrderSparePartDialogOpen(false);
        setEditWorkOrderSparePartData(undefined);
        dispatch(fetchWorkOrderSpareParts()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Spare Part Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteWorkOrderSparePart = useCallback(
    async (wospId: string) => {
      console.log("Delete Work Order Spare Part ID:", wospId);
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
        await api.delete(`http://localhost:3000/api/work-order-spare-parts/${wospId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Spare Part Work Order berhasil dihapus.",
        });
        setWorkOrderSparePartToDelete(undefined);
        dispatch(fetchWorkOrderSpareParts()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Spare Part Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const workOrderSparePartColumns: ColumnDef<WorkOrderSparePart>[] = useMemo(
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
          const wosp = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailWorkOrderSparePart(wosp)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditWorkOrderSparePart(wosp)}>
                  Edit Spare Part Work Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWorkOrderSparePartToDelete(wosp)} className="text-red-600">
                  Hapus Spare Part Work Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailWorkOrderSparePart, handleEditWorkOrderSparePart]
  );

  const workOrderSparePartTabItems = useMemo(() => {
    // For WorkOrderSparePart, tabs might be based on work order status or spare part category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allWorkOrderSpareParts.length },
    ];
  }, [allWorkOrderSpareParts]);

  const filteredWorkOrderSpareParts = useMemo(() => {
    let data = allWorkOrderSpareParts;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((wosp) =>
      (wosp.workOrder?.workOrderNumber && wosp.workOrder.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wosp.sparePart?.partName && wosp.sparePart.partName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wosp.sparePart?.partNumber && wosp.sparePart.partNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allWorkOrderSpareParts, searchQuery]);

  const handleAddNewWorkOrderSparePartClick = useCallback(() => {
    setEditWorkOrderSparePartData(undefined);
    setIsWorkOrderSparePartDialogOpen(true);
  }, []);

  const handleWorkOrderSparePartDialogClose = useCallback(() => {
    setIsWorkOrderSparePartDialogOpen(false);
    setEditWorkOrderSparePartData(undefined);
  }, []);

  return (
    <>
      <TableMain<WorkOrderSparePart>
        searchQuery={searchQuery}
        data={filteredWorkOrderSpareParts}
        columns={workOrderSparePartColumns}
        tabItems={workOrderSparePartTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewWorkOrderSparePartClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Spare Part Work Order ditemukan."
        }
      />

      <Dialog open={isWorkOrderSparePartDialogOpen} onOpenChange={setIsWorkOrderSparePartDialogOpen}>
        <WorkOrderSparePartDialogWrapper 
          onClose={handleWorkOrderSparePartDialogClose}
          initialData={editWorkOrderSparePartData}
          onSubmit={handleSubmitWorkOrderSparePart}
        />
      </Dialog>

      <AlertDialog open={!!workOrderSparePartToDelete} onOpenChange={(open) => !open && setWorkOrderSparePartToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus spare part work order &quot;
              {workOrderSparePartToDelete?.sparePart?.partName} untuk {workOrderSparePartToDelete?.workOrder?.workOrderNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWorkOrderSparePartToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => workOrderSparePartToDelete && handleDeleteWorkOrderSparePart(workOrderSparePartToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
