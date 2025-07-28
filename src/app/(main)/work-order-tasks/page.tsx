"use client";

import TableMain from "@/components/common/table/TableMain";
import WorkOrderTaskDialogWrapper from "@/components/dialog/workOrderTaskDialog/_components/WorkOrderTaskDialogWrapper"; 
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
import { WorkOrderTask, RawWorkOrderTaskApiResponse } from "@/types/workOrderTasks"; 
import { WorkOrderTaskFormValues } from "@/schemas/workOrderTask"; 
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
import { fetchWorkOrderTasks, formatWorkOrderTaskDates } from "@/store/slices/workOrderTaskSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function WorkOrderTaskListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allWorkOrderTasks = useAppSelector((state) => state.workOrderTasks.workOrderTasks);
  const loading = useAppSelector((state) => state.workOrderTasks.status === 'loading');
  const error = useAppSelector((state) => state.workOrderTasks.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isWorkOrderTaskDialogOpen, setIsWorkOrderTaskDialogOpen] = useState<boolean>(false);
  const [editWorkOrderTaskData, setEditWorkOrderTaskData] = useState<WorkOrderTask | undefined>(undefined);
  const [workOrderTaskToDelete, setWorkOrderTaskToDelete] = useState<WorkOrderTask | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchWorkOrderTasks());
  }, [dispatch]);

  const handleDetailWorkOrderTask = useCallback(
    (wot: WorkOrderTask) => {
      router.push(`/work-order-tasks/${wot.id}`);
    },
    [router]
  );

  const handleEditWorkOrderTask = useCallback((wot: WorkOrderTask) => {
    setEditWorkOrderTaskData(wot);
    setIsWorkOrderTaskDialogOpen(true);
  }, []);

  const handleSubmitWorkOrderTask = useCallback(
    async (values: WorkOrderTaskFormValues) => {
      console.log("Submit Work Order Task:", values);
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
        const url = `http://localhost:3000/api/work-order-tasks${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<WorkOrderTask | RawWorkOrderTaskApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<WorkOrderTask | RawWorkOrderTaskApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Tugas Work Order berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsWorkOrderTaskDialogOpen(false);
        setEditWorkOrderTaskData(undefined);
        dispatch(fetchWorkOrderTasks()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Tugas Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteWorkOrderTask = useCallback(
    async (wotId: string) => {
      console.log("Delete Work Order Task ID:", wotId);
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
        await api.delete(`http://localhost:3000/api/work-order-tasks/${wotId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Tugas Work Order berhasil dihapus.",
        });
        setWorkOrderTaskToDelete(undefined);
        dispatch(fetchWorkOrderTasks()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Tugas Work Order.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const workOrderTaskColumns: ColumnDef<WorkOrderTask>[] = useMemo(
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
      { accessorKey: "taskName", header: "Nama Tugas" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "assignedTo.name", header: "Ditugaskan Kepada" },
      { 
        accessorKey: "startTime", 
        header: "Waktu Mulai",
        cell: ({ row }) => row.original.startTime ? format(row.original.startTime, "dd MMM yyyy HH:mm", { locale: localeId }) : "N/A"
      },
      { 
        accessorKey: "endTime", 
        header: "Waktu Selesai",
        cell: ({ row }) => row.original.endTime ? format(row.original.endTime, "dd MMM yyyy HH:mm", { locale: localeId }) : "N/A"
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const wot = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailWorkOrderTask(wot)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditWorkOrderTask(wot)}>
                  Edit Tugas Work Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWorkOrderTaskToDelete(wot)} className="text-red-600">
                  Hapus Tugas Work Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailWorkOrderTask, handleEditWorkOrderTask]
  );

  const workOrderTaskTabItems = useMemo(() => {
    // Tabs can be based on status, e.g., "Pending", "Completed", "All"
    const statusCounts = allWorkOrderTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<WorkOrderTask['status'], number>);

    return [
      { value: "all", label: "All", count: allWorkOrderTasks.length },
      { value: "PENDING", label: "Pending", count: statusCounts.PENDING || 0 },
      { value: "IN_PROGRESS", label: "Dalam Proses", count: statusCounts.IN_PROGRESS || 0 },
      { value: "COMPLETED", label: "Selesai", count: statusCounts.COMPLETED || 0 },
      { value: "FAILED", label: "Gagal", count: statusCounts.FAILED || 0 },
      { value: "CANCELED", label: "Dibatalkan", count: statusCounts.CANCELED || 0 },
    ];
  }, [allWorkOrderTasks]);

  const filteredWorkOrderTasks = useMemo(() => {
    let data = allWorkOrderTasks;

    if (activeTab !== "all") {
      data = data.filter((task) => task.status === activeTab);
    }

    return data.filter((wot) =>
      (wot.workOrder?.workOrderNumber && wot.workOrder.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wot.taskName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wot.description && wot.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wot.assignedTo?.name && wot.assignedTo.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allWorkOrderTasks, activeTab, searchQuery]);

  const handleAddNewWorkOrderTaskClick = useCallback(() => {
    setEditWorkOrderTaskData(undefined);
    setIsWorkOrderTaskDialogOpen(true);
  }, []);

  const handleWorkOrderTaskDialogClose = useCallback(() => {
    setIsWorkOrderTaskDialogOpen(false);
    setEditWorkOrderTaskData(undefined);
  }, []);

  return (
    <>
      <TableMain<WorkOrderTask>
        searchQuery={searchQuery}
        data={filteredWorkOrderTasks}
        columns={workOrderTaskColumns}
        tabItems={workOrderTaskTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewWorkOrderTaskClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Tugas Work Order ditemukan."
        }
      />

      <Dialog open={isWorkOrderTaskDialogOpen} onOpenChange={setIsWorkOrderTaskDialogOpen}>
        <WorkOrderTaskDialogWrapper 
          onClose={handleWorkOrderTaskDialogClose}
          initialData={editWorkOrderTaskData}
          onSubmit={handleSubmitWorkOrderTask}
        />
      </Dialog>

      <AlertDialog open={!!workOrderTaskToDelete} onOpenChange={(open) => !open && setWorkOrderTaskToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tugas &quot;
              {workOrderTaskToDelete?.taskName} dari Work Order {workOrderTaskToDelete?.workOrder?.workOrderNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWorkOrderTaskToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => workOrderTaskToDelete && handleDeleteWorkOrderTask(workOrderTaskToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
