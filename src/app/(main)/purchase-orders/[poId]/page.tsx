"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PurchaseOrder, RawPurchaseOrderApiResponse } from "@/types/purchaseOrder"; 
import { PurchaseOrderStatus } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function PurchaseOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const purchaseOrderId = params.purchaseOrderId as string;

  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchPurchaseOrder = useCallback(async () => {
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
      const response = await api.get<RawPurchaseOrderApiResponse>(`http://localhost:3000/api/purchase-orders/${purchaseOrderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: PurchaseOrder = {
        ...response,
        poDate: new Date(response.poDate),
        deliveryDate: response.deliveryDate ? new Date(response.deliveryDate) : null,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        status: response.status as PurchaseOrderStatus,
        supplier: response.supplier ? {
          id: response.supplier.id,
          companyName: response.supplier.companyName,
        } : undefined,
        requestedBy: response.requestedBy ? {
          id: response.requestedBy.id,
          name: response.requestedBy.name,
        } : undefined,
        approvedBy: response.approvedBy ? {
          id: response.approvedBy.id,
          name: response.approvedBy.name,
        } : undefined,
      };

      setPurchaseOrder(formattedData);
      console.log("Data Purchase Order yang diterima dari API (formatted):", formattedData);
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
  }, [purchaseOrderId, getAuthToken, router, toast]);

  useEffect(() => {
    if (purchaseOrderId) {
      fetchPurchaseOrder();
    }
  }, [purchaseOrderId, fetchPurchaseOrder]);

  if (loading) return <div>Memuat detail Purchase Order...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!purchaseOrder) return <div>Purchase Order tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Purchase Order: {purchaseOrder.poNumber}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nomor PO:</strong> {purchaseOrder.poNumber}</p>
          <p><strong>Tanggal PO:</strong> {format(purchaseOrder.poDate, "PPP", { locale: localeId })}</p>
          <p><strong>Supplier:</strong> {purchaseOrder.supplier?.companyName || 'N/A'}</p>
          <p><strong>Alamat Pengiriman:</strong> {purchaseOrder.deliveryAddress || 'N/A'}</p>
          <p><strong>Subtotal:</strong> Rp{purchaseOrder.subtotal.toLocaleString('id-ID')}</p>
          <p><strong>Pajak:</strong> Rp{purchaseOrder.tax.toLocaleString('id-ID')}</p>
          <p><strong>Jumlah Total:</strong> Rp{purchaseOrder.totalAmount.toLocaleString('id-ID')}</p>
          <p><strong>Tanggal Pengiriman:</strong> {purchaseOrder.deliveryDate ? format(purchaseOrder.deliveryDate, "PPP", { locale: localeId }) : 'N/A'}</p>
          <p><strong>Status:</strong> {purchaseOrder.status.replace(/_/g, " ")}</p>
          <p><strong>Diminta Oleh:</strong> {purchaseOrder.requestedBy?.name || 'N/A'}</p>
          <p><strong>Disetujui Oleh:</strong> {purchaseOrder.approvedBy?.name || 'N/A'}</p>
          <p><strong>Remark:</strong> {purchaseOrder.remark || 'N/A'}</p>
          <p><strong>Alasan Penolakan:</strong> {purchaseOrder.rejectionReason || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(purchaseOrder.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(purchaseOrder.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
