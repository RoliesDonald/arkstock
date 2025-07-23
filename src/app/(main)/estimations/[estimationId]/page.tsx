"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Estimation, RawEstimationApiResponse } from "@/types/estimation"; 
import { EstimationStatus } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function EstimationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const estimationId = params.estimationId as string;

  const [estimation, setEstimation] = useState<Estimation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchEstimation = useCallback(async () => {
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
      const response = await api.get<RawEstimationApiResponse>(`http://localhost:3000/api/estimations/${estimationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: Estimation = {
        ...response,
        estimationDate: new Date(response.estimationDate),
        finishedDate: response.finishedDate ? new Date(response.finishedDate) : null,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        status: response.status as EstimationStatus,
        workOrder: response.workOrder ? {
          id: response.workOrder.id,
          workOrderNumber: response.workOrder.workOrderNumber,
        } : undefined,
        vehicle: response.vehicle ? {
          id: response.vehicle.id,
          licensePlate: response.vehicle.licensePlate,
          vehicleMake: response.vehicle.vehicleMake,
          model: response.vehicle.model,
        } : undefined,
        mechanic: response.mechanic ? {
          id: response.mechanic.id,
          name: response.mechanic.name,
        } : undefined,
        accountant: response.accountant ? {
          id: response.accountant.id,
          name: response.accountant.name,
        } : undefined,
        approvedBy: response.approvedBy ? {
          id: response.approvedBy.id,
          name: response.approvedBy.name,
        } : undefined,
      };

      setEstimation(formattedData);
      console.log("Data Estimasi yang diterima dari API (formatted):", formattedData);
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
  }, [estimationId, getAuthToken, router, toast]);

  useEffect(() => {
    if (estimationId) {
      fetchEstimation();
    }
  }, [estimationId, fetchEstimation]);

  if (loading) return <div>Memuat detail Estimasi...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!estimation) return <div>Estimasi tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Estimasi: {estimation.estimationNumber}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nomor Estimasi:</strong> {estimation.estimationNumber}</p>
          <p><strong>Tanggal Estimasi:</strong> {format(estimation.estimationDate, "PPP", { locale: localeId })}</p>
          <p><strong>Odometer Permintaan:</strong> {estimation.requestOdo} km</p>
          <p><strong>Odometer Aktual:</strong> {estimation.actualOdo} km</p>
          <p><strong>Remark:</strong> {estimation.remark}</p>
          <p><strong>Catatan:</strong> {estimation.notes || 'N/A'}</p>
          <p><strong>Tanggal Selesai:</strong> {estimation.finishedDate ? format(estimation.finishedDate, "PPP", { locale: localeId }) : 'N/A'}</p>
          <p><strong>Total Estimasi Jumlah:</strong> Rp{estimation.totalEstimatedAmount.toLocaleString('id-ID')}</p>
          <p><strong>Status:</strong> {estimation.status.replace(/_/g, " ")}</p>
          <p><strong>Work Order:</strong> {estimation.workOrder?.workOrderNumber || 'N/A'}</p>
          <p><strong>Kendaraan:</strong> {estimation.vehicle?.licensePlate} ({estimation.vehicle?.vehicleMake} {estimation.vehicle?.model})</p>
          <p><strong>Mekanik:</strong> {estimation.mechanic?.name || 'N/A'}</p>
          <p><strong>Akuntan:</strong> {estimation.accountant?.name || 'N/A'}</p>
          <p><strong>Disetujui Oleh:</strong> {estimation.approvedBy?.name || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(estimation.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(estimation.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
