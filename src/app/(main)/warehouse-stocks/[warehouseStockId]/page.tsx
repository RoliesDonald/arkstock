"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { WarehouseStock, RawWarehouseStockApiResponse } from "@/types/warehouseStok"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function WarehouseStockDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const warehouseStockId = params.warehouseStockId as string;

  const [warehouseStock, setWarehouseStock] = useState<WarehouseStock | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchWarehouseStock = useCallback(async () => {
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
      const response = await api.get<RawWarehouseStockApiResponse>(`http://localhost:3000/api/warehouse-stocks/${warehouseStockId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: WarehouseStock = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        sparePart: response.sparePart ? {
          id: response.sparePart.id,
          partNumber: response.sparePart.partNumber,
          partName: response.sparePart.partName,
          unit: response.sparePart.unit,
        } : undefined,
        warehouse: response.warehouse ? {
          id: response.warehouse.id,
          name: response.warehouse.name,
          location: response.warehouse.location,
        } : undefined,
      };

      setWarehouseStock(formattedData);
      console.log("Data Stok Gudang yang diterima dari API (formatted):", formattedData);
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
  }, [warehouseStockId, getAuthToken, router, toast]);

  useEffect(() => {
    if (warehouseStockId) {
      fetchWarehouseStock();
    }
  }, [warehouseStockId, fetchWarehouseStock]);

  if (loading) return <div>Memuat detail stok gudang...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!warehouseStock) return <div>Stok Gudang tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Stok Gudang</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Spare Part:</strong> {warehouseStock.sparePart?.partName || 'N/A'} ({warehouseStock.sparePart?.partNumber || 'N/A'})</p>
          <p><strong>Gudang:</strong> {warehouseStock.warehouse?.name || 'N/A'} ({warehouseStock.warehouse?.location || 'N/A'})</p>
          <p><strong>Stok Saat Ini:</strong> {warehouseStock.currentStock} {warehouseStock.sparePart?.unit || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(warehouseStock.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(warehouseStock.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
