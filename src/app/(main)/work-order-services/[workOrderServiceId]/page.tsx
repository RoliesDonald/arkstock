"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { WorkOrderService, RawWorkOrderServiceApiResponse } from "@/types/workOrderServices"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function WorkOrderServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const workOrderServiceId = params.workOrderServiceId as string;

  const [workOrderService, setWorkOrderService] = useState<WorkOrderService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchWorkOrderService = useCallback(async () => {
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
      const response = await api.get<RawWorkOrderServiceApiResponse>(`http://localhost:3000/api/work-order-services/${workOrderServiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: WorkOrderService = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        workOrder: response.workOrder ? {
          id: response.workOrder.id,
          workOrderNumber: response.workOrder.workOrderNumber,
        } : undefined,
        service: response.service ? {
          id: response.service.id,
          name: response.service.name,
          price: response.service.price,
        } : undefined,
      };

      setWorkOrderService(formattedData);
      console.log("Data Jasa Work Order yang diterima dari API (formatted):", formattedData);
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
  }, [workOrderServiceId, getAuthToken, router, toast]);

  useEffect(() => {
    if (workOrderServiceId) {
      fetchWorkOrderService();
    }
  }, [workOrderServiceId, fetchWorkOrderService]);

  if (loading) return <div>Memuat detail jasa work order...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!workOrderService) return <div>Jasa Work Order tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Jasa Work Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Work Order:</strong> {workOrderService.workOrder?.workOrderNumber || 'N/A'}</p>
          <p><strong>Jasa:</strong> {workOrderService.service?.name || 'N/A'}</p>
          <p><strong>Kuantitas:</strong> {workOrderService.quantity}</p>
          <p><strong>Harga Satuan:</strong> Rp{workOrderService.unitPrice.toLocaleString('id-ID')}</p>
          <p><strong>Total Harga:</strong> Rp{workOrderService.totalPrice.toLocaleString('id-ID')}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrderService.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrderService.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
