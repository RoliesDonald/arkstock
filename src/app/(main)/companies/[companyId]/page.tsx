"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Company, RawCompanyApiResponse } from "@/types/companies"; 
import { CompanyType, CompanyStatus, CompanyRole } from "@prisma/client"; 
import { api } from "@/lib/utils/api"; 
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const companyId = params.companyId as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }, []);

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      setError("Tidak ada token otentikasi. Silakan login kembali.");
      setLoading(false);
      router.push("/login"); // Sesuaikan dengan halaman login Anda
      return;
    }

    try {
      const response = await api.get<RawCompanyApiResponse>(`http://localhost:3000/api/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData: Company = {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        companyType: response.companyType as CompanyType,
        status: response.status as CompanyStatus,
        companyRole: response.companyRole as CompanyRole,
        // Jika parentCompany disertakan dalam respons API, pastikan tipenya sesuai
        parentCompany: response.parentCompany ? {
          id: response.parentCompany.id,
          companyName: response.parentCompany.companyName,
        } : undefined,
      };

      setCompany(formattedData);
      console.log("Data Perusahaan yang diterima dari API (formatted):", formattedData);
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
  }, [companyId, getAuthToken, router, toast]);

  useEffect(() => {
    if (companyId) {
      fetchCompany();
    }
  }, [companyId, fetchCompany]);

  if (loading) return <div>Memuat detail perusahaan...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!company) return <div>Perusahaan tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail Perusahaan: {company.companyName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>ID Perusahaan:</strong> {company.companyId}</p>
          <p><strong>Nama Perusahaan:</strong> {company.companyName}</p>
          <p><strong>Email:</strong> {company.companyEmail || 'N/A'}</p>
          <p><strong>Kontak:</strong> {company.contact || 'N/A'}</p>
          <p><strong>Alamat:</strong> {company.address || 'N/A'}</p>
          <p><strong>Kota:</strong> {company.city || 'N/A'}</p>
          <p><strong>Terdaftar Pajak (PPN):</strong> {company.taxRegistered ? 'Ya' : 'Tidak'}</p>
          <p><strong>Tipe Perusahaan:</strong> {company.companyType}</p>
          <p><strong>Status:</strong> {company.status}</p>
          <p><strong>Role Perusahaan:</strong> {company.companyRole.replace(/_/g, " ")}</p>
          <p><strong>Perusahaan Induk:</strong> {company.parentCompany?.companyName || 'N/A'}</p>
          <p><strong>Dibuat Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(company.createdAt)}</p>
          <p><strong>Diperbarui Pada:</strong> {new Intl.DateTimeFormat("id-ID").format(company.updatedAt)}</p>
        </div>
        <div>
          {company.logo && (
            <div className="mb-4">
              <strong>Logo:</strong>
              <Image src={company.logo} alt="Logo Perusahaan" className="mt-2 rounded-md max-w-xs" />
            </div>
          )}
        </div>
      </div>
      <Button onClick={() => router.back()} className="mt-4">Kembali</Button>
    </div>
  );
}
