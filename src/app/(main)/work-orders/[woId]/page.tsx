"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { WorkOrder, RawWorkOrderApiResponse } from "@/types/workOrder"; 
import { WoProgresStatus, WoPriorityType } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function WorkOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const workOrderId = params.workOrderId as string;

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchWorkOrder = useCallback(async () => {
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
      const response = await api.get<RawWorkOrderApiResponse>(`http://localhost:3000/api/work-orders/${workOrderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: WorkOrder = {
        ...response,
        date: new Date(response.date),
        schedule: response.schedule ? new Date(response.schedule) : null,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        progresStatus: response.progresStatus as WoProgresStatus,
        priorityType: response.priorityType as WoPriorityType,
        vehicle: response.vehicle ? {
          id: response.vehicle.id,
          licensePlate: response.vehicle.licensePlate,
          vehicleMake: response.vehicle.vehicleMake,
          model: response.vehicle.model,
        } : undefined,
        customer: response.customer ? {
          id: response.customer.id,
          companyName: response.customer.companyName,
        } : undefined,
        carUser: response.carUser ? {
          id: response.carUser.id,
          companyName: response.carUser.companyName,
        } : undefined,
        vendor: response.vendor ? {
          id: response.vendor.id,
          companyName: response.vendor.companyName,
        } : undefined,
        mechanic: response.mechanic ? {
          id: response.mechanic.id,
          name: response.mechanic.name,
        } : undefined,
        driver: response.driver ? {
          id: response.driver.id,
          name: response.driver.name,
        } : undefined,
        approvedBy: response.approvedBy ? {
          id: response.approvedBy.id,
          name: response.approvedBy.name,
        } : undefined,
        requestedBy: response.requestedBy ? {
          id: response.requestedBy.id,
          name: response.requestedBy.name,
        } : undefined,
        location: response.location ? {
          id: response.location.id,
          name: response.location.name,
        } : undefined,
      };

      setWorkOrder(formattedData);
      console.log("Data Work Order yang diterima dari API (formatted):", formattedData);
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
  }, [workOrderId, getAuthToken, router, toast]);

  useEffect(() => {
    if (workOrderId) {
      fetchWorkOrder();
    }
  }, [workOrderId, fetchWorkOrder]);

  if (loading) return <div>Memuat detail Work Order...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!workOrder) return <div>Work Order tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Work Order: {workOrder.workOrderNumber}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nomor WO:</strong> {workOrder.workOrderNumber}</p>
          <p><strong>Master WO:</strong> {workOrder.workOrderMaster}</p>
          <p><strong>Tanggal WO:</strong> {format(workOrder.date, "PPP", { locale: localeId })}</p>
          <p><strong>Odometer Terselesaikan:</strong> {workOrder.settledOdo || 'N/A'} km</p>
          <p><strong>Remark:</strong> {workOrder.remark}</p>
          <p><strong>Jadwal:</strong> {workOrder.schedule ? format(workOrder.schedule, "PPP", { locale: localeId }) : 'N/A'}</p>
          <p><strong>Lokasi Servis:</strong> {workOrder.serviceLocation}</p>
          <p><strong>Catatan:</strong> {workOrder.notes || 'N/A'}</p>
          <p><strong>Merk Kendaraan (Manual):</strong> {workOrder.vehicleMake}</p>
          <p><strong>Status Progres:</strong> {workOrder.progresStatus.replace(/_/g, " ")}</p>
          <p><strong>Tipe Prioritas:</strong> {workOrder.priorityType}</p>
          <p><strong>Kendaraan:</strong> {workOrder.vehicle?.licensePlate} ({workOrder.vehicle?.vehicleMake} {workOrder.vehicle?.model})</p>
          <p><strong>Customer:</strong> {workOrder.customer?.companyName}</p>
          <p><strong>Pengguna Kendaraan:</strong> {workOrder.carUser?.companyName}</p>
          <p><strong>Vendor:</strong> {workOrder.vendor?.companyName}</p>
          <p><strong>Mekanik:</strong> {workOrder.mechanic?.name || 'N/A'}</p>
          <p><strong>Driver:</strong> {workOrder.driver?.name || 'N/A'}</p>
          <p><strong>Kontak Driver:</strong> {workOrder.driverContact || 'N/A'}</p>
          <p><strong>Disetujui Oleh:</strong> {workOrder.approvedBy?.name || 'N/A'}</p>
          <p><strong>Diminta Oleh:</strong> {workOrder.requestedBy?.name || 'N/A'}</p>
          <p><strong>Lokasi:</strong> {workOrder.location?.name || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrder.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrder.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
