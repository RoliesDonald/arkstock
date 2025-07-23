"use client";

import TableMain from "@/components/common/table/TableMain";
import EstimationServiceDialogWrapper from "@/components/dialog/estimationServiceDialog/_components/EstimationServiceDialogWrapper"; 
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
import { EstimationService, RawEstimationServiceApiResponse } from "@/types/estimationServices"; 
import { EstimationServiceFormValues } from "@/schemas/estimationService"; 
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
import { fetchEstimationServices, formatEstimationServiceDates } from "@/store/slices/estimationServiceSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function EstimationServiceListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allEstimationServices = useAppSelector((state) => state.estimationServices.estimationServices);
  const loading = useAppSelector((state) => state.estimationServices.status === 'loading');
  const error = useAppSelector((state) => state.estimationServices.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isEstimationServiceDialogOpen, setIsEstimationServiceDialogOpen] = useState<boolean>(false);
  const [editEstimationServiceData, setEditEstimationServiceData] = useState<EstimationService | undefined>(undefined);
  const [estimationServiceToDelete, setEstimationServiceToDelete] = useState<EstimationService | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchEstimationServices());
  }, [dispatch]);

  const handleDetailEstimationService = useCallback(
    (es: EstimationService) => {
      router.push(`/estimation-services/${es.id}`);
    },
    [router]
  );

  const handleEditEstimationService = useCallback((es: EstimationService) => {
    setEditEstimationServiceData(es);
    setIsEstimationServiceDialogOpen(true);
  }, []);

  const handleSubmitEstimationService = useCallback(
    async (values: EstimationServiceFormValues) => {
      console.log("Submit Estimation Service:", values);
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
        const url = `http://localhost:3000/api/estimation-services${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<EstimationService | RawEstimationServiceApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<EstimationService | RawEstimationServiceApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Jasa Estimasi berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsEstimationServiceDialogOpen(false);
        setEditEstimationServiceData(undefined);
        dispatch(fetchEstimationServices()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Jasa Estimasi.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteEstimationService = useCallback(
    async (esId: string) => {
      console.log("Delete Estimation Service ID:", esId);
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
        await api.delete(`http://localhost:3000/api/estimation-services/${esId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Jasa Estimasi berhasil dihapus.",
        });
        setEstimationServiceToDelete(undefined);
        dispatch(fetchEstimationServices()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Jasa Estimasi.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const estimationServiceColumns: ColumnDef<EstimationService>[] = useMemo(
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
      { accessorKey: "estimation.estimationNumber", header: "Nomor Estimasi" },
      { accessorKey: "service.name", header: "Nama Jasa" },
      { accessorKey: "quantity", header: "Kuantitas" },
      { accessorKey: "unitPrice", header: "Harga Satuan", cell: ({ row }) => `Rp${row.original.unitPrice.toLocaleString('id-ID')}` },
      { accessorKey: "totalPrice", header: "Total Harga", cell: ({ row }) => `Rp${row.original.totalPrice.toLocaleString('id-ID')}` },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const es = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailEstimationService(es)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditEstimationService(es)}>
                  Edit Jasa Estimasi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEstimationServiceToDelete(es)} className="text-red-600">
                  Hapus Jasa Estimasi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailEstimationService, handleEditEstimationService]
  );

  const estimationServiceTabItems = useMemo(() => {
    // For EstimationService, tabs might be based on estimation number or service category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allEstimationServices.length },
    ];
  }, [allEstimationServices]);

  const filteredEstimationServices = useMemo(() => {
    let data = allEstimationServices;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((es) =>
      (es.estimation?.estimationNumber && es.estimation.estimationNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (es.service?.name && es.service.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allEstimationServices, activeTab, searchQuery]);

  const handleAddNewEstimationServiceClick = useCallback(() => {
    setEditEstimationServiceData(undefined);
    setIsEstimationServiceDialogOpen(true);
  }, []);

  const handleEstimationServiceDialogClose = useCallback(() => {
    setIsEstimationServiceDialogOpen(false);
    setEditEstimationServiceData(undefined);
  }, []);

  return (
    <>
      <TableMain<EstimationService>
        searchQuery={searchQuery}
        data={filteredEstimationServices}
        columns={estimationServiceColumns}
        tabItems={estimationServiceTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewEstimationServiceClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Jasa Estimasi ditemukan."
        }
      />

      <Dialog open={isEstimationServiceDialogOpen} onOpenChange={setIsEstimationServiceDialogOpen}>
        <EstimationServiceDialogWrapper 
          onClose={handleEstimationServiceDialogClose}
          initialData={editEstimationServiceData}
          onSubmit={handleSubmitEstimationService}
        />
      </Dialog>

      <AlertDialog open={!!estimationServiceToDelete} onOpenChange={(open) => !open && setEstimationServiceToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jasa estimasi &quot;
              {estimationServiceToDelete?.service?.name} untuk {estimationServiceToDelete?.estimation?.estimationNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEstimationServiceToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => estimationServiceToDelete && handleDeleteEstimationService(estimationServiceToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
