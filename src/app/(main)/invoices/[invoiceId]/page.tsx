"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Invoice, RawInvoiceApiResponse } from "@/types/invoice";
import { api } from "@/lib/utils/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const invoiceId = params.invoiceId as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchInvoice = useCallback(async () => {
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
      const response = await api.get<RawInvoiceApiResponse>(`http://localhost:3000/api/invoices/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: Invoice = {
        ...response,
        invoiceDate: new Date(response.invoiceDate),
        finishedDate: new Date(response.finishedDate),
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        workOrder: response.workOrder ? {
          id: response.workOrder.id,
          workOrderNumber: response.workOrder.workOrderNumber,
          // Tambahkan properti lain dari WorkOrder jika diperlukan
        } : undefined,
        vehicle: response.vehicle ? {
          id: response.vehicle.id,
          licensePlate: response.vehicle.licensePlate,
          vehicleMake: response.vehicle.vehicleMake,
          model: response.vehicle.model,
        } : undefined,
        accountant: response.accountant ? {
          id: response.accountant.id,
          name: response.accountant.name,
          position: response.accountant.position,
        } : undefined,
        approvedBy: response.approvedBy ? {
          id: response.approvedBy.id,
          name: response.approvedBy.name,
          position: response.approvedBy.position,
        } : undefined,
      };

      setInvoice(formattedData);
      console.log("Data Invoice yang diterima dari API (formatted):", formattedData);
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
  }, [invoiceId, getAuthToken, router, toast]);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId, fetchInvoice]);

  if (loading) return <div>Memuat detail invoice...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!invoice) return <div>Invoice tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Invoice</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nomor Invoice:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Tanggal Invoice:</strong> {format(invoice.invoiceDate, "dd MMMM yyyy HH:mm", { locale: localeId })}</p>
          {invoice.workOrder && (
            <p>
              <strong>Work Order:</strong>{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto align-baseline" 
                onClick={() => router.push(`/work-orders/${invoice.workOrder?.id}`)}
              >
                {invoice.workOrder.workOrderNumber}
              </Button>
            </p>
          )}
          <p><strong>Kendaraan:</strong> {invoice.vehicle?.licensePlate || 'N/A'} ({invoice.vehicle?.vehicleMake} {invoice.vehicle?.model})</p>
          <p><strong>Odometer Permintaan:</strong> {invoice.requestOdo}</p>
          <p><strong>Odometer Aktual:</strong> {invoice.actualOdo}</p>
          <p><strong>Tanggal Selesai:</strong> {format(invoice.finishedDate, "dd MMMM yyyy HH:mm", { locale: localeId })}</p>
          <p><strong>Jumlah Total:</strong> Rp{invoice.totalAmount.toLocaleString('id-ID')}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          <p><strong>Akuntan:</strong> {invoice.accountant?.name || 'N/A'}</p>
          <p><strong>Disetujui Oleh:</strong> {invoice.approvedBy?.name || 'N/A'}</p>
          <p><strong>Catatan:</strong> {invoice.remark || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(invoice.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(invoice.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
