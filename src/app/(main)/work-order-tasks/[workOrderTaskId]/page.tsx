"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { WorkOrderTask, RawWorkOrderTaskApiResponse } from "@/types/workOrderTasks"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function WorkOrderTaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const workOrderTaskId = params.workOrderTaskId as string;

  const [workOrderTask, setWorkOrderTask] = useState<WorkOrderTask | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchWorkOrderTask = useCallback(async () => {
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
      const response = await api.get<RawWorkOrderTaskApiResponse>(`http://localhost:3000/api/work-order-tasks/${workOrderTaskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: WorkOrderTask = {
        ...response,
        startTime: response.startTime ? new Date(response.startTime) : null,
        endTime: response.endTime ? new Date(response.endTime) : null,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        workOrder: response.workOrder ? {
          id: response.workOrder.id,
          workOrderNumber: response.workOrder.workOrderNumber,
        } : undefined,
        assignedTo: response.assignedTo ? {
          id: response.assignedTo.id,
          name: response.assignedTo.name,
          position: response.assignedTo.position,
        } : undefined,
      };

      setWorkOrderTask(formattedData);
      console.log("Data Tugas Work Order yang diterima dari API (formatted):", formattedData);
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
  }, [workOrderTaskId, getAuthToken, router, toast]);

  useEffect(() => {
    if (workOrderTaskId) {
      fetchWorkOrderTask();
    }
  }, [workOrderTaskId, fetchWorkOrderTask]);

  if (loading) return <div>Memuat detail tugas work order...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!workOrderTask) return <div>Tugas Work Order tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Tugas Work Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Work Order:</strong> {workOrderTask.workOrder?.workOrderNumber || 'N/A'}</p>
          <p><strong>Nama Tugas:</strong> {workOrderTask.taskName}</p>
          <p><strong>Deskripsi:</strong> {workOrderTask.description || 'N/A'}</p>
          <p><strong>Status:</strong> {workOrderTask.status}</p>
          <p><strong>Ditugaskan Kepada:</strong> {workOrderTask.assignedTo?.name || 'N/A'} ({workOrderTask.assignedTo?.position || 'N/A'})</p>
          <p><strong>Waktu Mulai:</strong> {workOrderTask.startTime ? format(workOrderTask.startTime, "dd MMMM yyyy HH:mm", { locale: localeId }) : 'N/A'}</p>
          <p><strong>Waktu Selesai:</strong> {workOrderTask.endTime ? format(workOrderTask.endTime, "dd MMMM yyyy HH:mm", { locale: localeId }) : 'N/A'}</p>
          <p><strong>Catatan:</strong> {workOrderTask.description || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrderTask.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrderTask.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
