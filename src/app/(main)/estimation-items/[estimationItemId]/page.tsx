"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { EstimationItem, RawEstimationItemApiResponse } from "@/types/estimationItems"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function EstimationItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const estimationItemId = params.estimationItemId as string;

  const [estimationItem, setEstimationItem] = useState<EstimationItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchEstimationItem = useCallback(async () => {
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
      const response = await api.get<RawEstimationItemApiResponse>(`http://localhost:3000/api/estimation-items/${estimationItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: EstimationItem = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        estimation: response.estimation ? {
          id: response.estimation.id,
          estimationNumber: response.estimation.estimationNumber,
        } : undefined,
        sparePart: response.sparePart ? {
          id: response.sparePart.id,
          partNumber: response.sparePart.partNumber,
          partName: response.sparePart.partName,
          unit: response.sparePart.unit,
        } : undefined,
      };

      setEstimationItem(formattedData);
      console.log("Data Item Estimasi yang diterima dari API (formatted):", formattedData);
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
  }, [estimationItemId, getAuthToken, router, toast]);

  useEffect(() => {
    if (estimationItemId) {
      fetchEstimationItem();
    }
  }, [estimationItemId, fetchEstimationItem]);

  if (loading) return <div>Memuat detail item estimasi...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!estimationItem) return <div>Item Estimasi tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Item Estimasi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Estimasi:</strong> {estimationItem.estimation?.estimationNumber || 'N/A'}</p>
          <p><strong>Spare Part:</strong> {estimationItem.sparePart?.partName || 'N/A'} ({estimationItem.sparePart?.partNumber || 'N/A'})</p>
          <p><strong>Kuantitas:</strong> {estimationItem.quantity} {estimationItem.sparePart?.unit || 'N/A'}</p>
          <p><strong>Harga Satuan:</strong> Rp{estimationItem.price.toLocaleString('id-ID')}</p>
          <p><strong>Subtotal:</strong> Rp{estimationItem.subtotal.toLocaleString('id-ID')}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(estimationItem.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(estimationItem.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
