"use client";

import TableMain from "@/components/common/table/TableMain";
import SparePartSuitableVehicleDialogWrapper from "@/components/dialog/sparePartSuitableVehicleDialog/_components/SparePartSuitableVehicleDialogWrapper"; 
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
import { SparePartSuitableVehicle, RawSparePartSuitableVehicleApiResponse } from "@/types/sparePartSuitableVehicles"; 
import { SparePartSuitableVehicleFormValues } from "@/schemas/sparePartSuitableVehicle"; 
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
import { fetchSparePartSuitableVehicles, formatSparePartSuitableVehicleData } from "@/store/slices/sparePartSuitableVehicleSlice"; 
import { api } from "@/lib/utils/api"; 

export default function SparePartSuitableVehicleListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allSparePartSuitableVehicles = useAppSelector((state) => state.sparePartSuitableVehicles.sparePartSuitableVehicles);
  const loading = useAppSelector((state) => state.sparePartSuitableVehicles.status === 'loading');
  const error = useAppSelector((state) => state.sparePartSuitableVehicles.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isSparePartSuitableVehicleDialogOpen, setIsSparePartSuitableVehicleDialogOpen] = useState<boolean>(false);
  const [editSparePartSuitableVehicleData, setEditSparePartSuitableVehicleData] = useState<SparePartSuitableVehicle | undefined>(undefined);
  const [sparePartSuitableVehicleToDelete, setSparePartSuitableVehicleToDelete] = useState<SparePartSuitableVehicle | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchSparePartSuitableVehicles());
  }, [dispatch]);

  const handleDetailSparePartSuitableVehicle = useCallback(
    (srsv: SparePartSuitableVehicle) => {
      // Navigasi ke halaman detail dengan query parameters untuk composite key
      router.push(`/spare-part-suitable-vehicles/detail?sparePartId=${srsv.sparePartId}&vehicleMake=${srsv.vehicleMake}&vehicleModel=${srsv.vehicleModel}`);
    },
    [router]
  );

  const handleEditSparePartSuitableVehicle = useCallback((srsv: SparePartSuitableVehicle) => {
    setEditSparePartSuitableVehicleData(srsv);
    setIsSparePartSuitableVehicleDialogOpen(true);
  }, []);

  const handleSubmitSparePartSuitableVehicle = useCallback(
    async (values: SparePartSuitableVehicleFormValues) => {
      console.log("Submit Spare Part Suitable Vehicle:", values);
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
        // Untuk composite key, PUT/DELETE biasanya menggunakan semua komponen key di URL
        // Untuk POST, tidak perlu ID
        let response;
        if (editSparePartSuitableVehicleData) { // Ini adalah operasi UPDATE
          const { sparePartId, vehicleMake, vehicleModel } = editSparePartSuitableVehicleData;
          const url = `http://localhost:3000/api/spare-part-suitable-vehicles/${sparePartId}/${encodeURIComponent(vehicleMake)}/${encodeURIComponent(vehicleModel)}`;
          response = await api.put<SparePartSuitableVehicle | RawSparePartSuitableVehicleApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else { // Ini adalah operasi CREATE
          const url = `http://localhost:3000/api/spare-part-suitable-vehicles`;
          response = await api.post<SparePartSuitableVehicle | RawSparePartSuitableVehicleApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Kendaraan yang Cocok berhasil di${editSparePartSuitableVehicleData ? "perbarui" : "tambahkan"}.`,
        });
        setIsSparePartSuitableVehicleDialogOpen(false);
        setEditSparePartSuitableVehicleData(undefined);
        dispatch(fetchSparePartSuitableVehicles()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Kendaraan yang Cocok.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router, editSparePartSuitableVehicleData]
  );

  const handleDeleteSparePartSuitableVehicle = useCallback(
    async (srsv: SparePartSuitableVehicle) => {
      console.log("Delete Spare Part Suitable Vehicle:", srsv);
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
        const url = `http://localhost:3000/api/spare-part-suitable-vehicles/${srsv.sparePartId}/${encodeURIComponent(srsv.vehicleMake)}/${encodeURIComponent(srsv.vehicleModel)}`;
        await api.delete(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Kendaraan yang Cocok berhasil dihapus.",
        });
        setSparePartSuitableVehicleToDelete(undefined);
        dispatch(fetchSparePartSuitableVehicles()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Kendaraan yang Cocok.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const sparePartSuitableVehicleColumns: ColumnDef<SparePartSuitableVehicle>[] = useMemo(
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
      { accessorKey: "sparePart.partName", header: "Nama Spare Part" },
      { accessorKey: "sparePart.partNumber", header: "Nomor Part" },
      { accessorKey: "vehicleMake", header: "Merk Kendaraan" },
      { accessorKey: "vehicleModel", header: "Model Kendaraan" },
      { accessorKey: "trimLevel", header: "Tingkat Trim" },
      { accessorKey: "modelYear", header: "Tahun Model" },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const srsv = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailSparePartSuitableVehicle(srsv)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditSparePartSuitableVehicle(srsv)}>
                  Edit Kendaraan yang Cocok
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSparePartSuitableVehicleToDelete(srsv)} className="text-red-600">
                  Hapus Kendaraan yang Cocok
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailSparePartSuitableVehicle, handleEditSparePartSuitableVehicle]
  );

  const sparePartSuitableVehicleTabItems = useMemo(() => {
    // For SparePartSuitableVehicle, tabs might be based on vehicle make or spare part category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allSparePartSuitableVehicles.length },
    ];
  }, [allSparePartSuitableVehicles]);

  const filteredSparePartSuitableVehicles = useMemo(() => {
    let data = allSparePartSuitableVehicles;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((srsv) =>
      (srsv.sparePart?.partName && srsv.sparePart.partName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (srsv.sparePart?.partNumber && srsv.sparePart.partNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (srsv.vehicleMake.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (srsv.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (srsv.trimLevel && srsv.trimLevel.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allSparePartSuitableVehicles, searchQuery]);

  const handleAddNewSparePartSuitableVehicleClick = useCallback(() => {
    setEditSparePartSuitableVehicleData(undefined);
    setIsSparePartSuitableVehicleDialogOpen(true);
  }, []);

  const handleSparePartSuitableVehicleDialogClose = useCallback(() => {
    setIsSparePartSuitableVehicleDialogOpen(false);
    setEditSparePartSuitableVehicleData(undefined);
  }, []);

  return (
    <>
      <TableMain<SparePartSuitableVehicle>
        searchQuery={searchQuery}
        data={filteredSparePartSuitableVehicles}
        columns={sparePartSuitableVehicleColumns}
        tabItems={sparePartSuitableVehicleTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewSparePartSuitableVehicleClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Kendaraan yang Cocok ditemukan."
        }
      />

      <Dialog open={isSparePartSuitableVehicleDialogOpen} onOpenChange={setIsSparePartSuitableVehicleDialogOpen}>
        <SparePartSuitableVehicleDialogWrapper 
          onClose={handleSparePartSuitableVehicleDialogClose}
          initialData={editSparePartSuitableVehicleData}
          onSubmit={handleSubmitSparePartSuitableVehicle}
        />
      </Dialog>

      <AlertDialog open={!!sparePartSuitableVehicleToDelete} onOpenChange={(open) => !open && setSparePartSuitableVehicleToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data kendaraan cocok &quot;
              {sparePartSuitableVehicleToDelete?.sparePart?.partName} untuk {sparePartSuitableVehicleToDelete?.vehicleMake} {sparePartSuitableVehicleToDelete?.vehicleModel}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSparePartSuitableVehicleToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => sparePartSuitableVehicleToDelete && handleDeleteSparePartSuitableVehicle(sparePartSuitableVehicleToDelete)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
