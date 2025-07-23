"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { EstimationService, RawEstimationServiceApiResponse } from "@/types/estimationServices"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function EstimationServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const estimationServiceId = params.estimationServiceId as string;

  const [estimationService, setEstimationService] = useState<EstimationService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchEstimationService = useCallback(async () => {
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
      const response = await api.get<RawEstimationServiceApiResponse>(`http://localhost:3000/api/estimation-services/${estimationServiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: EstimationService = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        estimation: response.estimation ? {
          id: response.estimation.id,
          estimationNumber: response.estimation.estimationNumber,
        } : undefined,
        service: response.service ? {
          id: response.service.id,
          name: response.service.name,
          price: response.service.price,
        } : undefined,
      };

      setEstimationService(formattedData);
      console.log("Data Jasa Estimasi yang diterima dari API (formatted):", formattedData);
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
  }, [estimationServiceId, getAuthToken, router, toast]);

  useEffect(() => {
    if (estimationServiceId) {
      fetchEstimationService();
    }
  }, [estimationServiceId, fetchEstimationService]);

  if (loading) return <div>Memuat detail jasa estimasi...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!estimationService) return <div>Jasa Estimasi tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Jasa Estimasi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Estimasi:</strong> {estimationService.estimation?.estimationNumber || 'N/A'}</p>
          <p><strong>Jasa:</strong> {estimationService.service?.name || 'N/A'}</p>
          <p><strong>Kuantitas:</strong> {estimationService.quantity}</p>
          <p><strong>Harga Satuan:</strong> Rp{estimationService.unitPrice.toLocaleString('id-ID')}</p>
          <p><strong>Total Harga:</strong> Rp{estimationService.totalPrice.toLocaleString('id-ID')}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(estimationService.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(estimationService.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
