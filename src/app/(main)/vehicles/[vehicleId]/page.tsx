"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Vehicle, RawVehicleApiResponse } from "@/types/vehicle"; 
import {
  VehicleType,
  VehicleCategory,
  VehicleFuelType,
  VehicleTransmissionType,
  VehicleStatus,
} from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function VehicleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const vehicleId = params.vehicleId as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchVehicle = useCallback(async () => {
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
      const response = await api.get<RawVehicleApiResponse>(`http://localhost:3000/api/vehicles/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: Vehicle = {
        ...response,
        lastServiceDate: new Date(response.lastServiceDate),
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        vehicleType: response.vehicleType as VehicleType,
        vehicleCategory: response.vehicleCategory as VehicleCategory,
        fuelType: response.fuelType as VehicleFuelType,
        transmissionType: response.transmissionType as VehicleTransmissionType,
        status: response.status as VehicleStatus,
        owner: response.owner ? { id: response.owner.id, companyName: response.owner.companyName } : undefined,
        carUser: response.carUser ? { id: response.carUser.id, companyName: response.carUser.companyName } : undefined,
      };

      setVehicle(formattedData);
      console.log("Data Kendaraan yang diterima dari API (formatted):", formattedData);
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
  }, [vehicleId, getAuthToken, router, toast]);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId, fetchVehicle]);

  if (loading) return <div>Memuat detail kendaraan...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!vehicle) return <div>Kendaraan tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Kendaraan: {vehicle.licensePlate}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nomor Plat:</strong> {vehicle.licensePlate}</p>
          <p><strong>Merk:</strong> {vehicle.vehicleMake}</p>
          <p><strong>Model:</strong> {vehicle.model}</p>
          <p><strong>Level Trim:</strong> {vehicle.trimLevel || 'N/A'}</p>
          <p><strong>Nomor VIN:</strong> {vehicle.vinNum || 'N/A'}</p>
          <p><strong>Nomor Mesin:</strong> {vehicle.engineNum || 'N/A'}</p>
          <p><strong>Nomor Rangka:</strong> {vehicle.chassisNum || 'N/A'}</p>
          <p><strong>Tahun Pembuatan:</strong> {vehicle.yearMade}</p>
          <p><strong>Warna:</strong> {vehicle.color}</p>
          <p><strong>Tipe Kendaraan:</strong> {vehicle.vehicleType}</p>
          <p><strong>Kategori Kendaraan:</strong> {vehicle.vehicleCategory}</p>
          <p><strong>Tipe Bahan Bakar:</strong> {vehicle.fuelType}</p>
          <p><strong>Tipe Transmisi:</strong> {vehicle.transmissionType.replace(/_/g, " ")}</p>
          <p><strong>Odometer Terakhir:</strong> {vehicle.lastOdometer} km</p>
          <p><strong>Tanggal Servis Terakhir:</strong> {format(vehicle.lastServiceDate, "PPP", { locale: localeId })}</p>
          <p><strong>Status:</strong> {vehicle.status.replace(/_/g, " ")}</p>
          <p><strong>Catatan:</strong> {vehicle.notes || 'N/A'}</p>
          <p><strong>Pemilik:</strong> {vehicle.owner?.companyName || 'N/A'}</p>
          <p><strong>Pengguna:</strong> {vehicle.carUser?.companyName || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(vehicle.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(vehicle.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
