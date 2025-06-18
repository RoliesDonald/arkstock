// src/app/(main)/work-orders/page.tsx
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

// Import data dummy
import { workOrderData as initialWorkOrderData } from "@/data/sampleWorkOrderData";
import { companyData } from "@/data/sampleCompanyData"; // Dibutuhkan untuk mendapatkan nama vendor dari ID

// Import Redux hooks
import { useAppSelector } from "@/store/hooks";

// Import tipe
import {
  WorkOrder,
  WoProgresStatus,
  WoPriorityType,
  WorkOrderFormValues,
} from "@/types/workOrder";
import { Company } from "@/types/companies"; // Untuk tipe company jika dibutuhkan dalam filter/map

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import React, { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Untuk ID Work Order baru (simulasi)
import { format } from "date-fns";
import { id } from "date-fns/locale"; // Untuk format tanggal Indonesia
import WoDialog from "@/components/dialog/woDialog/_components/WoDialog";

export default function WorkOrderListPage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const [allWorkOrders, setAllWorkOrders] =
    useState<WorkOrder[]>(initialWorkOrderData);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isWoDialogOpen, setIsWoDialogOpen] = useState<boolean>(false);

  // Fungsi pembantu untuk mendapatkan nama perusahaan dari ID
  const getCompanyNameById = (companyId: string) => {
    const company = companyData.find((c) => c.id === companyId);
    return company ? company.companyName : "N/A";
  };

  const workOrderColumns: ColumnDef<WorkOrder>[] = useMemo(
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
      { accessorKey: "woNumber", header: "Nomor WO" },
      { accessorKey: "woMaster", header: "Nomor WO Master" },
      {
        accessorKey: "date",
        header: "Tanggal WO",
        cell: ({ row }) => {
          const date = row.original.date;
          if (date instanceof Date) {
            return format(date, "dd-MM-yyyy", { locale: id });
          }
          return "N/A";
        },
      },
      { accessorKey: "settledOdo", header: "Odometer (KM)" },
      { accessorKey: "remark", header: "Keluhan / Remark" },
      {
        accessorKey: "vehicleId", // Akses ID kendaraan
        header: "Plat Nomor Kendaraan",
        cell: ({ row }) => {
          // Asumsi Anda juga memiliki vehicleData
          const vehicle = (
            require("@/data/sampleVehicleData").vehicleData || []
          ).find((v: any) => v.id === row.original.vehicleId);
          return vehicle ? vehicle.licensePlate : "N/A";
        },
      },
      {
        accessorKey: "customerId",
        header: "Customer",
        cell: ({ row }) => getCompanyNameById(row.original.customerId),
      },
      {
        accessorKey: "vendorId",
        header: "Vendor Bengkel",
        cell: ({ row }) => getCompanyNameById(row.original.vendorId),
      },
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
              statusColor = "bg-purple-200 text-purple-800";
              break;
            case WoProgresStatus.WAITING_PART:
              statusColor = "bg-orange-200 text-orange-800";
              break;
            case WoProgresStatus.FINISHED:
              statusColor = "bg-green-200 text-green-800";
              break;
            case WoProgresStatus.CANCELED:
              statusColor = "bg-red-200 text-red-800";
              break;
            default:
              statusColor = "bg-gray-100 text-gray-700";
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
        accessorKey: "priorityType",
        header: "Prioritas",
        cell: ({ row }) => {
          const priority = row.original.priorityType;
          let priorityColor: string;
          switch (priority) {
            case WoPriorityType.NORMAL:
              priorityColor = "bg-blue-100 text-blue-800";
              break;
            case WoPriorityType.URGENT:
              priorityColor = "bg-yellow-100 text-yellow-800";
              break;
            case WoPriorityType.EMERGENCY:
              priorityColor = "bg-red-100 text-red-800";
              break;
            default:
              priorityColor = "bg-gray-100 text-gray-700";
          }
          return (
            <span
              className={`${priorityColor} px-2 py-1 rounded-full text-xs font-semibold`}
            >
              {priority}
            </span>
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
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {}}>
                  Create new Invoice from this selected WO
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert(`Lihat detail WO ${workOrder.woNumber}`)}
                >
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert(`Edit WO ${workOrder.woNumber}`)}
                >
                  Edit Work Order
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert(`Hapus WO ${workOrder.woNumber}`)}
                  className="text-red-600"
                >
                  Hapus Work Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const filteredWorkOrders = useMemo(() => {
    let currentWorkOrders = allWorkOrders;

    // Filter berdasarkan tab aktif (WoProgresStatus atau WoPriorityType)
    if (activeTab !== "all") {
      currentWorkOrders = currentWorkOrders.filter((wo) => {
        // Cek apakah tab aktif adalah status progres
        if (
          Object.values(WoProgresStatus).some(
            (status) => status.toLowerCase() === activeTab
          )
        ) {
          return wo.progresStatus.toLowerCase() === activeTab;
        }
        // Cek apakah tab aktif adalah tipe prioritas
        if (
          Object.values(WoPriorityType).some(
            (priority) => priority.toLowerCase() === activeTab
          )
        ) {
          return wo.priorityType.toLowerCase() === activeTab;
        }
        return true; // Jika tab tidak sesuai dengan status/prioritas, tetap sertakan semua
      });
    }

    // Filter berdasarkan search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentWorkOrders = currentWorkOrders.filter(
        (wo) =>
          Object.values(wo).some(
            (value) =>
              (typeof value === "string" &&
                value.toLowerCase().includes(lowerCaseQuery)) ||
              (value instanceof Date &&
                format(value, "dd-MM-yyyy").includes(lowerCaseQuery)) || // Search in formatted date
              (typeof value === "number" &&
                value.toString().includes(lowerCaseQuery)) // Search in number (e.g., odometer)
          ) ||
          // Juga cari di nama perusahaan customer/vendor jika relevan
          getCompanyNameById(wo.customerId)
            .toLowerCase()
            .includes(lowerCaseQuery) ||
          getCompanyNameById(wo.vendorId).toLowerCase().includes(lowerCaseQuery)
      );
    }
    return currentWorkOrders;
  }, [allWorkOrders, activeTab, searchQuery]);

  const workOrderTabItems = useMemo(() => {
    const allCount = allWorkOrders.length;
    const tabItems = [{ value: "all", label: "All", count: allCount }];

    // Tambahkan tab untuk setiap WoProgresStatus
    Object.values(WoProgresStatus).forEach((status) => {
      tabItems.push({
        value: status.toLowerCase(),
        label: status.replace(/_/g, " "), // Format label (misal: "ON_PROCESS" -> "ON PROCESS")
        count: allWorkOrders.filter((wo) => wo.progresStatus === status).length,
      });
    });

    // Tambahkan tab untuk setiap WoPriorityType
    Object.values(WoPriorityType).forEach((priority) => {
      tabItems.push({
        value: priority.toLowerCase(),
        label: priority.replace(/_/g, " "),
        count: allWorkOrders.filter((wo) => wo.priorityType === priority)
          .length,
      });
    });

    return tabItems;
  }, [allWorkOrders]);

  const handleAddWoSubmit = (values: WorkOrderFormValues) => {
    const newWo: WorkOrder = {
      ...values,
      id: uuidv4(), // Generate ID baru
      createdAt: new Date(),
      updatedAt: new Date(),
      woNumber: values.woNumber!,
      // Pastikan properti opsional yang null dari form tetap null
      schedule: values.schedule || null,
      notes: values.notes || null,
      mechanicId: values.mechanicId || null,
      driverId: values.driverId || null,
      driverContact: values.driverContact || null,
      approvedById: values.approvedById || null,
      requestedById: values.requestedById || null,
      locationId: values.locationId || null,
    };
    setAllWorkOrders((prev) => [...prev, newWo]);
    setIsWoDialogOpen(false);
    alert("Work Order berhasil ditambahkan!");
  };

  const handleDialogCLose = () => {
    setIsWoDialogOpen(false);
  };
  return (
    <TableMain<WorkOrder>
      searchQuery={searchQuery}
      data={filteredWorkOrders}
      columns={workOrderColumns}
      tabItems={workOrderTabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="Tidak ada Work Order ditemukan."
      isDialogOpen={isWoDialogOpen}
      onOpenChange={setIsWoDialogOpen}
      dialogContent={<WoDialog onClose={handleDialogCLose} />}
      dialogTitle="Tambahkan Work Order Baru"
      dialogDescription="Isi detail Work Order untuk menambah data Work Order baru ke sistem."
    />
  );
}
