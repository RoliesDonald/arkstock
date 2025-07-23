"use client";

import TableMain from "@/components/common/table/TableMain";
import WorkOrderServiceDialogWrapper from "@/components/dialog/workOrderServiceDialog/_components/WorkOrderServiceDialogWrapper"; 
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
import { WorkOrderService, RawWorkOrderServiceApiResponse } from "@/types/workOrderServices"; 
import { WorkOrderServiceFormValues } from "@/schemas/workOrderService"; 
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
import { fetchWorkOrderServices, formatWorkOrderServiceDates } from "@/store/slices/workOrderServiceSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function WorkOrderServiceListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allWorkOrderServices = useAppSelector((state) => state.workOrderServices.workOrderServices);
  const loading = useAppSelector((state) => state.workOrderServices.status === 'loading');
  const error = useAppSelector((state) => state.workOrderServices.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isWorkOrderServiceDialogOpen, setIsWorkOrderServiceDialogOpen] = useState<boolean>(false);
  const [editWorkOrderServiceData, setEditWorkOrderServiceData] = useState<WorkOrderService | undefined>(undefined);
  const [workOrderServiceToDelete, setWorkOrderServiceToDelete] = useState<WorkOrderService | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchWorkOrderServices());
  }, [dispatch]);

  const handleDetailWorkOrderService = useCallback(
    (wos: WorkOrderService) => {
      router.push(`/work-order-services/${wos.id}`);
    },
    [router]
  );

  const handleEditWorkOrderService = useCallback((wos: WorkOrderService) => {
    setEditWorkOrderServiceData(wos);
    setIsWorkOrderServiceDialogOpen(true);
  }, []);

  const handleSubmitWorkOrderService = useCallback(
    async (values: WorkOrderServiceFormValues) => {
      console.log("Submit Work Order Service:", values);
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
        const url = `http://localhost:3000/api/work-order-services${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<WorkOrderService | RawWorkOrderServiceApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<WorkOrderService | RawWorkOrderServiceApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Jasa Work Order berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsWorkOrderServiceDialogOpen(false);
        setEditWorkOrderServiceData(undefined);
        dispatch(fetchWorkOrderServices()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Jasa Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteWorkOrderService = useCallback(
    async (wosId: string) => {
      console.log("Delete Work Order Service ID:", wosId);
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
        await api.delete(`http://localhost:3000/api/work-order-services/${wosId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Jasa Work Order berhasil dihapus.",
        });
        setWorkOrderServiceToDelete(undefined);
        dispatch(fetchWorkOrderServices()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Jasa Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const workOrderServiceColumns: ColumnDef<WorkOrderService>[] = useMemo(
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
      { accessorKey: "service.name", header: "Nama Jasa" },
      { accessorKey: "quantity", header: "Kuantitas" },
      { accessorKey: "unitPrice", header: "Harga Satuan", cell: ({ row }) => `Rp${row.original.unitPrice.toLocaleString('id-ID')}` },
      { accessorKey: "totalPrice", header: "Total Harga", cell: ({ row }) => `Rp${row.original.totalPrice.toLocaleString('id-ID')}` },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const wos = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailWorkOrderService(wos)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditWorkOrderService(wos)}>
                  Edit Jasa Work Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWorkOrderServiceToDelete(wos)} className="text-red-600">
                  Hapus Jasa Work Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailWorkOrderService, handleEditWorkOrderService]
  );

  const workOrderServiceTabItems = useMemo(() => {
    // For WorkOrderService, tabs might be based on work order status or service category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allWorkOrderServices.length },
    ];
  }, [allWorkOrderServices]);

  const filteredWorkOrderServices = useMemo(() => {
    let data = allWorkOrderServices;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((wos) =>
      (wos.workOrder?.workOrderNumber && wos.workOrder.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wos.service?.name && wos.service.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allWorkOrderServices, activeTab, searchQuery]);

  const handleAddNewWorkOrderServiceClick = useCallback(() => {
    setEditWorkOrderServiceData(undefined);
    setIsWorkOrderServiceDialogOpen(true);
  }, []);

  const handleWorkOrderServiceDialogClose = useCallback(() => {
    setIsWorkOrderServiceDialogOpen(false);
    setEditWorkOrderServiceData(undefined);
  }, []);

  return (
    <>
      <TableMain<WorkOrderService>
        searchQuery={searchQuery}
        data={filteredWorkOrderServices}
        columns={workOrderServiceColumns}
        tabItems={workOrderServiceTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewWorkOrderServiceClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Jasa Work Order ditemukan."
        }
      />

      <Dialog open={isWorkOrderServiceDialogOpen} onOpenChange={setIsWorkOrderServiceDialogOpen}>
        <WorkOrderServiceDialogWrapper 
          onClose={handleWorkOrderServiceDialogClose}
          initialData={editWorkOrderServiceData}
          onSubmit={handleSubmitWorkOrderService}
        />
      </Dialog>

      <AlertDialog open={!!workOrderServiceToDelete} onOpenChange={(open) => !open && setWorkOrderServiceToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jasa work order &quot;
              {workOrderServiceToDelete?.service?.name} untuk {workOrderServiceToDelete?.workOrder?.workOrderNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWorkOrderServiceToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => workOrderServiceToDelete && handleDeleteWorkOrderService(workOrderServiceToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
