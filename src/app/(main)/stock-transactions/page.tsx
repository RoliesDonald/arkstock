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
import { StockTransaction, RawStockTransactionApiResponse } from "@/types/stockTransaction"; 
import { StockTransactionFormValues } from "@/schemas/stockTransaction"; 
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
import { fetchStockTransactions, formatStockTransactionDates } from "@/store/slices/stockTransactionSlice"; 
import { StockTransactionType } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import StockTransactionDialogWrapper from "@/components/dialog/stockTransactionDialog/StockTransactionDialogWrapper";

export default function StockTransactionListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const allStockTransactions = useAppSelector((state) => state.stockTransactions.stockTransactions);
  const loading = useAppSelector((state) => state.stockTransactions.status === 'loading');
  const error = useAppSelector((state) => state.stockTransactions.error);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isStockTransactionDialogOpen, setIsStockTransactionDialogOpen] = useState<boolean>(false);
  const [editStockTransactionData, setEditStockTransactionData] = useState<StockTransaction | undefined>(undefined);
  const [stockTransactionToDelete, setStockTransactionToDelete] = useState<StockTransaction | undefined>(undefined);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  useEffect(() => {
    dispatch(fetchStockTransactions());
  }, [dispatch]);

  const handleDetailStockTransaction = useCallback(
    (stockTransaction: StockTransaction) => {
      router.push(`/stock-transactions/${stockTransaction.id}`);
    },
    [router]
  );

  const handleEditStockTransaction = useCallback((stockTransaction: StockTransaction) => {
    setEditStockTransactionData(stockTransaction);
    setIsStockTransactionDialogOpen(true);
  }, []);

  const handleSubmitStockTransaction = useCallback(
    async (values: StockTransactionFormValues) => {
      console.log("Submit Stock Transaction:", values);
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
        const url = `http://localhost:3000/api/stock-transactions${values.id ? `/${values.id}` : ''}`;
        
        let response;
        if (values.id) {
          response = await api.put<StockTransaction | RawStockTransactionApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          response = await api.post<StockTransaction | RawStockTransactionApiResponse>(url, values, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        toast({
          title: "Sukses",
          description: `Transaksi Stok berhasil di${values.id ? "perbarui" : "tambahkan"}.`,
        });
        setIsStockTransactionDialogOpen(false);
        setEditStockTransactionData(undefined);
        dispatch(fetchStockTransactions()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menyimpan transaksi stok.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const handleDeleteStockTransaction = useCallback(
    async (stockTransactionId: string) => {
      console.log("Delete Stock Transaction ID:", stockTransactionId);
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
        await api.delete(`http://localhost:3000/api/stock-transactions/${stockTransactionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        toast({
          title: "Sukses",
          description: "Transaksi Stok berhasil dihapus.",
        });
        setStockTransactionToDelete(undefined);
        dispatch(fetchStockTransactions()); 
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Terjadi kesalahan saat menghapus transaksi stok.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast, getAuthToken, router]
  );

  const stockTransactionColumns: ColumnDef<StockTransaction>[] = useMemo(
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
      { accessorKey: "transactionNumber", header: "Nomor Transaksi" },
      {
        accessorKey: "transactionDate",
        header: "Tanggal Transaksi",
        cell: ({ row }) => format(row.original.transactionDate, "PPP", { locale: localeId }),
      },
      {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }) => {
          const type = row.original.type;
          let typeColor: string;
          switch (type) {
            case StockTransactionType.IN:
              typeColor = "bg-green-200 text-green-800";
              break;
            case StockTransactionType.OUT:
              typeColor = "bg-red-200 text-red-800";
              break;
            case StockTransactionType.ADJUSTMENT:
              typeColor = "bg-yellow-200 text-yellow-800";
              break;
            case StockTransactionType.TRANSFER:
              typeColor = "bg-blue-200 text-blue-800";
              break;
            case StockTransactionType.RETURN:
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
      { accessorKey: "sparePart.partName", header: "Nama Part" },
      { accessorKey: "sourceWarehouse.name", header: "Gudang Sumber" }, // Perubahan
      { accessorKey: "targetWarehouse.name", header: "Gudang Tujuan" }, // Perubahan
      { accessorKey: "quantity", header: "Kuantitas" },
      { accessorKey: "processedBy.name", header: "Diproses Oleh" },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const stockTransaction = row.original;
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
                <DropdownMenuItem onClick={() => handleDetailStockTransaction(stockTransaction)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditStockTransaction(stockTransaction)}>
                  Edit Transaksi Stok
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStockTransactionToDelete(stockTransaction)} className="text-red-600">
                  Hapus Transaksi Stok
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailStockTransaction, handleEditStockTransaction]
  );

  const stockTransactionTabItems = useMemo(() => {
    return [
      { value: "all", label: "All", count: allStockTransactions.length },
      // Tabs for StockTransactionType
      {
        value: StockTransactionType.IN.toLowerCase(),
        label: "Masuk",
        count: allStockTransactions.filter((st) => st.type === StockTransactionType.IN).length,
      },
      {
        value: StockTransactionType.OUT.toLowerCase(),
        label: "Keluar",
        count: allStockTransactions.filter((st) => st.type === StockTransactionType.OUT).length,
      },
      {
        value: StockTransactionType.ADJUSTMENT.toLowerCase(),
        label: "Penyesuaian",
        count: allStockTransactions.filter((st) => st.type === StockTransactionType.ADJUSTMENT).length,
      },
      {
        value: StockTransactionType.TRANSFER.toLowerCase(),
        label: "Transfer",
        count: allStockTransactions.filter((st) => st.type === StockTransactionType.TRANSFER).length,
      },
      {
        value: StockTransactionType.RETURN.toLowerCase(),
        label: "Retur",
        count: allStockTransactions.filter((st) => st.type === StockTransactionType.RETURN).length,
      },
    ];
  }, [allStockTransactions]);

  const filteredStockTransactions = useMemo(() => {
    let data = allStockTransactions;

    if (activeTab !== "all") {
      data = data.filter((st) => {
        const lowerCaseActiveTab = activeTab.toLowerCase();
        // Cek berdasarkan StockTransactionType
        if (Object.values(StockTransactionType).some(t => t.toLowerCase() === lowerCaseActiveTab)) {
          return st.type.toLowerCase() === lowerCaseActiveTab;
        }
        return false;
      });
    }

    return data.filter((st) =>
      st.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.notes && st.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (st.sparePart?.partName && st.sparePart.partName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (st.sparePart?.partNumber && st.sparePart.partNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (st.sourceWarehouse?.name && st.sourceWarehouse.name.toLowerCase().includes(searchQuery.toLowerCase())) || // Perubahan
      (st.targetWarehouse?.name && st.targetWarehouse.name.toLowerCase().includes(searchQuery.toLowerCase())) || // Perubahan
      (st.processedBy?.name && st.processedBy.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allStockTransactions, activeTab, searchQuery]);

  const handleAddNewStockTransactionClick = useCallback(() => {
    setEditStockTransactionData(undefined);
    setIsStockTransactionDialogOpen(true);
  }, []);

  const handleStockTransactionDialogClose = useCallback(() => {
    setIsStockTransactionDialogOpen(false);
    setEditStockTransactionData(undefined);
  }, []);

  return (
    <>
      <TableMain<StockTransaction>
        searchQuery={searchQuery}
        data={filteredStockTransactions}
        columns={stockTransactionColumns}
        tabItems={stockTransactionTabItems} 
        activeTab={activeTab}       
        onTabChange={setActiveTab}   
        showAddButton={true}
        onAddClick={handleAddNewStockTransactionClick}
        showDownloadPrintButtons={true}
        emptyMessage={
          loading ? "Memuat data..." : error ? `Error: ${error}` : "Tidak ada Transaksi Stok ditemukan."
        }
      />

      <Dialog open={isStockTransactionDialogOpen} onOpenChange={setIsStockTransactionDialogOpen}>
        <StockTransactionDialogWrapper 
          onClose={handleStockTransactionDialogClose}
          initialData={editStockTransactionData}
          onSubmit={handleSubmitStockTransaction}
        />
      </Dialog>

      <AlertDialog open={!!stockTransactionToDelete} onOpenChange={(open) => !open && setStockTransactionToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus transaksi stok &quot;
              {stockTransactionToDelete?.transactionNumber}&quot;? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStockTransactionToDelete(undefined)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => stockTransactionToDelete && handleDeleteStockTransaction(stockTransactionToDelete.id)}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
