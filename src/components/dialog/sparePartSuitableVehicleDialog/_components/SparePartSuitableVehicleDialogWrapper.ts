"use client";

import { SparePartSuitableVehicle } from "@/types/sparePartSuitableVehicles";
import { SparePartSuitableVehicleFormValues } from "@/schemas/sparePartSuitableVehicle";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchSpareParts } from "@/store/slices/sparePartSlice";

// PASTIKAN IMPORT INI BENAR DAN MENGARAH KE FILE KOMPONEN DI ATAS
import SparePartSuitableVehicleDialog from "./SparePartSuitableVehicleDialog";

interface SparePartSuitableVehicleDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: SparePartSuitableVehicleFormValues) => Promise<void>;
  initialData?: SparePartSuitableVehicle;
}

export default function SparePartSuitableVehicleDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: SparePartSuitableVehicleDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const spareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartsStatus = useAppSelector((state) => state.spareParts.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (sparePartsStatus === "idle" || sparePartsStatus === "failed") {
      dispatch(fetchSpareParts());
    }
  }, [dispatch, sparePartsStatus]);

  return (
    <SparePartSuitableVehicleDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      spareParts={spareParts}
      sparePartsStatus={sparePartsStatus}
    />
  );
}
