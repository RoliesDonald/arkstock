"use client";

import { sparePartData } from "@/data/sampleSparePartData";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createStockTransaction,
  fetchStockTransactions,
} from "@/store/slices/stockTransactionSlice";
import { fetchWarehouses } from "@/store/slices/warehouseSlice";
import {
  fetchWarehouseStock,
  updateStockFromTransaction,
} from "@/store/slices/warehouseStockSlice";
import { WarehouseStock } from "@/types/warehouseStok";
import { ColumnDef } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  StockTransaction,
  StockTransactionFormValues,
  TransactionType,
} from "@/types/stockTransaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import TableMain from "@/components/common/table/TableMain";
import StockTransactionDialog from "@/components/dialog/stockTransactionDialog/StockTransactionDialog";

export default function WarehouseDetailPage() {
  const params = useParams();
  const warehouseId = params.warehouseId as string;
  const dispatch = useAppDispatch();

  const allWarehouse = useAppSelector((state) => state.warehouses.warehouses);
  const allStockItem = useAppSelector(
    (state) => state.warehouseStock.stockItems
  );
  const allTransactions = useAppSelector(
    (state) => state.stockTransactions.transactions
  );

  const warehouseStatus = useAppSelector((state) => state.warehouses.status);
  const stockStatus = useAppSelector((state) => state.warehouseStock.status);
  const transactionStatus = useAppSelector(
    (state) => state.stockTransactions.status
  );
  const router = useRouter();

  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  useEffect(() => {
    if (warehouseStatus === "idle") {
      dispatch(fetchWarehouses());
    }
    if (stockStatus === "idle") {
      dispatch(fetchWarehouseStock());
    }
    if (transactionStatus === "idle") {
      dispatch(fetchStockTransactions());
    }
  }, [dispatch, warehouseStatus, stockStatus, transactionStatus]);

  const handleBackToList = useCallback(() => {
    router.back();
  }, [router]);

  //cari gudang yg sedang display
  const currentWarehouse = useMemo(() => {
    return allWarehouse.find((wh) => wh.id === warehouseId);
  }, [allWarehouse, warehouseId]);

  //filter stok gudang
  const filteredStockItems = useMemo(() => {
    //gabungkan data sparepart ke dalam warehouse stok
    return allStockItem
      .filter((item) => item.warehouseId === warehouseId)
      .map((item) => {
        const sparePart = sparePartData.find(
          (sp) => sp.id === item.sparePartId
        );
        return {
          ...item,
          sparePartName: sparePart?.name || "N/A",
          partNumber: sparePart?.partNumber || "N/A",
          unit: sparePart?.unit || "N/A",
        };
      });
  }, [allStockItem, warehouseId]);

  const filteredTransactions = useMemo(() => {
    return allTransactions
      .filter(
        (tx) =>
          tx.sourceWarehouseId === warehouseId ||
          tx.targetWarehouseId === warehouseId
      )
      .map((tx) => {
        const sparePart = sparePartData.find((sp) => sp.id === tx.sparePartId);
        const sourceWarehouse = allWarehouse.find(
          (wh) => wh.id === tx.sourceWarehouseId
        );
        const targetWarehouse = allWarehouse.find(
          (wh) => wh.id === tx.targetWarehouseId
        );
        return {
          ...tx,
          sparePartName: sparePart?.name || "N/A",
          sourceWarehouseName: sourceWarehouse?.name || "N/A",
          targetWarehouseName: targetWarehouse?.name || "N/A",
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [allTransactions, allWarehouse, warehouseId]);

  // kolom untuk stok barang
  const warehouseStockColumns: ColumnDef<
    WarehouseStock & { sparePartName: string; partNumber: string; unit: string }
  >[] = useMemo(
    () => [
      { accessorKey: "sparePartName", header: "Suku Cadang" },
      { accessorKey: "partNumber", header: "Nomor Suku Cadang" },
      { accessorKey: "currentStock", header: "Stok Saat Ini" },
      { accessorKey: "unit", header: "Satuan" },
      {
        accessorKey: "updatedAt",
        header: "Terakhir Diperbarui",
        cell: ({ row }) =>
          format(row.original.updatedAt, "dd-MM-yyyy HH:mm", {
            locale: localeId,
          }),
      },
    ],
    []
  );

  //kolom untuk riwayat transaksi
  const transactionHistoryColumns: ColumnDef<
    StockTransaction & {
      sparePartName: string;
      sourceWarehouseName: string;
      targetWarehouseName: string;
    }
  >[] = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Tanggal",
        cell: ({ row }) =>
          format(row.original.date, "dd-MM-yyyy HH:mm", { locale: localeId }),
      },
      { accessorKey: "sparePartName", header: "Suku Cadang" },
      { accessorKey: "quantity", header: "Kuantitas" },
      {
        accessorKey: "transactionType",
        header: "Jenis Transaksi",
        cell: ({ row }) => row.original.transactionType.replace(/_/g, ""),
      },
      { accessorKey: "sourceWarehouseName", header: "Gudang Asal" },
      {
        accessorKey: "targetWarehouseName",
        header: "Gudang Tujuan",
        cell: ({ row }) =>
          row.original.targetWarehouseName === "N/A"
            ? "-"
            : row.original.targetWarehouseName,
      },
      { accessorKey: "remark", header: "Remark" },
    ],
    []
  );

  //handler untuk transaksi baru
  const handleAddStockTransaction = useCallback(
    async (values: StockTransactionFormValues) => {
      //membuat transaksi baru
      const resultAction = await dispatch(createStockTransaction(values));
      if (createStockTransaction.fulfilled.match(resultAction)) {
        const newTransaction = resultAction.payload;
        // update stok gudang asal
        dispatch(
          updateStockFromTransaction({
            sparePartId: newTransaction.sparePartId,
            warehouseId: newTransaction.sourceWarehouseId,
            quantity: newTransaction.quantity,
            transactionType:
              newTransaction.transactionType === TransactionType.TRANSFER_OUT
                ? TransactionType.TRANSFER_OUT
                : newTransaction.transactionType,
          })
        );

        // update stok gudang tujuan
        if (
          newTransaction.transactionType === TransactionType.TRANSFER_OUT &&
          newTransaction.targetWarehouseId
        ) {
          dispatch(
            updateStockFromTransaction({
              sparePartId: newTransaction.sparePartId,
              warehouseId: newTransaction.targetWarehouseId,
              quantity: newTransaction.quantity,
              transactionType: TransactionType.TRANSFER_IN,
            })
          );
        }
        alert("Transaksi stok berhasil ditambahkan..!!");
      } else {
        alert(
          `Gagal menambahkan transaksi stok: ${
            resultAction.payload ||
            "Terjadi kesalahan saat menambahkan transaksi stok"
          }`
        );
      }
      setIsTransactionDialogOpen(false);
    },
    [dispatch]
  );

  if (!currentWarehouse) {
    if (warehouseStatus === "loading") {
      return <div className="text-center py-8">Memuat detail Gudang ...</div>;
    }
    return (
      <div className="text-center py-8 text-arkRed-500 font-bold text-xl">
        Gudang tidak ditemukan
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold mb-6">
          Detail Gudang: {currentWarehouse.name}
        </h1>
        <Button variant={"default"} onClick={handleBackToList}>
          Back
        </Button>
      </div>
      {/* Info tentang Gudang */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Informasi Umum</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Lokasi :</p>
            <p className="font-medium">{currentWarehouse.location}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gudang Utama :</p>
            <p className="font-medium">
              {currentWarehouse.isMainWarehouse ? "Ya" : "Tidak"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dibuat Pada :</p>
            <p className="font-medium">
              {format(currentWarehouse.createdAt, "dd-MM-yyyy", {
                locale: localeId,
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Diupdate Pada :</p>
            <p className="font-medium">
              {format(currentWarehouse.updatedAt, "dd-MM-yyyy", {
                locale: localeId,
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info stok gudang */}
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stock Gudang</CardTitle>
          <Button
            className="flex items-center"
            onClick={() => setIsTransactionDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Transaksi Baru
          </Button>
        </CardHeader>
        <CardContent>
          <TableMain
            searchQuery=""
            data={filteredStockItems}
            columns={warehouseStockColumns}
            emptyMessage="Tidak ada stock di gudang ini."
            showAddButton={false}
            isDialogOpen={isTransactionDialogOpen}
            showDownloadPrintButtons={false}
            tabItems={[]}
            activeTab="all"
            onOpenChange={() => {}}
          />
        </CardContent>
      </Card>

      {/* Riwayat Transaksi Stok */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi Stok</CardTitle>
        </CardHeader>
        <CardContent>
          <TableMain
            searchQuery="" // Pencarian di sini mungkin tidak diperlukan atau bisa disesuaikan
            data={filteredTransactions}
            columns={transactionHistoryColumns}
            emptyMessage="Tidak ada riwayat transaksi stok untuk gudang ini."
            showAddButton={false}
            isDialogOpen={isTransactionDialogOpen}
            onOpenChange={() => {}}
            showDownloadPrintButtons={false}
            tabItems={[]} // Tidak ada tab untuk tabel transaksi
            activeTab="all"
            onTabChange={() => {}}
          />
        </CardContent>
      </Card>

      {/* Dialog Transaksi Stok */}
      {isTransactionDialogOpen && (
        <TableMain // Re-use TableMain's Dialog wrapper capabilities
          isDialogOpen={isTransactionDialogOpen}
          onOpenChange={setIsTransactionDialogOpen}
          dialogContent={
            <StockTransactionDialog
              onClose={() => setIsTransactionDialogOpen(false)}
              onSubmitTransaction={handleAddStockTransaction}
              currentWarehouseId={warehouseId} // Teruskan ID gudang saat ini
            />
          }
          dialogTitle="Tambah Transaksi Stok"
          dialogDescription="Catat pergerakan suku cadang (IN, OUT, Transfer)."
          // Props ini tidak digunakan oleh TableMain jika hanya sebagai wrapper Dialog,
          // tetapi harus ada agar tidak ada error TypeScript jika TableMain mengharapkan semua props ini.
          searchQuery={""}
          data={[]}
          columns={[]}
          tabItems={[]}
          activeTab={""}
          onTabChange={() => {}}
        />
      )}
    </div>
  );
}
