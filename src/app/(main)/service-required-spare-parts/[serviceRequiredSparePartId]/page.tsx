"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ServiceRequiredSparePart, RawServiceRequiredSparePartApiResponse } from "@/types/serviceRequiredSpareParts"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function ServiceRequiredSparePartDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const serviceRequiredSparePartId = params.serviceRequiredSparePartId as string;

  const [srsp, setSrsp] = useState<ServiceRequiredSparePart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchServiceRequiredSparePart = useCallback(async () => {
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
      const response = await api.get<RawServiceRequiredSparePartApiResponse>(`http://localhost:3000/api/service-required-spare-parts/${serviceRequiredSparePartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: ServiceRequiredSparePart = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        service: response.service ? {
          id: response.service.id,
          name: response.service.name,
        } : undefined,
        sparePart: response.sparePart ? {
          id: response.sparePart.id,
          partNumber: response.sparePart.partNumber,
          partName: response.sparePart.partName,
          unit: response.sparePart.unit,
          price: response.sparePart.price,
        } : undefined,
      };

      setSrsp(formattedData);
      console.log("Data Service Required Spare Part yang diterima dari API (formatted):", formattedData);
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
  }, [serviceRequiredSparePartId, getAuthToken, router, toast]);

  useEffect(() => {
    if (serviceRequiredSparePartId) {
      fetchServiceRequiredSparePart();
    }
  }, [serviceRequiredSparePartId, fetchServiceRequiredSparePart]);

  if (loading) return <div>Memuat detail spare part jasa...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!srsp) return <div>Spare Part Jasa tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Spare Part Jasa</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Jasa:</strong> {srsp.service?.name || 'N/A'}</p>
          <p><strong>Spare Part:</strong> {srsp.sparePart?.partName || 'N/A'} ({srsp.sparePart?.partNumber || 'N/A'})</p>
          <p><strong>Kuantitas:</strong> {srsp.quantity} {srsp.sparePart?.unit || 'N/A'}</p>
          <p><strong>Harga Satuan Spare Part:</strong> Rp{srsp.sparePart?.price.toLocaleString('id-ID') || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(srsp.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(srsp.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
