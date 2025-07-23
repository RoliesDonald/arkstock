"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { WorkOrderItem, RawWorkOrderItemApiResponse } from "@/types/workOrderItems"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function WorkOrderItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const workOrderItemId = params.workOrderItemId as string;

  const [workOrderItem, setWorkOrderItem] = useState<WorkOrderItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchWorkOrderItem = useCallback(async () => {
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
      const response = await api.get<RawWorkOrderItemApiResponse>(`http://localhost:3000/api/work-order-items/${workOrderItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: WorkOrderItem = {
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

      setWorkOrderItem(formattedData);
      console.log("Data Item Work Order yang diterima dari API (formatted):", formattedData);
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
  }, [workOrderItemId, getAuthToken, router, toast]);

  useEffect(() => {
    if (workOrderItemId) {
      fetchWorkOrderItem();
    }
  }, [workOrderItemId, fetchWorkOrderItem]);

  if (loading) return <div>Memuat detail item work order...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!workOrderItem) return <div>Item Work Order tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Item Work Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Work Order:</strong> {workOrderItem.workOrder?.workOrderNumber || 'N/A'}</p>
          <p><strong>Spare Part:</strong> {workOrderItem.sparePart?.partName || 'N/A'} ({workOrderItem.sparePart?.partNumber || 'N/A'})</p>
          <p><strong>Kuantitas:</strong> {workOrderItem.quantity} {workOrderItem.sparePart?.unit || 'N/A'}</p>
          <p><strong>Harga Satuan:</strong> Rp{workOrderItem.unitPrice.toLocaleString('id-ID')}</p>
          <p><strong>Total Harga:</strong> Rp{workOrderItem.totalPrice.toLocaleString('id-ID')}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrderItem.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrderItem.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
