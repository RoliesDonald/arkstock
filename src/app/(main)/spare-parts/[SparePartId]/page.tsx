"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { SparePart, RawSparePartApiResponse } from "@/types/sparepart"; 
import { PartVariant, SparePartCategory, SparePartStatus } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function SparePartDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const sparePartId = params.sparePartId as string;

  const [sparePart, setSparePart] = useState<SparePart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchSparePart = useCallback(async () => {
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
      const response = await api.get<RawSparePartApiResponse>(`http://localhost:3000/api/spare-parts/${sparePartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: SparePart = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        variant: response.variant as PartVariant,
        category: response.category as SparePartCategory,
        status: response.status as SparePartStatus,
      };

      setSparePart(formattedData);
      console.log("Data Spare Part yang diterima dari API (formatted):", formattedData);
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
  }, [sparePartId, getAuthToken, router, toast]);

  useEffect(() => {
    if (sparePartId) {
      fetchSparePart();
    }
  }, [sparePartId, fetchSparePart]);

  if (loading) return <div>Memuat detail spare part...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!sparePart) return <div>Spare Part tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Spare Part: {sparePart.partName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nomor Part:</strong> {sparePart.partNumber}</p>
          <p><strong>SKU:</strong> {sparePart.sku || 'N/A'}</p>
          <p><strong>Nama Part:</strong> {sparePart.partName}</p>
          <p><strong>Varian:</strong> {sparePart.variant}</p>
          <p><strong>Merk:</strong> {sparePart.make || 'N/A'}</p>
          <p><strong>Harga:</strong> Rp{sparePart.price.toLocaleString('id-ID')}</p>
          <p><strong>Unit:</strong> {sparePart.unit}</p>
          <p><strong>Deskripsi:</strong> {sparePart.description || 'N/A'}</p>
          <p><strong>Stok Saat Ini:</strong> {sparePart.stock}</p>
          <p><strong>Stok Awal:</strong> {sparePart.initialStock}</p>
          <p><strong>Brand:</strong> {sparePart.brand || 'N/A'}</p>
          <p><strong>Manufaktur:</strong> {sparePart.manufacturer || 'N/A'}</p>
          <p><strong>Kategori:</strong> {sparePart.category}</p>
          <p><strong>Status:</strong> {sparePart.status}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(sparePart.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(sparePart.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
