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
import { WorkOrder, RawWorkOrderApiResponse } from "@/types/workOrder"; 
import { WorkOrderFormValues } from "@/schemas/workOrder"; 
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
import { fetchWorkOrders, formatWorkOrderDates } from "@/store/slices/workOrderSlice"; 
import { WoProgresStatus, WoPriorityType } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import WorkOrderDialogWrapper from "@/components/dialog/woDialog/_components/WorkOrderDialogWrapper";

export default function WorkOrderListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allWorkOrders = useAppSelector((state) => state.workOrders.workOrders);
  const loading = useAppSelector((state) => state.workOrders.status === 'loading');
  const error = useAppSelector((state) => state.workOrders.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isWorkOrderDialogOpen, setIsWorkOrderDialogOpen] = useState<boolean>(false);
  const [editWorkOrderData, setEditWorkOrderData] = useState<WorkOrder | undefined>(undefined);
  const [workOrderToDelete, setWorkOrderToDelete] = useState<WorkOrder | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchWorkOrders());
  }, [dispatch]);

  const handleDetailWorkOrder = useCallback(
    (workOrder: WorkOrder) => {
      router.push(`/work-orders/${workOrder.id}`);
    },
    [router]
  );

  const handleEditWorkOrder = useCallback((workOrder: WorkOrder) => {
    setEditWorkOrderData(workOrder);
    setIsWorkOrderDialogOpen(true);
  }, []);

  const handleSubmitWorkOrder = useCallback(
    async (values: WorkOrderFormValues) => {
      console.log("Submit Work Order:", values);
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
        const url = `http://localhost:3000/api/work-orders${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<WorkOrder | RawWorkOrderApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<WorkOrder | RawWorkOrderApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Work Order berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsWorkOrderDialogOpen(false);
        setEditWorkOrderData(undefined);
        dispatch(fetchWorkOrders()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteWorkOrder = useCallback(
    async (workOrderId: string) => {
      console.log("Delete Work Order ID:", workOrderId);
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
        await api.delete(`http://localhost:3000/api/work-orders/${workOrderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Work Order berhasil dihapus.",
        });
        setWorkOrderToDelete(undefined);
        dispatch(fetchWorkOrders()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const workOrderColumns: ColumnDef<WorkOrder>[] = useMemo(
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
      { accessorKey: "workOrderNumber", header: "Nomor WO" },
      { accessorKey: "workOrderMaster", header: "Master WO" },
      {
        accessorKey: "date",
        header: "Tanggal",
        cell: ({ row }) => format(row.original.date, "PPP", { locale: localeId }),
      },
      { accessorKey: "vehicle.licensePlate", header: "Plat Kendaraan" },
      { accessorKey: "customer.companyName", header: "Customer" },
      {
        accessorKey: "progresStatus",
        header: "Status Progres",
        cell: ({ row }) => {
          const status = row.original.progresStatus;
          let statusColor: string;
          switch (status) {
            case WoProgresStatus.DRAFT:
              statusColor = "bg-gray-200 text-gray-800";
              break;
            case WoProgresStatus.PENDING:
              statusColor = "bg-yellow-200 text-yellow-800";
              break;
            case WoProgresStatus.ON_PROCESS:
              statusColor = "bg-blue-200 text-blue-800";
              break;
            case WoProgresStatus.WAITING_APPROVAL:
              statusColor = "bg-orange-200 text-orange-800";
              break;
            case WoProgresStatus.WAITING_PART:
              statusColor = "bg-purple-200 text-purple-800";
              break;
            case WoProgresStatus.FINISHED:
              statusColor = "bg-green-200 text-green-800";
              break;
            case WoProgresStatus.CANCELED:
              statusColor = "bg-red-200 text-red-800";
              break;
            case WoProgresStatus.INVOICE_CREATED:
              statusColor = "bg-teal-200 text-teal-800";
              break;
            default:
              statusColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`}>{status.replace(/_/g, " ")}</span>
          );
        },
      },
      {
        accessorKey: "priorityType",
        header: "Prioritas",
        cell: ({ row }) => {
          const priority = row.original.priorityType;
          let priorityColor: string;
          switch (priority) {
            case WoPriorityType.NORMAL:
              priorityColor = "bg-green-200 text-green-800";
              break;
            case WoPriorityType.URGENT:
              priorityColor = "bg-orange-200 text-orange-800";
              break;
            case WoPriorityType.EMERGENCY:
              priorityColor = "bg-red-200 text-red-800";
              break;
            default:
              priorityColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${priorityColor} px-2 py-1 rounded-full text-xs font-semibold`}>{priority}</span>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const workOrder = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailWorkOrder(workOrder)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditWorkOrder(workOrder)}>
                  Edit Work Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWorkOrderToDelete(workOrder)} className="text-red-600">
                  Hapus Work Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailWorkOrder, handleEditWorkOrder]
  );

  const workOrderTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allWorkOrders.length },
      // Tabs for WoProgresStatus
      {
        value: WoProgresStatus.DRAFT.toLowerCase(),
        label: "Draft",
        count: allWorkOrders.filter((wo) => wo.progresStatus === WoProgresStatus.DRAFT).length,
      },
      {
        value: WoProgresStatus.PENDING.toLowerCase(),
        label: "Pending",
        count: allWorkOrders.filter((wo) => wo.progresStatus === WoProgresStatus.PENDING).length,
      },
      {
        value: WoProgresStatus.ON_PROCESS.toLowerCase(),
        label: "Dalam Proses",
        count: allWorkOrders.filter((wo) => wo.progresStatus === WoProgresStatus.ON_PROCESS).length,
      },
      {
        value: WoProgresStatus.WAITING_APPROVAL.toLowerCase(),
        label: "Menunggu Persetujuan",
        count: allWorkOrders.filter((wo) => wo.progresStatus === WoProgresStatus.WAITING_APPROVAL).length,
      },
      {
        value: WoProgresStatus.WAITING_PART.toLowerCase(),
        label: "Menunggu Part",
        count: allWorkOrders.filter((wo) => wo.progresStatus === WoProgresStatus.WAITING_PART).length,
      },
      {
        value: WoProgresStatus.FINISHED.toLowerCase(),
        label: "Selesai",
        count: allWorkOrders.filter((wo) => wo.progresStatus === WoProgresStatus.FINISHED).length,
      },
      {
        value: WoProgresStatus.CANCELED.toLowerCase(),
        label: "Dibatalkan",
        count: allWorkOrders.filter((wo) => wo.progresStatus === WoProgresStatus.CANCELED).length,
      },
      {
        value: WoProgresStatus.INVOICE_CREATED.toLowerCase(),
        label: "Invoice Dibuat",
        count: allWorkOrders.filter((wo) => wo.progresStatus === WoProgresStatus.INVOICE_CREATED).length,
      },
      // Tabs for WoPriorityType
      {
        value: WoPriorityType.NORMAL.toLowerCase(),
        label: "Normal",
        count: allWorkOrders.filter((wo) => wo.priorityType === WoPriorityType.NORMAL).length,
      },
      {
        value: WoPriorityType.URGENT.toLowerCase(),
        label: "Urgent",
        count: allWorkOrders.filter((wo) => wo.priorityType === WoPriorityType.URGENT).length,
      },
      {
        value: WoPriorityType.EMERGENCY.toLowerCase(),
        label: "Emergency",
        count: allWorkOrders.filter((wo) => wo.priorityType === WoPriorityType.EMERGENCY).length,
      },
    ];
  }, [allWorkOrders]);

  const filteredWorkOrders = useMemo(() => {
    let data = allWorkOrders;

    if (activeTab !== "all") {
      data = data.filter((workOrder) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan WoProgresStatus
        if (Object.values(WoProgresStatus).some(s => s.toLowerCase() === lowerCaseActiveTab)) {
          return workOrder.progresStatus.toLowerCase() === lowerCaseActiveTab;
        }
        // Cek berdasarkan WoPriorityType
        if (Object.values(WoPriorityType).some(p => p.toLowerCase() === lowerCaseActiveTab)) {
          return workOrder.priorityType.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter((workOrder) =>
      workOrder.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.workOrderMaster.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.remark.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.serviceLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workOrder.notes && workOrder.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      workOrder.vehicleMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workOrder.vehicle?.licensePlate && workOrder.vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (workOrder.customer?.companyName && workOrder.customer.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (workOrder.carUser?.companyName && workOrder.carUser.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (workOrder.vendor?.companyName && workOrder.vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (workOrder.mechanic?.name && workOrder.mechanic.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (workOrder.driver?.name && workOrder.driver.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (workOrder.driverContact && workOrder.driverContact.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (workOrder.approvedBy?.name && workOrder.approvedBy.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (workOrder.requestedBy?.name && workOrder.requestedBy.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (workOrder.location?.name && workOrder.location.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allWorkOrders, activeTab, searchQuery]);

  const handleAddNewWorkOrderClick = useCallback(() => {
    setEditWorkOrderData(undefined);
    setIsWorkOrderDialogOpen(true);
  }, []);

  const handleWorkOrderDialogClose = useCallback(() => {
    setIsWorkOrderDialogOpen(false);
    setEditWorkOrderData(undefined);
  }, []);

  return (
    <>
      <TableMain<WorkOrder>
        searchQuery={searchQuery}
        data={filteredWorkOrders}
        columns={workOrderColumns}
        tabItems={workOrderTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewWorkOrderClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Work Order ditemukan."
        }
      />

      <Dialog open={isWorkOrderDialogOpen} onOpenChange={setIsWorkOrderDialogOpen}>
        <WorkOrderDialogWrapper 
          onClose={handleWorkOrderDialogClose}
          initialData={editWorkOrderData}
          onSubmit={handleSubmitWorkOrder}
        />
      </Dialog>

      <AlertDialog open={!!workOrderToDelete} onOpenChange={(open) => !open && setWorkOrderToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus Work Order &quot;
              {workOrderToDelete?.workOrderNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWorkOrderToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => workOrderToDelete && handleDeleteWorkOrder(workOrderToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
