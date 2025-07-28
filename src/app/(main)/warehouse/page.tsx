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
import { Warehouse, RawWarehouseApiResponse } from "@/types/warehouse"; 
import { WarehouseFormValues } from "@/schemas/warehouse"; 
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
import { fetchWarehouses, formatWarehouseDates } from "@/store/slices/warehouseSlice"; 
import { WarehouseType } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import WarehouseDialogWrapper from "@/components/dialog/warehouseDialog/WarehouseDialogWrapper";

export default function WarehouseListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allWarehouses = useAppSelector((state) => state.warehouses.warehouses);
  const loading = useAppSelector((state) => state.warehouses.status === 'loading');
  const error = useAppSelector((state) => state.warehouses.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isWarehouseDialogOpen, setIsWarehouseDialogOpen] = useState<boolean>(false);
  const [editWarehouseData, setEditWarehouseData] = useState<Warehouse | undefined>(undefined);
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchWarehouses());
  }, [dispatch]);

  const handleDetailWarehouse = useCallback(
    (warehouse: Warehouse) => {
      router.push(`/warehouses/${warehouse.id}`);
    },
    [router]
  );

  const handleEditWarehouse = useCallback((warehouse: Warehouse) => {
    setEditWarehouseData(warehouse);
    setIsWarehouseDialogOpen(true);
  }, []);

  const handleSubmitWarehouse = useCallback(
    async (values: WarehouseFormValues) => {
      console.log("Submit Warehouse:", values);
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
        const url = `http://localhost:3000/api/warehouses${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<Warehouse | RawWarehouseApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<Warehouse | RawWarehouseApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Gudang berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsWarehouseDialogOpen(false);
        setEditWarehouseData(undefined);
        dispatch(fetchWarehouses()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan gudang.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteWarehouse = useCallback(
    async (warehouseId: string) => {
      console.log("Delete Warehouse ID:", warehouseId);
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
        await api.delete(`http://localhost:3000/api/warehouses/${warehouseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Gudang berhasil dihapus.",
        });
        setWarehouseToDelete(undefined);
        dispatch(fetchWarehouses()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus gudang.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const warehouseColumns: ColumnDef<Warehouse>[] = useMemo(
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
      { accessorKey: "name", header: "Nama Gudang" },
      { accessorKey: "location", header: "Lokasi" },
      {
        accessorKey: "warehouseType",
        header: "Tipe Gudang",
        cell: ({ row }) => {
          const type = row.original.warehouseType;
          let typeColor: string;
          switch (type) {
            case WarehouseType.CENTRAL_WAREHOUSE:
              typeColor = "bg-blue-200 text-blue-800";
              break;
            case WarehouseType.BRANCH_WAREHOUSE:
              typeColor = "bg-green-200 text-green-800";
              break;
            case WarehouseType.SERVICE_CAR_WAREHOUSE:
              typeColor = "bg-purple-200 text-purple-800";
              break;
            default:
              typeColor = "bg-gray-400 text-gray-800";
          }
          return (
            <span className={`${typeColor} px-2 py-1 rounded-full text-xs font-semibold`}>{type.replace(/_/g, " ")}</span>
          );
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
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleDetailWarehouse(warehouse)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditWarehouse(warehouse)}>
                  Edit Gudang
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWarehouseToDelete(warehouse)} className="text-red-600">
                  Hapus Gudang
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailWarehouse, handleEditWarehouse]
  );

  const warehouseTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allWarehouses.length },
      // Tabs for WarehouseType
      {
        value: WarehouseType.CENTRAL_WAREHOUSE.toLowerCase(),
        label: "Gudang Pusat",
        count: allWarehouses.filter((wh) => wh.warehouseType === WarehouseType.CENTRAL_WAREHOUSE).length,
      },
      {
        value: WarehouseType.BRANCH_WAREHOUSE.toLowerCase(),
        label: "Gudang Cabang",
        count: allWarehouses.filter((wh) => wh.warehouseType === WarehouseType.BRANCH_WAREHOUSE).length,
      },
      {
        value: WarehouseType.SERVICE_CAR_WAREHOUSE.toLowerCase(),
        label: "Gudang Mobil Servis",
        count: allWarehouses.filter((wh) => wh.warehouseType === WarehouseType.SERVICE_CAR_WAREHOUSE).length,
      },
    ];
  }, [allWarehouses]);

  const filteredWarehouses = useMemo(() => {
    let data = allWarehouses;

    if (activeTab !== "all") {
      data = data.filter((warehouse) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan WarehouseType
        if (Object.values(WarehouseType).some(t => t.toLowerCase() === lowerCaseActiveTab)) {
          return warehouse.warehouseType.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter((warehouse) =>
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allWarehouses, activeTab, searchQuery]);

  const handleAddNewWarehouseClick = useCallback(() => {
    setEditWarehouseData(undefined);
    setIsWarehouseDialogOpen(true);
  }, []);

  const handleWarehouseDialogClose = useCallback(() => {
    setIsWarehouseDialogOpen(false);
    setEditWarehouseData(undefined);
  }, []);

  return (
    <>
      <TableMain<Warehouse>
        searchQuery={searchQuery}
        data={filteredWarehouses}
        columns={warehouseColumns}
        tabItems={warehouseTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewWarehouseClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Gudang ditemukan."
        }
      />

      <Dialog open={isWarehouseDialogOpen} onOpenChange={setIsWarehouseDialogOpen}>
        <WarehouseDialogWrapper 
          onClose={handleWarehouseDialogClose}
          initialData={editWarehouseData}
          onSubmit={handleSubmitWarehouse}
        />
      </Dialog>

      <AlertDialog open={!!warehouseToDelete} onOpenChange={(open) => !open && setWarehouseToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus gudang &quot;
              {warehouseToDelete?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWarehouseToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => warehouseToDelete && handleDeleteWarehouse(warehouseToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
