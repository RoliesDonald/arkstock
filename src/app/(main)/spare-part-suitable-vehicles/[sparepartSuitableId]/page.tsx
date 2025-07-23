"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Menggunakan useSearchParams
import { useToast } from "@/hooks/use-toast";
import { SparePartSuitableVehicle, RawSparePartSuitableVehicleApiResponse } from "@/types/sparePartSuitableVehicles"; 
import { api } from "@/lib/utils/api"; 
import { Button } from "@/components/ui/button";

export default function SparePartSuitableVehicleDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Menggunakan useSearchParams
  const { toast } = useToast();

  // Ambil komponen composite key dari query parameters
  const sparePartId = searchParams.get('sparePartId');
  const vehicleMake = searchParams.get('vehicleMake');
  const vehicleModel = searchParams.get('vehicleModel');

  const [srsv, setSrsv] = useState<SparePartSuitableVehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchSparePartSuitableVehicle = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      setError("Tidak ada token otentikasi. Silakan login kembali.");
      setLoading(false);
      router.push("/login"); 
      return;
    }

    // Pastikan semua komponen composite key tersedia
    if (!sparePartId || !vehicleMake || !vehicleModel) {
      setError("Parameter identifikasi kendaraan cocok tidak lengkap.");
      setLoading(false);
      return;
    }

    try {
      // Sesuaikan URL API untuk mengambil data berdasarkan composite key
      const url = `http://localhost:3000/api/spare-part-suitable-vehicles/${sparePartId}/${encodeURIComponent(vehicleMake)}/${encodeURIComponent(vehicleModel)}`;
      const response = await api.get<RawSparePartSuitableVehicleApiResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: SparePartSuitableVehicle = {
        ...response,
        sparePart: response.sparePart ? {
          id: response.sparePart.id,
          partNumber: response.sparePart.partNumber,
          partName: response.sparePart.partName,
          unit: response.sparePart.unit,
        } : undefined,
      };

      setSrsv(formattedData);
      console.log("Data Kendaraan yang Cocok yang diterima dari API (formatted):", formattedData);
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
  }, [sparePartId, vehicleMake, vehicleModel, getAuthToken, router, toast]);

  useEffect(() => {
    if (sparePartId && vehicleMake && vehicleModel) {
      fetchSparePartSuitableVehicle();
    } else if (!loading) {
      // Jika parameter tidak lengkap dan bukan sedang loading, set error
      setError("Parameter identifikasi kendaraan cocok tidak lengkap.");
    }
  }, [sparePartId, vehicleMake, vehicleModel, fetchSparePartSuitableVehicle, loading]);

  if (loading) return <div>Memuat detail kendaraan cocok...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!srsv) return <div>Data Kendaraan yang Cocok tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Kendaraan yang Cocok</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Spare Part:</strong> {srsv.sparePart?.partName || 'N/A'} ({srsv.sparePart?.partNumber || 'N/A'})</p>
          <p><strong>Merk Kendaraan:</strong> {srsv.vehicleMake}</p>
          <p><strong>Model Kendaraan:</strong> {srsv.vehicleModel}</p>
          <p><strong>Tingkat Trim:</strong> {srsv.trimLevel || 'N/A'}</p>
          <p><strong>Tahun Model:</strong> {srsv.modelYear || 'N/A'}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
