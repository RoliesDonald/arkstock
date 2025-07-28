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
import { Estimation, RawEstimationApiResponse } from "@/types/estimation"; 
import { EstimationFormValues } from "@/schemas/estimation"; 
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
import { fetchEstimations, formatEstimationDates } from "@/store/slices/estimationSlice"; 
import { EstimationStatus } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import EstimationDialogWrapper from "@/components/dialog/estimationDialog/EstimationDialogWrapper";

export default function EstimationListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allEstimations = useAppSelector((state) => state.estimations.estimations);
  const loading = useAppSelector((state) => state.estimations.status === 'loading');
  const error = useAppSelector((state) => state.estimations.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isEstimationDialogOpen, setIsEstimationDialogOpen] = useState<boolean>(false);
  const [editEstimationData, setEditEstimationData] = useState<Estimation | undefined>(undefined);
  const [estimationToDelete, setEstimationToDelete] = useState<Estimation | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchEstimations());
  }, [dispatch]);

  const handleDetailEstimation = useCallback(
    (estimation: Estimation) => {
      router.push(`/estimations/${estimation.id}`);
    },
    [router]
  );

  const handleEditEstimation = useCallback((estimation: Estimation) => {
    setEditEstimationData(estimation);
    setIsEstimationDialogOpen(true);
  }, []);

  const handleSubmitEstimation = useCallback(
    async (values: EstimationFormValues) => {
      console.log("Submit Estimation:", values);
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
        const url = `http://localhost:3000/api/estimations${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<Estimation | RawEstimationApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<Estimation | RawEstimationApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Estimasi berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsEstimationDialogOpen(false);
        setEditEstimationData(undefined);
        dispatch(fetchEstimations()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan estimasi.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteEstimation = useCallback(
    async (estimationId: string) => {
      console.log("Delete Estimation ID:", estimationId);
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
        await api.delete(`http://localhost:3000/api/estimations/${estimationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Estimasi berhasil dihapus.",
        });
        setEstimationToDelete(undefined);
        dispatch(fetchEstimations()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus estimasi.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const estimationColumns: ColumnDef<Estimation>[] = useMemo(
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
      { accessorKey: "estimationNumber", header: "Nomor Estimasi" },
      {
        accessorKey: "estimationDate",
        header: "Tanggal Estimasi",
        cell: ({ row }) => format(row.original.estimationDate, "PPP", { locale: localeId }),
      },
      { accessorKey: "workOrder.workOrderNumber", header: "Nomor WO" },
      { accessorKey: "vehicle.licensePlate", header: "Plat Kendaraan" },
      { accessorKey: "totalEstimatedAmount", header: "Total Estimasi", cell: ({ row }) => `Rp${row.original.totalEstimatedAmount.toLocaleString('id-ID')}` },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let statusColor: string;
          switch (status) {
            case EstimationStatus.DRAFT:
              statusColor = "bg-gray-200 text-gray-800";
              break;
            case EstimationStatus.PENDING:
              statusColor = "bg-yellow-200 text-yellow-800";
              break;
            case EstimationStatus.APPROVED:
              statusColor = "bg-green-200 text-green-800";
              break;
            case EstimationStatus.REJECTED:
              statusColor = "bg-red-200 text-red-800";
              break;
            case EstimationStatus.CANCELLED:
              statusColor = "bg-purple-200 text-purple-800";
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
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const estimation = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailEstimation(estimation)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditEstimation(estimation)}>
                  Edit Estimasi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEstimationToDelete(estimation)} className="text-red-600">
                  Hapus Estimasi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailEstimation, handleEditEstimation]
  );

  const estimationTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allEstimations.length },
      // Tabs for EstimationStatus
      {
        value: EstimationStatus.DRAFT.toLowerCase(),
        label: "Draft",
        count: allEstimations.filter((est) => est.status === EstimationStatus.DRAFT).length,
      },
      {
        value: EstimationStatus.PENDING.toLowerCase(),
        label: "Pending",
        count: allEstimations.filter((est) => est.status === EstimationStatus.PENDING).length,
      },
      {
        value: EstimationStatus.APPROVED.toLowerCase(),
        label: "Disetujui",
        count: allEstimations.filter((est) => est.status === EstimationStatus.APPROVED).length,
      },
      {
        value: EstimationStatus.REJECTED.toLowerCase(),
        label: "Ditolak",
        count: allEstimations.filter((est) => est.status === EstimationStatus.REJECTED).length,
      },
      {
        value: EstimationStatus.CANCELLED.toLowerCase(),
        label: "Dibatalkan",
        count: allEstimations.filter((est) => est.status === EstimationStatus.CANCELLED).length,
      },
    ];
  }, [allEstimations]);

  const filteredEstimations = useMemo(() => {
    let data = allEstimations;

    if (activeTab !== "all") {
      data = data.filter((estimation) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan EstimationStatus
        if (Object.values(EstimationStatus).some(s => s.toLowerCase() === lowerCaseActiveTab)) {
          return estimation.status.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter((estimation) =>
      estimation.estimationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimation.remark.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (estimation.notes && estimation.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (estimation.workOrder?.workOrderNumber && estimation.workOrder.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (estimation.vehicle?.licensePlate && estimation.vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (estimation.mechanic?.name && estimation.mechanic.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (estimation.accountant?.name && estimation.accountant.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (estimation.approvedBy?.name && estimation.approvedBy.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allEstimations, activeTab, searchQuery]);

  const handleAddNewEstimationClick = useCallback(() => {
    setEditEstimationData(undefined);
    setIsEstimationDialogOpen(true);
  }, []);

  const handleEstimationDialogClose = useCallback(() => {
    setIsEstimationDialogOpen(false);
    setEditEstimationData(undefined);
  }, []);

  return (
    <>
      <TableMain<Estimation>
        searchQuery={searchQuery}
        data={filteredEstimations}
        columns={estimationColumns}
        tabItems={estimationTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewEstimationClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Estimasi ditemukan."
        }
      />

      <Dialog open={isEstimationDialogOpen} onOpenChange={setIsEstimationDialogOpen}>
        <EstimationDialogWrapper 
          onClose={handleEstimationDialogClose}
          initialData={editEstimationData}
          onSubmit={handleSubmitEstimation}
        />
      </Dialog>

      <AlertDialog open={!!estimationToDelete} onOpenChange={(open) => !open && setEstimationToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus estimasi &quot;
              {estimationToDelete?.estimationNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEstimationToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => estimationToDelete && handleDeleteEstimation(estimationToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
