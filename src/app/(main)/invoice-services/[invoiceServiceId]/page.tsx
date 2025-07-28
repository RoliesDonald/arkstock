"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { InvoiceService, RawInvoiceServiceApiResponse } from "@/types/invoiceServices"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function InvoiceServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const invoiceServiceId = params.invoiceServiceId as string;

  const [invoiceService, setInvoiceService] = useState<InvoiceService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchInvoiceService = useCallback(async () => {
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
      const response = await api.get<RawInvoiceServiceApiResponse>(`http://localhost:3000/api/invoice-services/${invoiceServiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: InvoiceService = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        invoice: response.invoice ? {
          id: response.invoice.id,
          invoiceNumber: response.invoice.invoiceNumber,
        } : undefined,
        service: response.service ? {
          id: response.service.id,
          name: response.service.name,
          price: response.service.price,
        } : undefined,
      };

      setInvoiceService(formattedData);
      console.log("Data Jasa Invoice yang diterima dari API (formatted):", formattedData);
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
  }, [invoiceServiceId, getAuthToken, router, toast]);

  useEffect(() => {
    if (invoiceServiceId) {
      fetchInvoiceService();
    }
  }, [invoiceServiceId, fetchInvoiceService]);

  if (loading) return <div>Memuat detail jasa invoice...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!invoiceService) return <div>Jasa Invoice tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Jasa Invoice</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Invoice:</strong> {invoiceService.invoice?.invoiceNumber || 'N/A'}</p>
          <p><strong>Jasa:</strong> {invoiceService.service?.name || 'N/A'}</p>
          <p><strong>Kuantitas:</strong> {invoiceService.quantity}</p>
          <p><strong>Harga Satuan:</strong> Rp{invoiceService.unitPrice.toLocaleString('id-ID')}</p>
          <p><strong>Total Harga:</strong> Rp{invoiceService.totalPrice.toLocaleString('id-ID')}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(invoiceService.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(invoiceService.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
