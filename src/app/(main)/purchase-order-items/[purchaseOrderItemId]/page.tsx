"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PurchaseOrderItem, RawPurchaseOrderItemApiResponse } from "@/types/purchaseOrderItems"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function PurchaseOrderItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const purchaseOrderItemId = params.purchaseOrderItemId as string;

  const [purchaseOrderItem, setPurchaseOrderItem] = useState<PurchaseOrderItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchPurchaseOrderItem = useCallback(async () => {
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
      const response = await api.get<RawPurchaseOrderItemApiResponse>(`http://localhost:3000/api/purchase-order-items/${purchaseOrderItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: PurchaseOrderItem = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        purchaseOrder: response.purchaseOrder ? {
          id: response.purchaseOrder.id,
          poNumber: response.purchaseOrder.poNumber,
        } : undefined,
        sparePart: response.sparePart ? {
          id: response.sparePart.id,
          partNumber: response.sparePart.partNumber,
          partName: response.sparePart.partName,
          unit: response.sparePart.unit,
        } : undefined,
      };

      setPurchaseOrderItem(formattedData);
      console.log("Data Item Purchase Order yang diterima dari API (formatted):", formattedData);
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
  }, [purchaseOrderItemId, getAuthToken, router, toast]);

  useEffect(() => {
    if (purchaseOrderItemId) {
      fetchPurchaseOrderItem();
    }
  }, [purchaseOrderItemId, fetchPurchaseOrderItem]);

  if (loading) return <div>Memuat detail item purchase order...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!purchaseOrderItem) return <div>Item Purchase Order tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Item Purchase Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Purchase Order:</strong> {purchaseOrderItem.purchaseOrder?.poNumber || 'N/A'}</p>
          <p><strong>Spare Part:</strong> {purchaseOrderItem.sparePart?.partName || 'N/A'} ({purchaseOrderItem.sparePart?.partNumber || 'N/A'})</p>
          <p><strong>Kuantitas:</strong> {purchaseOrderItem.quantity} {purchaseOrderItem.sparePart?.unit || 'N/A'}</p>
          <p><strong>Harga Satuan:</strong> Rp{purchaseOrderItem.unitPrice.toLocaleString('id-ID')}</p>
          <p><strong>Total Harga:</strong> Rp{purchaseOrderItem.totalPrice.toLocaleString('id-ID')}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(purchaseOrderItem.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(purchaseOrderItem.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
