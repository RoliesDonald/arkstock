"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Service, RawServiceApiResponse } from "@/types/services"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const serviceId = params.serviceId as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchService = useCallback(async () => {
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
      const response = await api.get<RawServiceApiResponse>(`http://localhost:3000/api/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: Service = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };

      setService(formattedData);
      console.log("Data Jasa yang diterima dari API (formatted):", formattedData);
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
  }, [serviceId, getAuthToken, router, toast]);

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId, fetchService]);

  if (loading) return <div>Memuat detail jasa...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!service) return <div>Jasa tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Jasa: {service.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nama Jasa:</strong> {service.name}</p>
          <p><strong>Harga:</strong> Rp{service.price.toLocaleString('id-ID')}</p>
          <p><strong>Kategori:</strong> {service.category || 'N/A'}</p>
          <p><strong>Sub Kategori:</strong> {service.subCategory || 'N/A'}</p>
          <p><strong>Deskripsi:</strong> {service.description || 'N/A'}</p>
          <p><strong>Tugas-tugas:</strong> {service.tasks && service.tasks.length > 0 ? service.tasks.join(', ') : 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(service.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(service.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
