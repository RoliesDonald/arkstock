"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCompanyById, updateCompany } from "@/store/slices/companySlice"; // Import fetchCompanyById
import {
  Company,
  CompanyFormValues,
  CompanyStatus,
  CompanyType,
} from "@/types/companies";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import CompanyDialog from "@/components/dialog/companyDialog/_component/CompanyDialog";
import { useToast } from "@/hooks/use-toast"; // Import useToast

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  console.log("CompanyDetailPage: useParams() result:", params);
  console.log("CompanyDetailPage: Extracted companyId", companyId);

  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const allCompanies = useAppSelector((state) => state.companies.companies);
  const companyStatus = useAppSelector((state) => state.companies.status);
  const companyError = useAppSelector((state) => state.companies.error);

  const [isCompanyDialogOpen, setIsCompanyDialogOpen] =
    useState<boolean>(false);
  const [editCompanyData, setEditCompanyData] = useState<Company | undefined>(
    undefined
  );
  const [localCompany, setLocalCompany] = useState<Company | undefined>(
    undefined
  ); // State lokal untuk perusahaan ini

  // Cari perusahaan di Redux store
  const companyFromStore = allCompanies.find((comp) => comp.id === companyId);

  useEffect(() => {
    if (companyFromStore) {
      setLocalCompany(companyFromStore); // Jika ada di store, gunakan itu
    } else if (companyId && companyStatus !== "loading") {
      // Jika tidak ada di store DAN bukan sedang loading, fetch dari API
      dispatch(fetchCompanyById(companyId))
        .unwrap() // Unwrap the promise to handle success/failure directly
        .then((company) => {
          setLocalCompany(company);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Gagal memuat detail perusahaan.",
            variant: "destructive",
          });
        });
    } else if (!companyId) {
      toast({
        title: "Error",
        description: "ID perusahaan tidak ditemukan.",
        variant: "destructive",
      });
      console.log("CompanyDetailPage: companyId tidak ditemukan.");
    }
  }, [companyId, companyFromStore, dispatch, companyStatus, toast]);

  const handleEditClick = useCallback(() => {
    if (localCompany) {
      // Gunakan localCompany
      setEditCompanyData(localCompany);
      setIsCompanyDialogOpen(true);
    }
  }, [localCompany]);

  const handleSaveCompany = useCallback(
    async (values: CompanyFormValues) => {
      if (values.id) {
        try {
          // Dispatch updateCompany, dan tunggu hasilnya
          await dispatch(updateCompany(values)).unwrap();
          toast({
            title: "Sukses",
            description: "Perusahaan berhasil diperbarui.",
          });
          dispatch(fetchCompanyById(values.id));
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Gagal memperbarui perusahaan.",
            variant: "destructive",
          });
        }
      }
      setIsCompanyDialogOpen(false);
      setEditCompanyData(undefined);
    },
    [dispatch, toast]
  );

  const handleDialogClose = useCallback(() => {
    setIsCompanyDialogOpen(false);
    setEditCompanyData(undefined);
  }, []);

  // Kondisi loading dan error
  if (companyStatus === "loading" && !localCompany) {
    // Tampilkan loading hanya jika belum ada data lokal
    return (
      <div className="flex justify-center items-center h-full">
        <p className=" text-arkBg-400">Memuat detail perusahaan...</p>
      </div>
    );
  }

  if (companyStatus === "failed" && !localCompany) {
    // Tampilkan error hanya jika belum ada data lokal
    return (
      <div className="flex justify-center items-center h-full">
        <p className=" text-arkRed-500">Error: {companyError}</p>
      </div>
    );
  }

  // Jika tidak ada perusahaan ditemukan setelah loading selesai
  if (!localCompany) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className=" text-arkBg-600">Perusahaan tidak ditemukan.</p>
      </div>
    );
  }

  // Gunakan localCompany untuk menampilkan data
  const displayCompany = localCompany;

  return (
    <div className="container mx-auto py-8 space-y-3 ">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {displayCompany.companyName}
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
              <p>: {displayCompany.companyId}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Type Perusahaan</p>
              <p>
                :
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {displayCompany.companyType.replace(/_/g, " ")}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Kontak Utama</p>
              <p>: {displayCompany.contact || "N/A"}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Email Perusahaan</p>
              <p>: {displayCompany.companyEmail || "N/A"}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Status Perusahaan</p>
              <p>
                :
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold
                ${
                  displayCompany.status === CompanyStatus.ACTIVE
                    ? "bg-green-100 text-green-800"
                    : displayCompany.status === CompanyStatus.INACTIVE
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
                >
                  {displayCompany.status?.replace(/_/g, " ")}
                </span>
              </p>
            </div>
          </div>
          {/* Kolom Kanan - Alamat, Tanggal (dengan border) */}
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Alamat</p>
              <p>: {displayCompany.address || "N/A"}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Kota</p>
              <p>: {displayCompany.city || "N/A"}</p>
            </div>

            {/* Perhatikan: field 'phone' tidak ada di model Company Prisma Anda,
                 gunakan 'contact' sebagai nomor telepon */}
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Telepon</p>
              <p>: {displayCompany.contact || "N/A"}</p>{" "}
              {/* Menggunakan contact */}
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Terdaftar Pajak?</p>
              <p>: {displayCompany.taxRegistered ? "Ya" : "Tidak"}</p>
            </div>

            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Dibuat Pada</p>
              <p>
                :
                {format(
                  new Date(displayCompany.createdAt),
                  "dd MMMM yyyy HH:mm",
                  { locale: localeId }
                )}
              </p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Di Update pada</p>
              <p>
                :
                {format(
                  new Date(displayCompany.updatedAt),
                  "dd MMMM yyyy HH:mm",
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
              onClose={handleDialogClose}
              initialData={editCompanyData}
              onSubmit={handleSaveCompany}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
