// src/components/dialog/companyDialog/_components/CompanyDialogWrapper.tsx
"use client";

import { Company } from "@/types/companies"; // Import Company type
import { CompanyFormValues } from "@/schemas/company"; // Import CompanyFormValues
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { fetchCompanies } from "@/store/slices/companySlice"; // Import fetchCompanies dari slice
import CompanyDialog from "./CompanyDialog"; // Import CompanyDialog

interface CompanyDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: CompanyFormValues) => Promise<void>;
  initialData?: Company;
}

export default function CompanyDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: CompanyDialogWrapperProps) {
  const dispatch = useAppDispatch();
  const allCompanies = useAppSelector((state) => state.companies.companies);
  const companyStatus = useAppSelector((state) => state.companies.status);

  useEffect(() => {
    // Fetch companies jika belum dimuat atau gagal
    if (companyStatus === 'idle' || companyStatus === 'failed') {
      dispatch(fetchCompanies());
    }
  }, [dispatch, companyStatus]);

  return (
    <CompanyDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      allCompanies={allCompanies} // Teruskan daftar perusahaan
      companyStatus={companyStatus} // Teruskan status loading perusahaan
    />
  );
}
