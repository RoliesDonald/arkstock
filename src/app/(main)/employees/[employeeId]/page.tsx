"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Employee, RawEmployeeApiResponse } from "@/types/employee"; 
import { EmployeeStatus, EmployeeRole, Gender } from "@prisma/client"; // <--- IMPORT GENDER DARI @PRISMA/CLIENT
import { Button } from "@/components/ui/button";

// ... sisa import lainnya

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const employeeId = params.employeeId as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchEmployee = useCallback(async () => {
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
      const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Sesi Habis",
            description: "Token tidak valid atau kadaluarsa. Silakan login kembali.",
            variant: "destructive",
          });
          router.push("/");
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengambil data karyawan.");
      }

      const rawData: RawEmployeeApiResponse = await response.json();
      const formattedData: Employee = {
        ...rawData,
        tanggalLahir: rawData.tanggalLahir ? new Date(rawData.tanggalLahir) : null,
        tanggalBergabung: rawData.tanggalBergabung ? new Date(rawData.tanggalBergabung) : null,
        createdAt: new Date(rawData.createdAt),
        updatedAt: new Date(rawData.updatedAt),
        role: rawData.role as EmployeeRole,
        status: rawData.status as EmployeeStatus,
        gender: rawData.gender as Gender, // Konversi string ke Gender Enum dari @prisma/client
      };

      setEmployee(formattedData);
      console.log("Data Karyawan yang diterima dari API (formatted):", formattedData);
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
  }, [employeeId, getAuthToken, router, toast]);

  useEffect(() => {
    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId, fetchEmployee]);

  if (loading) return <div>Memuat detail karyawan...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>Karyawan tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Karyawan: {employee.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>ID Karyawan:</strong> {employee.employeeId}</p>
          <p><strong>Nama:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email || 'N/A'}</p>
          <p><strong>Telepon:</strong> {employee.phone || 'N/A'}</p>
          <p><strong>Alamat:</strong> {employee.address || 'N/A'}</p>
          <p><strong>Posisi:</strong> {employee.position || 'N/A'}</p>
          <p><strong>Departemen:</strong> {employee.department || 'N/A'}</p>
          <p><strong>Role:</strong> {employee.role}</p>
          <p><strong>Status:</strong> {employee.status}</p>
          <p><strong>Jenis Kelamin:</strong> {employee.gender}</p> 
          <p><strong>Tanggal Lahir:</strong> {employee.tanggalLahir ? new Intl.DateTimeFormat("id-ID").format(employee.tanggalLahir) : 'N/A'}</p>
          <p><strong>Tanggal Bergabung:</strong> {employee.tanggalBergabung ? new Intl.DateTimeFormat("id-ID").format(employee.tanggalBergabung) : 'N/A'}</p>
          <p><strong>Perusahaan:</strong> {employee.company?.companyName || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(employee.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(employee.updatedAt)}</p>
        </div>
        <div>
          {employee.photo && (
            <div className="mb-4">
              <strong>Foto:</strong>
              <img src={employee.photo} alt="Foto Karyawan" className="mt-2 rounded-md max-w-xs" />
            </div>
          )}
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
