// src/app/(main)/vehicles/page.tsx
"use client";

import TableMain from "@/components/common/table/TableMain";
import VehicleDialog from "@/components/dialog/vehicleDialog/VehicleDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { vehicleData } from "@/data/sampleVehicleData"; // Import from sampleVehicleData
import { companyData } from "@/data/sampleCompanyData"; // Import from sampleCompanyData

import { useAppSelector, useAppDispatch } from "@/store/hooks";

import {
  Vehicle,
  VehicleStatus,
  VehicleType,
  VehicleCategory,
  VehicleFormValues,
} from "@/types/vehicle";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  createVehicle,
  deleteVehicle,
  fetchVehicles,
  updateVehicle,
} from "@/store/slices/vehicleSlice";
import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";

export default function VehicleListPage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const allVehicles = useAppSelector((state) => state.vehicles.vehicles);
  const vehicleStatus = useAppSelector((state) => state.vehicles.status);
  const vehicleError = useAppSelector((state) => state.vehicles.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] =
    useState<boolean>(false);
  const [editVehicleData, setEditVehicleData] = useState<Vehicle | undefined>(
    undefined
  );

  useEffect(() => {
    if (vehicleStatus === "idle") {
      dispatch(fetchVehicles());
    }
    console.log(
      "Company data (from samplecompanydata.ts) loaded:",
      JSON.stringify(companyData, null, 2)
    );
  }, [dispatch, vehicleStatus]);

  const getCompanyNameById = useCallback(
    (companyId: string | null | undefined) => {
      if (!companyId) {
        return "N/A";
      }
      const company = companyData.find((c) => c.id === companyId);
      return company ? company.companyName : "Tidak dikenal";
    },
    []
  );

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

  const handleSaveVehicle = useCallback(
    async (values: VehicleFormValues) => {
      if (values.id) {
        await dispatch(updateVehicle(values));
      } else {
        await dispatch(createVehicle(values));
      }
      setIsVehicleDialogOpen(false);
      setEditVehicleData(undefined);
    },
    [dispatch]
  );

  const handleDeleteVehicle = useCallback(
    async (vehicleId: string) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus kendaraan ini?")) {
        await dispatch(deleteVehicle(vehicleId));
      }
    },
    [dispatch]
  ); // Dependencies are empty because setAllVehicles does not change

  const vehicleColumns: ColumnDef<Vehicle>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
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
      { accessorKey: "licensePlate", header: "Plat Nomor" },
      { accessorKey: "vehicleMake", header: "Merek" },
      { accessorKey: "model", header: "Model" },
      { accessorKey: "yearMade", header: "Tahun" },
      { accessorKey: "color", header: "Warna" },
      { accessorKey: "lastOdometer", header: "Odometer Terakhir (KM)" },
      {
        accessorKey: "lastServiceDate",
        header: "Servis Terakhir",
        cell: ({ row }) => {
          const date = row.original.lastServiceDate;
          if (date instanceof Date) {
            return format(date, "dd-MM-yyyy", { locale: id });
          }
          return "N/A";
        },
      },
      {
        accessorKey: "ownerId",
        header: "Pemilik (Perusahaan Rental)",
        cell: ({ row }) => getCompanyNameById(row.original.ownerId),
      },
      {
        accessorKey: "carUserId",
        header: "Pengguna Kendaraan (Penyewa)",
        cell: ({ row }) => getCompanyNameById(row.original.carUserId),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let statusColor: string;
          switch (status) {
            case VehicleStatus.ACTIVE:
              statusColor = "bg-green-100 text-green-800";
              break;
            case VehicleStatus.AVAILABLE:
              statusColor = "bg-blue-100 text-blue-800";
              break;
            case VehicleStatus.IN_MAINTENANCE:
              statusColor = "bg-orange-100 text-orange-800";
              break;
            case VehicleStatus.RENTED:
              statusColor = "bg-yellow-100 text-yellow-800";
              break;
            case VehicleStatus.OUT_OF_SERVICE:
              statusColor = "bg-red-100 text-red-800";
              break;
            case VehicleStatus.SOLD:
              statusColor = "bg-gray-100 text-gray-800";
              break;
            case VehicleStatus.ON_HOLD:
              statusColor = "bg-purple-100 text-purple-800";
              break;
            default:
              statusColor = "bg-gray-50 text-gray-700";
          }
          return (
            <span
              className={`${statusColor} px-2 py-1 rounded-full text-xs font-semibold`}
            >
              {status.replace(/_/g, " ")}
            </span>
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
                <DropdownMenuItem
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="text-red-600"
                >
                  Hapus Kendaraan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    // FIX: Use memoized handleEditVehicle and handleDeleteVehicle
    [
      handleEditVehicle,
      handleDeleteVehicle,
      getCompanyNameById,
      handleDetailVehicle,
    ]
  );

  const filteredVehicles = useMemo(() => {
    let currentVehicles = allVehicles;

    if (activeTab !== "all") {
      currentVehicles = currentVehicles.filter((vehicle) => {
        // Filter based on VehicleStatus
        if (
          Object.values(VehicleStatus).some(
            (status) => status.toLowerCase() === activeTab
          )
        ) {
          return vehicle.status.toLowerCase() === activeTab;
        }
        // Filter based on VehicleType
        if (
          Object.values(VehicleType).some(
            (type) => type.toLowerCase() === activeTab
          )
        ) {
          return vehicle.vehicleType.toLowerCase() === activeTab;
        }
        // Filter based on VehicleCategory
        if (
          Object.values(VehicleCategory).some(
            (category) => category.toLowerCase() === activeTab
          )
        ) {
          return vehicle.vehicleCategory.toLowerCase() === activeTab;
        }
        return true;
      });
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentVehicles = currentVehicles.filter(
        (vehicle) =>
          Object.values(vehicle).some(
            (value) =>
              (typeof value === "string" &&
                value.toLowerCase().includes(lowerCaseQuery)) ||
              (value instanceof Date &&
                format(value, "dd-MM-yyyy").includes(lowerCaseQuery)) ||
              (typeof value === "number" &&
                value.toString().includes(lowerCaseQuery))
          ) ||
          getCompanyNameById(vehicle.ownerId)
            .toLowerCase()
            .includes(lowerCaseQuery) ||
          getCompanyNameById(vehicle.carUserId)
            .toLowerCase()
            .includes(lowerCaseQuery)
      );
    }
    return currentVehicles;
  }, [allVehicles, activeTab, searchQuery, getCompanyNameById]);

  const vehicleTabItems = useMemo(() => {
    const allCount = allVehicles.length;
    const tabItems = [{ value: "all", label: "Semua", count: allCount }];

    // Add tabs for VehicleStatus
    Object.values(VehicleStatus).forEach((status) => {
      tabItems.push({
        value: status.toLowerCase(),
        label: status.replace(/_/g, " "),
        count: allVehicles.filter((v) => v.status === status).length,
      });
    });

    // Add tabs for VehicleType
    Object.values(VehicleType).forEach((type) => {
      tabItems.push({
        value: type.toLowerCase(),
        label: type.replace(/_/g, " "),
        count: allVehicles.filter((v) => v.vehicleType === type).length,
      });
    });

    // Add tabs for VehicleCategory
    Object.values(VehicleCategory).forEach((category) => {
      tabItems.push({
        value: category.toLowerCase(),
        label: category.replace(/_/g, " "),
        count: allVehicles.filter((v) => v.vehicleCategory === category).length,
      });
    });

    return tabItems;
  }, [allVehicles]);

  return (
    <TableMain<Vehicle>
      searchQuery={searchQuery}
      data={filteredVehicles}
      columns={vehicleColumns}
      tabItems={vehicleTabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="Tidak ada kendaraan ditemukan."
      isDialogOpen={isVehicleDialogOpen}
      onOpenChange={setIsVehicleDialogOpen}
      dialogContent={
        <VehicleDialog
          onClose={() => {
            setIsVehicleDialogOpen(false);
            setEditVehicleData(undefined); // Clear edit data when closing
          }}
          onSubmitVehicle={handleSaveVehicle}
          initialData={editVehicleData} // Pass initialData for editing
        />
      }
      dialogTitle={
        editVehicleData ? "Edit Kendaraan" : "Tambahkan Kendaraan Baru"
      }
      dialogDescription={
        editVehicleData
          ? "Ubah detail kendaraan ini."
          : "Isi detail kendaraan untuk menambah data kendaraan baru ke sistem."
      }
    />
  );
}
