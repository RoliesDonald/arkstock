"use client";

import TableMain from "@/components/common/table/TableMain";
import VehicleDialogWrapper from "@/components/dialog/vehicleDialog/VehicleDialogWrapper"; // Import VehicleDialogWrapper
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
import { Vehicle, RawVehicleApiResponse } from "@/types/vehicle"; 
import { VehicleFormValues } from "@/schemas/vehicle"; // Import VehicleFormValues dari schemas
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
import { fetchVehicles, formatVehicleDates } from "@/store/slices/vehicleSlice"; 
import {
  VehicleType,
  VehicleCategory,
  VehicleFuelType,
  VehicleTransmissionType,
  VehicleStatus,
} from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 

export default function VehicleListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allVehicles = useAppSelector((state) => state.vehicles.vehicles);
  const loading = useAppSelector((state) => state.vehicles.status === 'loading');
  const error = useAppSelector((state) => state.vehicles.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState<boolean>(false);
  const [editVehicleData, setEditVehicleData] = useState<Vehicle | undefined>(undefined);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const handleDetailVehicle = useCallback(
    (vehicle: Vehicle) => {
      router.push(`/vehicles/${vehicle.id}`);
    },
    [router]
  );

  const handleEditVehicle = useCallback((vehicle: Vehicle) => {
    setEditVehicleData(vehicle);
    setIsVehicleDialogOpen(true);
  }, []);

  const handleSubmitVehicle = useCallback(
    async (values: VehicleFormValues) => {
      console.log("Submit Vehicle:", values);
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
        const url = `http://localhost:3000/api/vehicles${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<Vehicle | RawVehicleApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<Vehicle | RawVehicleApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Kendaraan berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsVehicleDialogOpen(false);
        setEditVehicleData(undefined);
        dispatch(fetchVehicles()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan kendaraan.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteVehicle = useCallback(
    async (vehicleId: string) => {
      console.log("Delete Vehicle ID:", vehicleId);
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
        await api.delete(`http://localhost:3000/api/vehicles/${vehicleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Kendaraan berhasil dihapus.",
        });
        setVehicleToDelete(undefined);
        dispatch(fetchVehicles()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus kendaraan.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const vehicleColumns: ColumnDef<Vehicle>[] = useMemo(
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
      { accessorKey: "licensePlate", header: "Nomor Plat" },
      { accessorKey: "vehicleMake", header: "Merk" },
      { accessorKey: "model", header: "Model" },
      { accessorKey: "yearMade", header: "Tahun" },
      { accessorKey: "color", header: "Warna" },
      {
        accessorKey: "vehicleType",
        header: "Tipe",
        cell: ({ row }) => {
          const type = row.original.vehicleType;
          let typeColor: string;
          switch (type) {
            case VehicleType.PASSENGER:
              typeColor = "bg-blue-200 text-blue-800";
              break;
            case VehicleType.COMMERCIAL:
              typeColor = "bg-green-200 text-green-800";
              break;
            case VehicleType.MOTORCYCLE:
              typeColor = "bg-purple-200 text-purple-800";
              break;
            default:
              typeColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${typeColor} px-2 py-1 rounded-full text-xs font-semibold`}>{type}</span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let statusColor: string;
          switch (status) {
            case VehicleStatus.ACTIVE:
              statusColor = "bg-green-500 text-white";
              break;
            case VehicleStatus.AVAILABLE:
              statusColor = "bg-blue-500 text-white";
              break;
            case VehicleStatus.IN_MAINTENANCE:
              statusColor = "bg-yellow-500 text-black";
              break;
            case VehicleStatus.RENTED:
              statusColor = "bg-purple-500 text-white";
              break;
            case VehicleStatus.OUT_OF_SERVICE:
              statusColor = "bg-red-500 text-white";
              break;
            case VehicleStatus.BRAKE_DOWN:
              statusColor = "bg-orange-500 text-white";
              break;
            case VehicleStatus.ON_HOLD:
              statusColor = "bg-gray-700 text-white";
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
          const vehicle = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailVehicle(vehicle)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                  Edit Kendaraan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVehicleToDelete(vehicle)} className="text-red-600">
                  Hapus Kendaraan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailVehicle, handleEditVehicle]
  );

  const vehicleTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allVehicles.length },
      // Tabs for VehicleType
      {
        value: VehicleType.PASSENGER.toLowerCase(),
        label: "Penumpang",
        count: allVehicles.filter((v) => v.vehicleType === VehicleType.PASSENGER).length,
      },
      {
        value: VehicleType.COMMERCIAL.toLowerCase(),
        label: "Komersial",
        count: allVehicles.filter((v) => v.vehicleType === VehicleType.COMMERCIAL).length,
      },
      {
        value: VehicleType.MOTORCYCLE.toLowerCase(),
        label: "Motor",
        count: allVehicles.filter((v) => v.vehicleType === VehicleType.MOTORCYCLE).length,
      },
      // Tabs for VehicleStatus
      {
        value: VehicleStatus.ACTIVE.toLowerCase(),
        label: "Aktif",
        count: allVehicles.filter((v) => v.status === VehicleStatus.ACTIVE).length,
      },
      {
        value: VehicleStatus.AVAILABLE.toLowerCase(),
        label: "Tersedia",
        count: allVehicles.filter((v) => v.status === VehicleStatus.AVAILABLE).length,
      },
      {
        value: VehicleStatus.IN_MAINTENANCE.toLowerCase(),
        label: "Dalam Perawatan",
        count: allVehicles.filter((v) => v.status === VehicleStatus.IN_MAINTENANCE).length,
      },
      {
        value: VehicleStatus.RENTED.toLowerCase(),
        label: "Disewa",
        count: allVehicles.filter((v) => v.status === VehicleStatus.RENTED).length,
      },
      {
        value: VehicleStatus.OUT_OF_SERVICE.toLowerCase(),
        label: "Tidak Beroperasi",
        count: allVehicles.filter((v) => v.status === VehicleStatus.OUT_OF_SERVICE).length,
      },
      {
        value: VehicleStatus.BRAKE_DOWN.toLowerCase(),
        label: "Rusak",
        count: allVehicles.filter((v) => v.status === VehicleStatus.BRAKE_DOWN).length,
      },
      {
        value: VehicleStatus.ON_HOLD.toLowerCase(),
        label: "Ditahan",
        count: allVehicles.filter((v) => v.status === VehicleStatus.ON_HOLD).length,
      },
    ];
  }, [allVehicles]);

  const filteredVehicles = useMemo(() => {
    let data = allVehicles;

    if (activeTab !== "all") {
      data = data.filter((vehicle) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan VehicleType
        if (Object.values(VehicleType).some(t => t.toLowerCase() === lowerCaseActiveTab)) {
          return vehicle.vehicleType.toLowerCase() === lowerCaseActiveTab;
        }
        // Cek berdasarkan VehicleStatus
        if (Object.values(VehicleStatus).some(s => s.toLowerCase() === lowerCaseActiveTab)) {
          return vehicle.status.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter((vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.vehicleMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.vinNum && vehicle.vinNum.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vehicle.engineNum && vehicle.engineNum.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vehicle.chassisNum && vehicle.chassisNum.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allVehicles, activeTab, searchQuery]);

  const handleAddNewVehicleClick = useCallback(() => {
    setEditVehicleData(undefined);
    setIsVehicleDialogOpen(true);
  }, []);

  const handleVehicleDialogClose = useCallback(() => {
    setIsVehicleDialogOpen(false);
    setEditVehicleData(undefined);
  }, []);

  return (
    <>
      <TableMain<Vehicle>
        searchQuery={searchQuery}
        data={filteredVehicles}
        columns={vehicleColumns}
        tabItems={vehicleTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewVehicleClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Kendaraan ditemukan."
        }
      />

      <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
        <VehicleDialogWrapper 
          onClose={handleVehicleDialogClose}
          initialData={editVehicleData}
          onSubmit={handleSubmitVehicle}
        />
      </Dialog>

      <AlertDialog open={!!vehicleToDelete} onOpenChange={(open) => !open && setVehicleToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kendaraan &quot;
              {vehicleToDelete?.licensePlate}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVehicleToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => vehicleToDelete && handleDeleteVehicle(vehicleToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
