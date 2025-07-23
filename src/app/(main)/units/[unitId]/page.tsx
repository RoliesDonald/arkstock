"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Unit, RawUnitApiResponse } from "@/types/unit"; 
import { UnitType, UnitCategory } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function UnitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const unitId = params.unitId as string;

  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchUnit = useCallback(async () => {
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
      const response = await api.get<RawUnitApiResponse>(`http://localhost:3000/api/units/${unitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: Unit = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        unitType: response.unitType as UnitType,
        unitCategory: response.unitCategory as UnitCategory,
      };

      setUnit(formattedData);
      console.log("Data Unit yang diterima dari API (formatted):", formattedData);
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
  }, [unitId, getAuthToken, router, toast]);

  useEffect(() => {
    if (unitId) {
      fetchUnit();
    }
  }, [unitId, fetchUnit]);

  if (loading) return <div>Memuat detail unit...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!unit) return <div>Unit tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Unit: {unit.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nama Unit:</strong> {unit.name}</p>
          <p><strong>Simbol:</strong> {unit.symbol || 'N/A'}</p>
          <p><strong>Tipe Unit:</strong> {unit.unitType.replace(/_/g, " ")}</p>
          <p><strong>Kategori Unit:</strong> {unit.unitCategory.replace(/_/g, " ")}</p>
          <p><strong>Deskripsi:</strong> {unit.description || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(unit.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(unit.updatedAt)}</p>
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
