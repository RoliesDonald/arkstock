"use client";

import TableMain from "@/components/common/table/TableMain";
import WarehouseStockDialogWrapper from "@/components/dialog/warehouseStockDialog/_components/WarehouseStockDialogWrapper"; 
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
import { WarehouseStock, RawWarehouseStockApiResponse } from "@/types/warehouseStok"; 
import { WarehouseStockFormValues } from "@/schemas/warehouseStock"; 
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
import { fetchWarehouseStocks, formatWarehouseStockDates } from "@/store/slices/warehouseStockSlice"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function WarehouseStockListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allWarehouseStocks = useAppSelector((state) => state.warehouseStocks.warehouseStocks);
  const loading = useAppSelector((state) => state.warehouseStocks.status === 'loading');
  const error = useAppSelector((state) => state.warehouseStocks.error);

  const [activeTab, setActiveTab] = useState<string>("all"); 
  const [isWarehouseStockDialogOpen, setIsWarehouseStockDialogOpen] = useState<boolean>(false);
  const [editWarehouseStockData, setEditWarehouseStockData] = useState<WarehouseStock | undefined>(undefined);
  const [warehouseStockToDelete, setWarehouseStockToDelete] = useState<WarehouseStock | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchWarehouseStocks());
  }, [dispatch]);

  const handleDetailWarehouseStock = useCallback(
    (ws: WarehouseStock) => {
      router.push(`/warehouse-stocks/${ws.id}`);
    },
    [router]
  );

  const handleEditWarehouseStock = useCallback((ws: WarehouseStock) => {
    setEditWarehouseStockData(ws);
    setIsWarehouseStockDialogOpen(true);
  }, []);

  const handleSubmitWarehouseStock = useCallback(
    async (values: WarehouseStockFormValues) => {
      console.log("Submit Warehouse Stock:", values);
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
        const url = `http://localhost:3000/api/warehouse-stocks${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<WarehouseStock | RawWarehouseStockApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<WarehouseStock | RawWarehouseStockApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Stok Gudang berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsWarehouseStockDialogOpen(false);
        setEditWarehouseStockData(undefined);
        dispatch(fetchWarehouseStocks()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan Stok Gudang.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteWarehouseStock = useCallback(
    async (wsId: string) => {
      console.log("Delete Warehouse Stock ID:", wsId);
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
        await api.delete(`http://localhost:3000/api/warehouse-stocks/${wsId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Stok Gudang berhasil dihapus.",
        });
        setWarehouseStockToDelete(undefined);
        dispatch(fetchWarehouseStocks()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus Stok Gudang.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const warehouseStockColumns: ColumnDef<WarehouseStock>[] = useMemo(
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
      { accessorKey: "warehouse.name", header: "Nama Gudang" },
      { accessorKey: "warehouse.location", header: "Lokasi Gudang" },
      { accessorKey: "currentStock", header: "Stok Saat Ini" },
      { accessorKey: "sparePart.unit", header: "Unit" },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const ws = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailWarehouseStock(ws)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditWarehouseStock(ws)}>
                  Edit Stok Gudang
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWarehouseStockToDelete(ws)} className="text-red-600">
                  Hapus Stok Gudang
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailWarehouseStock, handleEditWarehouseStock]
  );

  const warehouseStockTabItems = useMemo(() => {
    // For WarehouseStock, tabs might be based on warehouse or spare part category if needed.
    // For simplicity, starting with just "All".
    return [
      { value: "all", label: "All", count: allWarehouseStocks.length },
    ];
  }, [allWarehouseStocks]);

  const filteredWarehouseStocks = useMemo(() => {
    let data = allWarehouseStocks;

    // No specific tabs to filter by for now, only apply search query
    return data.filter((ws) =>
      (ws.sparePart?.partName && ws.sparePart.partName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ws.sparePart?.partNumber && ws.sparePart.partNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ws.warehouse?.name && ws.warehouse.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ws.warehouse?.location && ws.warehouse.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allWarehouseStocks, searchQuery]);

  const handleAddNewWarehouseStockClick = useCallback(() => {
    setEditWarehouseStockData(undefined);
    setIsWarehouseStockDialogOpen(true);
  }, []);

  const handleWarehouseStockDialogClose = useCallback(() => {
    setIsWarehouseStockDialogOpen(false);
    setEditWarehouseStockData(undefined);
  }, []);

  return (
    <>
      <TableMain<WarehouseStock>
        searchQuery={searchQuery}
        data={filteredWarehouseStocks}
        columns={warehouseStockColumns}
        tabItems={warehouseStockTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewWarehouseStockClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Stok Gudang ditemukan."
        }
      />

      <Dialog open={isWarehouseStockDialogOpen} onOpenChange={setIsWarehouseStockDialogOpen}>
        <WarehouseStockDialogWrapper 
          onClose={handleWarehouseStockDialogClose}
          initialData={editWarehouseStockData}
          onSubmit={handleSubmitWarehouseStock}
        />
      </Dialog>

      <AlertDialog open={!!warehouseStockToDelete} onOpenChange={(open) => !open && setWarehouseStockToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus stok gudang &quot;
              {warehouseStockToDelete?.sparePart?.partName} di {warehouseStockToDelete?.warehouse?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWarehouseStockToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => warehouseStockToDelete && handleDeleteWarehouseStock(warehouseStockToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
