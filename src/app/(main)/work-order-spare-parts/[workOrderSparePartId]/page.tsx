"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { WorkOrderSparePart, RawWorkOrderSparePartApiResponse } from "@/types/workOrderSpareParts"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function WorkOrderSparePartDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const workOrderSparePartId = params.workOrderSparePartId as string;

  const [workOrderSparePart, setWorkOrderSparePart] = useState<WorkOrderSparePart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchWorkOrderSparePart = useCallback(async () => {
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
      const response = await api.get<RawWorkOrderSparePartApiResponse>(`http://localhost:3000/api/work-order-spare-parts/${workOrderSparePartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: WorkOrderSparePart = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        workOrder: response.workOrder ? {
          id: response.workOrder.id,
          workOrderNumber: response.workOrder.workOrderNumber,
        } : undefined,
        sparePart: response.sparePart ? {
          id: response.sparePart.id,
          partNumber: response.sparePart.partNumber,
          partName: response.sparePart.partName,
          unit: response.sparePart.unit,
        } : undefined,
      };

      setWorkOrderSparePart(formattedData);
      console.log("Data Spare Part Work Order yang diterima dari API (formatted):", formattedData);
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
  }, [workOrderSparePartId, getAuthToken, router, toast]);

  useEffect(() => {
    if (workOrderSparePartId) {
      fetchWorkOrderSparePart();
    }
  }, [workOrderSparePartId, fetchWorkOrderSparePart]);

  if (loading) return <div>Memuat detail spare part work order...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!workOrderSparePart) return <div>Spare Part Work Order tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Spare Part Work Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Work Order:</strong> {workOrderSparePart.workOrder?.workOrderNumber || 'N/A'}</p>
          <p><strong>Spare Part:</strong> {workOrderSparePart.sparePart?.partName || 'N/A'} ({workOrderSparePart.sparePart?.partNumber || 'N/A'})</p>
          <p><strong>Kuantitas:</strong> {workOrderSparePart.quantity} {workOrderSparePart.sparePart?.unit || 'N/A'}</p>
          <p><strong>Harga Satuan:</strong> Rp{workOrderSparePart.unitPrice.toLocaleString('id-ID')}</p>
          <p><strong>Total Harga:</strong> Rp{workOrderSparePart.totalPrice.toLocaleString('id-ID')}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrderSparePart.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrderSparePart.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
