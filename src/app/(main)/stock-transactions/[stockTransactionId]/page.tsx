"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { StockTransaction, RawStockTransactionApiResponse } from "@/types/stockTransaction"; 
import { StockTransactionType } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function StockTransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const stockTransactionId = params.stockTransactionId as string;

  const [stockTransaction, setStockTransaction] = useState<StockTransaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchStockTransaction = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      setError("Tidak ada token otentikasi. Silakan login kembali.");
      setLoading(false);
      router.push("/login"); 
      return;
    }

    try {
      const response = await api.get<RawStockTransactionApiResponse>(`http://localhost:3000/api/stock-transactions/${stockTransactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: StockTransaction = {
        ...response,
        transactionDate: new Date(response.transactionDate),
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        type: response.type as StockTransactionType,
        sparePart: response.sparePart ? {
          id: response.sparePart.id,
          partNumber: response.sparePart.partNumber,
          partName: response.sparePart.partName,
          unit: response.sparePart.unit,
        } : undefined,
        sourceWarehouse: response.sourceWarehouse ? {
          id: response.sourceWarehouse.id,
          name: response.sourceWarehouse.name,
        } : undefined,
        targetWarehouse: response.targetWarehouse ? {
          id: response.targetWarehouse.id,
          name: response.targetWarehouse.name,
        } : undefined,
        processedBy: response.processedBy ? {
          id: response.processedBy.id,
          name: response.processedBy.name,
        } : undefined,
      };

      setStockTransaction(formattedData);
      console.log("Data Transaksi Stok yang diterima dari API (formatted):", formattedData);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [stockTransactionId, getAuthToken, router, toast]);

  useEffect(() => {
    if (stockTransactionId) {
      fetchStockTransaction();
    }
  }, [stockTransactionId, fetchStockTransaction]);

  if (loading) return <div>Memuat detail transaksi stok...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stockTransaction) return <div>Transaksi Stok tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Transaksi Stok: {stockTransaction.transactionNumber}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nomor Transaksi:</strong> {stockTransaction.transactionNumber}</p>
          <p><strong>Tanggal Transaksi:</strong> {format(stockTransaction.transactionDate, "PPP", { locale: localeId })}</p>
          <p><strong>Tipe:</strong> {stockTransaction.type.replace(/_/g, " ")}</p>
          <p><strong>Spare Part:</strong> {stockTransaction.sparePart?.partName} ({stockTransaction.sparePart?.partNumber})</p>
          <p><strong>Gudang Sumber:</strong> {stockTransaction.sourceWarehouse?.name || 'N/A'}</p>
          <p><strong>Gudang Tujuan:</strong> {stockTransaction.targetWarehouse?.name || 'N/A'}</p>
          <p><strong>Kuantitas:</strong> {stockTransaction.quantity} {stockTransaction.sparePart?.unit}</p>
          <p><strong>Catatan:</strong> {stockTransaction.notes || 'N/A'}</p>
          <p><strong>Diproses Oleh:</strong> {stockTransaction.processedBy?.name || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(stockTransaction.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(stockTransaction.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
