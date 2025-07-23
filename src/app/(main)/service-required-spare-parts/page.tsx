"use client";

import TableMain from "@/components/common/table/TableMain";
import ServiceRequiredSparePartDialogWrapper from "@/components/dialog/serviceRequiredSparePartDialog/_components/ServiceRequiredSparePartDialogWrapper"; 
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
import { ServiceRequiredSparePart, RawServiceRequiredSparePartApiResponse } from "@/types/serviceRequiredSpareParts"; 
import { ServiceRequiredSparePartFormValues } from "@/schemas/serviceRequiredSparePart"; 
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
import { fetchServiceRequiredSpareParts, formatServiceRequiredSparePartDates } from "@/store/slices/serviceRequiredSparePartSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function ServiceRequiredSparePartListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allServiceRequiredSpareParts = useAppSelector((state) => state.serviceRequiredSpareParts.serviceRequiredSpareParts);
  const loading = useAppSelector((state) => state.serviceRequiredSpareParts.status === 'loading');
  const error = useAppSelector((state) => state.serviceRequiredSpareParts.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isServiceRequiredSparePartDialogOpen, setIsServiceRequiredSparePartDialogOpen] = useState<boolean>(false);
  const [editServiceRequiredSparePartData, setEditServiceRequiredSparePartData] = useState<ServiceRequiredSparePart | undefined>(undefined);
  const [serviceRequiredSparePartToDelete, setServiceRequiredSparePartToDelete] = useState<ServiceRequiredSparePart | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchServiceRequiredSpareParts());
  }, [dispatch]);

  const handleDetailServiceRequiredSparePart = useCallback(
    (srsp: ServiceRequiredSparePart) => {
      router.push(`/service-required-spare-parts/${srsp.id}`);
    },
    [router]
  );

  const handleEditServiceRequiredSparePart = useCallback((srsp: ServiceRequiredSparePart) => {
    setEditServiceRequiredSparePartData(srsp);
    setIsServiceRequiredSparePartDialogOpen(true);
  }, []);

  const handleSubmitServiceRequiredSparePart = useCallback(
    async (values: ServiceRequiredSparePartFormValues) => {
      console.log("Submit Service Required Spare Part:", values);
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
        const url = `http://localhost:3000/api/service-required-spare-parts${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<ServiceRequiredSparePart | RawServiceRequiredSparePartApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<ServiceRequiredSparePart | RawServiceRequiredSparePartApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Spare Part Jasa berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsServiceRequiredSparePartDialogOpen(false);
        setEditServiceRequiredSparePartData(undefined);
        dispatch(fetchServiceRequiredSpareParts()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Spare Part Jasa.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteServiceRequiredSparePart = useCallback(
    async (srspId: string) => {
      console.log("Delete Service Required Spare Part ID:", srspId);
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
        await api.delete(`http://localhost:3000/api/service-required-spare-parts/${srspId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Spare Part Jasa berhasil dihapus.",
        });
        setServiceRequiredSparePartToDelete(undefined);
        dispatch(fetchServiceRequiredSpareParts()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Spare Part Jasa.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const serviceRequiredSparePartColumns: ColumnDef<ServiceRequiredSparePart>[] = useMemo(
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
      { accessorKey: "service.name", header: "Nama Jasa" },
      { accessorKey: "sparePart.partName", header: "Nama Spare Part" },
      { accessorKey: "sparePart.partNumber", header: "Nomor Part" },
      { accessorKey: "quantity", header: "Kuantitas" },
      { accessorKey: "sparePart.unit", header: "Unit" },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const srsp = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailServiceRequiredSparePart(srsp)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditServiceRequiredSparePart(srsp)}>
                  Edit Spare Part Jasa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setServiceRequiredSparePartToDelete(srsp)} className="text-red-600">
                  Hapus Spare Part Jasa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailServiceRequiredSparePart, handleEditServiceRequiredSparePart]
  );

  const serviceRequiredSparePartTabItems = useMemo(() => {
    // For ServiceRequiredSparePart, tabs might be based on service name or spare part category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allServiceRequiredSpareParts.length },
    ];
  }, [allServiceRequiredSpareParts]);

  const filteredServiceRequiredSpareParts = useMemo(() => {
    let data = allServiceRequiredSpareParts;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((srsp) =>
      (srsp.service?.name && srsp.service.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (srsp.sparePart?.partName && srsp.sparePart.partName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (srsp.sparePart?.partNumber && srsp.sparePart.partNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allServiceRequiredSpareParts, activeTab, searchQuery]);

  const handleAddNewServiceRequiredSparePartClick = useCallback(() => {
    setEditServiceRequiredSparePartData(undefined);
    setIsServiceRequiredSparePartDialogOpen(true);
  }, []);

  const handleServiceRequiredSparePartDialogClose = useCallback(() => {
    setIsServiceRequiredSparePartDialogOpen(false);
    setEditServiceRequiredSparePartData(undefined);
  }, []);

  return (
    <>
      <TableMain<ServiceRequiredSparePart>
        searchQuery={searchQuery}
        data={filteredServiceRequiredSpareParts}
        columns={serviceRequiredSparePartColumns}
        tabItems={serviceRequiredSparePartTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewServiceRequiredSparePartClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Spare Part Jasa ditemukan."
        }
      />

      <Dialog open={isServiceRequiredSparePartDialogOpen} onOpenChange={setIsServiceRequiredSparePartDialogOpen}>
        <ServiceRequiredSparePartDialogWrapper 
          onClose={handleServiceRequiredSparePartDialogClose}
          initialData={editServiceRequiredSparePartData}
          onSubmit={handleSubmitServiceRequiredSparePart}
        />
      </Dialog>

      <AlertDialog open={!!serviceRequiredSparePartToDelete} onOpenChange={(open) => !open && setServiceRequiredSparePartToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus spare part jasa &quot;
              {serviceRequiredSparePartToDelete?.sparePart?.partName} untuk {serviceRequiredSparePartToDelete?.service?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setServiceRequiredSparePartToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => serviceRequiredSparePartToDelete && handleDeleteServiceRequiredSparePart(serviceRequiredSparePartToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
