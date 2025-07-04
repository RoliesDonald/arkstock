"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createWarehouse,
  deleteWarehouse,
  fetchWarehouses,
  updateWarehouse,
} from "@/store/slices/warehouseSlice";
import { Warehouse, WarehouseFormValues } from "@/types/warehouse";
import { ColumnDef } from "@tanstack/react-table";
import { set } from "lodash";
import { MoreVertical } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { count } from "console";
import TableMain from "@/components/common/table/TableMain";
import WarehouseDialog from "@/components/dialog/warehouseDialog/WarehouseDialog";
import { useRouter } from "next/navigation";

export default function WarehouseListPage() {
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const dispatch = useAppDispatch();

  // data gudang dan status dari redux
  const allWarehouses = useAppSelector((state) => state.warehouses.warehouses);
  const warehouseStatus = useAppSelector((state) => state.warehouses.status);
  const warehouseError = useAppSelector((state) => state.warehouses.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isWarehouseDialogOpen, setIsWarehouseDialogOpen] = useState(false);
  const [editWarehouseData, setEditWarehouseData] = useState<
    Warehouse | undefined
  >(undefined);
  const router = useRouter();

  // ambil data saat komponen warehouse pertama loading
  useEffect(() => {
    if (warehouseStatus === "idle") {
      dispatch(fetchWarehouses());
    }
  }, [dispatch, warehouseStatus]);

  const handleEditWarehouse = useCallback((warehouse: Warehouse) => {
    setEditWarehouseData(warehouse);
    setIsWarehouseDialogOpen(true);
  }, []);

  const handleSaveWarehouse = useCallback(
    async (values: WarehouseFormValues) => {
      if (values.id) {
        const existingWarehouse = allWarehouses.find(
          (wh) => wh.id === values.id
        );
        if (existingWarehouse) {
          const fullUpdatedWarehouse: Warehouse = {
            ...existingWarehouse,
            ...values,
            updatedAt: new Date(), // Perbarui timestamp
          };
          await dispatch(updateWarehouse(fullUpdatedWarehouse));
        }
      } else {
        // Mode tambah baru, id, createdAt, updatedAt akan di-generate di slice
        await dispatch(createWarehouse(values));
      }
      setIsWarehouseDialogOpen(false);
      setEditWarehouseData(undefined);
    },
    [dispatch, allWarehouses]
  );

  const handleDeleteWarehouse = useCallback(
    async (warehouseId: string) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus gudang ini?")) {
        await dispatch(deleteWarehouse(warehouseId));
      }
    },
    [dispatch]
  );

  const handleDetailWarehouse = useCallback(
    (warehouse: Warehouse) => {
      router.push(`/warehouse/${warehouse.id}`);
    },
    [router]
  );

  const warehouseColums: ColumnDef<Warehouse>[] = useMemo(
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
            aria-label="Select Row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      { accessorKey: "name", header: "Nama Gudang" },
      { accessorKey: "location", header: "Lokasi" },
      {
        accessorKey: "isMainWarehouse",
        header: "Gudang Utama",
        cell: ({ row }) => (row.original.isMainWarehouse ? "Ya" : "Tidak"),
      },
      {
        accessorKey: "createdAt",
        header: "Dibuat Pada",
        cell: ({ row }) => {
          const date = row.original.createdAt;
          if (date instanceof Date) {
            return format(date, "dd-MM-yyyy HH:mm", { locale: id });
          }
          return "N/A";
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Diperbarui Pada",
        cell: ({ row }) => {
          const date = row.original.updatedAt;
          if (date instanceof Date) {
            return format(date, "dd-MM-yyyy HH:mm", { locale: id });
          }
          return "N/A";
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const warehouse = row.original;
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
                <DropdownMenuItem
                  onClick={() => handleDetailWarehouse(warehouse)}
                >
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleEditWarehouse(warehouse)}
                >
                  Edit Gudang
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteWarehouse(warehouse.id)}
                  className="text-red-600"
                >
                  Hapus Gudang
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDeleteWarehouse, handleEditWarehouse, handleDetailWarehouse]
  );

  const filteredWarehouses = useMemo(() => {
    let currentWarehouses = allWarehouses;
    if (activeTab !== "all") {
      if (activeTab === "main_warehouse") {
        currentWarehouses = currentWarehouses.filter(
          (wh) => wh.isMainWarehouse
        );
      } else if (activeTab === "sub_warehouse") {
        currentWarehouses = currentWarehouses.filter(
          (wh) => !wh.isMainWarehouse
        );
      }
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentWarehouses = currentWarehouses.filter((warehouse) =>
        Object.values(warehouse).some(
          (value) =>
            (typeof value === "string" &&
              value.toLowerCase().includes(lowerCaseQuery)) ||
            (value instanceof Date &&
              format(value, "dd-MM-yyyy").includes(lowerCaseQuery)) ||
            (typeof value === "number" &&
              value.toString().includes(lowerCaseQuery))
        )
      );
    }
    return currentWarehouses;
  }, [activeTab, searchQuery, allWarehouses]);

  const warehouseTabItems = useMemo(() => {
    const allCount = allWarehouses.length;
    const mainCount = allWarehouses.filter((wh) => wh.isMainWarehouse).length;
    const subCount = allWarehouses.filter((wh) => !wh.isMainWarehouse).length;

    return [
      { value: "all", label: "Semua", count: allCount },
      { value: "main_warehouse", label: "Gudang Utama", count: mainCount },
      { value: "sub_warehouse", label: "Gudang Sub", count: subCount },
    ];
  }, [allWarehouses]);

  // status loading atau error

  if (warehouseStatus === "loading") {
    return <div className="text-center py-8">Memuat data gudang...</div>;
  }

  if (warehouseStatus === "failed") {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {warehouseError}
      </div>
    );
  }

  return (
    <TableMain<Warehouse>
      searchQuery={searchQuery}
      data={filteredWarehouses}
      columns={warehouseColums}
      tabItems={warehouseTabItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showAddButton={true}
      showDownloadPrintButtons={true}
      emptyMessage="Tidak ada gudang ditemukan."
      isDialogOpen={isWarehouseDialogOpen}
      onOpenChange={setIsWarehouseDialogOpen}
      dialogContent={
        <WarehouseDialog
          onClose={() => {
            setIsWarehouseDialogOpen(false);
            setEditWarehouseData(undefined); // Clear edit data when closing
          }}
          onSubmitWarehouse={handleSaveWarehouse}
          initialData={editWarehouseData} // Pass initialData for editing
        />
      }
      dialogTitle={editWarehouseData ? "Edit Gudang" : "Tambahkan Gudang Baru"}
      dialogDescription={
        editWarehouseData
          ? "Ubah detail gudang ini."
          : "Isi detail gudang untuk menambah data gudang baru ke sistem."
      }
    />
  );
}
