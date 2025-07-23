"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { WorkOrderImage, RawWorkOrderImageApiResponse } from "@/types/workOrderImages"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // Import Image component

export default function WorkOrderImageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const workOrderImageId = params.workOrderImageId as string;

  const [workOrderImage, setWorkOrderImage] = useState<WorkOrderImage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchWorkOrderImage = useCallback(async () => {
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
      const response = await api.get<RawWorkOrderImageApiResponse>(`http://localhost:3000/api/work-order-images/${workOrderImageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: WorkOrderImage = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        workOrder: response.workOrder ? {
          id: response.workOrder.id,
          workOrderNumber: response.workOrder.workOrderNumber,
        } : undefined,
      };

      setWorkOrderImage(formattedData);
      console.log("Data Gambar Work Order yang diterima dari API (formatted):", formattedData);
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
  }, [workOrderImageId, getAuthToken, router, toast]);

  useEffect(() => {
    if (workOrderImageId) {
      fetchWorkOrderImage();
    }
  }, [workOrderImageId, fetchWorkOrderImage]);

  if (loading) return <div>Memuat detail gambar work order...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!workOrderImage) return <div>Gambar Work Order tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Gambar Work Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Work Order:</strong> {workOrderImage.workOrder?.workOrderNumber || 'N/A'}</p>
          <p><strong>Deskripsi:</strong> {workOrderImage.description || 'N/A'}</p>
          <p><strong>Diunggah Oleh:</strong> {workOrderImage.uploadedBy || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrderImage.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(workOrderImage.updatedAt)}</p>
          
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Pratinjau Gambar</h2>
            <div className="w-full max-w-md h-auto relative overflow-hidden rounded-md border border-gray-200">
              <Image 
                src={workOrderImage.imageUrl} 
                alt={workOrderImage.description || "Work Order Image"} 
                width={500} // Set a default width for the image
                height={300} // Set a default height for the image
                layout="responsive" // Make image responsive within its container
                objectFit="contain" // Ensure the whole image is visible
                className="rounded-md"
                onError={(e) => { e.currentTarget.src = "https://placehold.co/500x300/e0e0e0/000000?text=No+Image"; }} // Placeholder on error
              />
            </div>
          </div>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
