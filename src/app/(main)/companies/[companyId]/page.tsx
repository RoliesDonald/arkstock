"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCompanies, updateCompany } from "@/store/slices/companySlice";
import {
  Company,
  CompanyFormValues,
  CompanyStatus,
  CompanyType,
} from "@/types/companies"; // Import semua tipe yang diperlukan
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale"; // Menggunakan alias untuk menghindari konflik
import CompanyDialog from "@/components/dialog/companyDialog/_component/CompanyDialog"; // Import CompanyDialog Anda

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const dispatch = useAppDispatch();

  // Ambil data perusahaan dan status dari Redux store
  const allCompanies = useAppSelector((state) => state.companies.companies);
  const companyStatus = useAppSelector((state) => state.companies.status);
  const companyError = useAppSelector((state) => state.companies.error);

  const [isCompanyDialogOpen, setIsCompanyDialogOpen] =
    useState<boolean>(false);
  const [editCompanyData, setEditCompanyData] = useState<Company | undefined>(
    undefined
  );

  // Cari perusahaan yang cocok dengan ID dari URL
  const currentCompany = allCompanies.find((comp) => comp.id === companyId);

  // Dispatch fetchCompanies saat komponen dimuat atau jika status idle
  useEffect(() => {
    if (companyStatus === "idle") {
      dispatch(fetchCompanies());
    }
  }, [dispatch, companyStatus]);

  const handleEditClick = useCallback(() => {
    if (currentCompany) {
      setEditCompanyData(currentCompany);
      setIsCompanyDialogOpen(true);
    }
  }, [currentCompany]);

  const handleSaveCompany = useCallback(
    async (values: CompanyFormValues) => {
      if (values.id) {
        // Pastikan ada ID untuk operasi update
        const existingCompany = allCompanies.find((c) => c.id === values.id);
        if (existingCompany) {
          const fullUpdatedCompany: Company = {
            ...existingCompany,
            ...values, // Timpa nilai yang ada dengan nilai dari form
            updatedAt: new Date().toISOString(), // Pastikan updatedAt diupdate sebagai string ISO
          };
          await dispatch(updateCompany(fullUpdatedCompany));
        }
      }
      setIsCompanyDialogOpen(false);
      setEditCompanyData(undefined); // Clear edit data
    },
    [dispatch, allCompanies]
  );

  const handleDialogClose = useCallback(() => {
    setIsCompanyDialogOpen(false);
    setEditCompanyData(undefined);
  }, []);

  if (companyStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Memuat detail perusahaan...</p>
      </div>
    );
  }

  if (companyStatus === "failed") {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-red-500">Error: {companyError}</p>
      </div>
    );
  }

  // Penting: Pastikan currentCompany tidak undefined sebelum melanjutkan render detail
  // Jika currentCompany undefined, kita sudah return pesan "Perusahaan tidak ditemukan." di atas
  if (!currentCompany) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Perusahaan tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-3 ">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {currentCompany.companyName}
            </CardTitle>
            <CardDescription className="text-arkBg-600">
              Detail Lengkap Perusahaan
            </CardDescription>
          </div>
          <Button onClick={handleEditClick}>Edit Perusahaan</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
          {/* Kolom Kiri - Informasi Perusahaan (dengan border) */}
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">ID Perusahaan</p>
              <p>: {currentCompany.companyId}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Type Perusahaan</p>
              <p>
                :
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {currentCompany.companyType.replace(/_/g, " ")}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Kontak Utama</p>
              <p>: {currentCompany.contact || "N/A"}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Email Perusahaan</p>
              <p>: {currentCompany.companyEmail || "N/A"}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Status Perusahaan</p>
              <p>
                :
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold 
                ${
                  currentCompany.status === CompanyStatus.ACTIVE
                    ? "bg-green-100 text-green-800"
                    : currentCompany.status === CompanyStatus.INACTIVE
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                >
                  {currentCompany.status?.replace(/_/g, " ")}
                </span>
              </p>
            </div>
          </div>
          {/* Kolom Kanan - Alamat, Tanggal (dengan border) */}
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Alamat</p>
              <p>: {currentCompany.address || "N/A"}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Kota</p>
              <p>: {currentCompany.city || "N/A"}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Telepon</p>
              <p>: {currentCompany.phone || "N/A"}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Terdaftar Pajak?</p>
              <p>: {currentCompany.taxRegistered ? "Ya" : "Tidak"}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Dibuat Pada</p>
              <p>
                :
                {format(
                  new Date(currentCompany.createdAt),
                  "dd MMMM yyyy HH:mm", // Format disesuaikan dengan gambar
                  { locale: localeId }
                )}
              </p>
            </div>
            {/* Di Update pada */}
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Di Update pada</p>
              <p>
                :
                {format(
                  new Date(currentCompany.updatedAt),
                  "dd MMMM yyyy HH:mm", // Format disesuaikan dengan gambar
                  { locale: localeId }
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="py-4 border-0 shadow-none">
        <CardContent>
          {isCompanyDialogOpen && (
            <CompanyDialog
              onSubmit={handleSaveCompany}
              onClose={handleDialogClose}
              initialData={editCompanyData}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
