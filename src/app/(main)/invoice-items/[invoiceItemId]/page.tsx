"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { InvoiceItem, RawInvoiceItemApiResponse } from "@/types/invoiceItems"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function InvoiceItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const invoiceItemId = params.invoiceItemId as string;

  const [invoiceItem, setInvoiceItem] = useState<InvoiceItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchInvoiceItem = useCallback(async () => {
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
      const response = await api.get<RawInvoiceItemApiResponse>(`http://localhost:3000/api/invoice-items/${invoiceItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: InvoiceItem = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        invoice: response.invoice ? {
          id: response.invoice.id,
          invoiceNumber: response.invoice.invoiceNumber,
        } : undefined,
        sparePart: response.sparePart ? {
          id: response.sparePart.id,
          partNumber: response.sparePart.partNumber,
          partName: response.sparePart.partName,
          unit: response.sparePart.unit,
        } : undefined,
      };

      setInvoiceItem(formattedData);
      console.log("Data Item Invoice yang diterima dari API (formatted):", formattedData);
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
  }, [invoiceItemId, getAuthToken, router, toast]);

  useEffect(() => {
    if (invoiceItemId) {
      fetchInvoiceItem();
    }
  }, [invoiceItemId, fetchInvoiceItem]);

  if (loading) return <div>Memuat detail item invoice...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!invoiceItem) return <div>Item Invoice tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Item Invoice</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Invoice:</strong> {invoiceItem.invoice?.invoiceNumber || 'N/A'}</p>
          <p><strong>Spare Part:</strong> {invoiceItem.sparePart?.partName || 'N/A'} ({invoiceItem.sparePart?.partNumber || 'N/A'})</p>
          <p><strong>Kuantitas:</strong> {invoiceItem.quantity} {invoiceItem.sparePart?.unit || 'N/A'}</p>
          <p><strong>Harga Satuan:</strong> Rp{invoiceItem.unitPrice.toLocaleString('id-ID')}</p>
          <p><strong>Total Harga:</strong> Rp{invoiceItem.totalPrice.toLocaleString('id-ID')}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(invoiceItem.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(invoiceItem.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
