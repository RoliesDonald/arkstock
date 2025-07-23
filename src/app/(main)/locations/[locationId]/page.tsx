"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Location, RawLocationApiResponse } from "@/types/locations"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function LocationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const locationId = params.locationId as string;

  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchLocation = useCallback(async () => {
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
      const response = await api.get<RawLocationApiResponse>(`http://localhost:3000/api/locations/${locationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: Location = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
      };

      setLocation(formattedData);
      console.log("Data Lokasi yang diterima dari API (formatted):", formattedData);
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
  }, [locationId, getAuthToken, router, toast]);

  useEffect(() => {
    if (locationId) {
      fetchLocation();
    }
  }, [locationId, fetchLocation]);

  if (loading) return <div>Memuat detail lokasi...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!location) return <div>Lokasi tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Lokasi: {location.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nama Lokasi:</strong> {location.name}</p>
          <p><strong>Alamat:</strong> {location.address || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(location.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(location.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
