"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Warehouse, RawWarehouseApiResponse } from "@/types/warehouse"; 
import { WarehouseType } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function WarehouseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const warehouseId = params.warehouseId as string;

  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchWarehouse = useCallback(async () => {
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
      const response = await api.get<RawWarehouseApiResponse>(`http://localhost:3000/api/warehouses/${warehouseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: Warehouse = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        warehouseType: response.warehouseType as WarehouseType,
      };

      setWarehouse(formattedData);
      console.log("Data Gudang yang diterima dari API (formatted):", formattedData);
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
  }, [warehouseId, getAuthToken, router, toast]);

  useEffect(() => {
    if (warehouseId) {
      fetchWarehouse();
    }
  }, [warehouseId, fetchWarehouse]);

  if (loading) return <div>Memuat detail gudang...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!warehouse) return <div>Gudang tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Gudang: {warehouse.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nama Gudang:</strong> {warehouse.name}</p>
          <p><strong>Lokasi:</strong> {warehouse.location}</p>
          <p><strong>Tipe Gudang:</strong> {warehouse.warehouseType.replace(/_/g, " ")}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(warehouse.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(warehouse.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
