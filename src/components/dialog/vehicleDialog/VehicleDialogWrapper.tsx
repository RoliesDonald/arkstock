// src/components/dialog/vehicleDialog/_components/VehicleDialogWrapper.tsx
"use client";

import { Vehicle } from "@/types/vehicle";
import { VehicleFormValues } from "@/schemas/vehicle";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { fetchCompanies } from "@/store/slices/companySlice"; // Import fetchCompanies untuk dropdown
import VehicleDialog from "./VehicleDialog";

interface VehicleDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  initialData?: Vehicle;
}

export default function VehicleDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: VehicleDialogWrapperProps) {
  const dispatch = useAppDispatch();
  const allCompanies = useAppSelector((state) => state.companies.companies);
  const companiesStatus = useAppSelector((state) => state.companies.status);

  useEffect(() => {
    // Fetch companies jika belum dimuat atau gagal
    if (companiesStatus === 'idle' || companiesStatus === 'failed') {
      dispatch(fetchCompanies());
    }
  }, [dispatch, companiesStatus]);

  return (
    <VehicleDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      allCompanies={allCompanies} // Teruskan daftar perusahaan
      companiesStatus={companiesStatus} // Teruskan status loading perusahaan
    />
  );
}
