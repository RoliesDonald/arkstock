"use client";

// IMPOR YANG BENAR UNTUK SparePartSuitableVehicle
import { SparePartSuitableVehicle } from "@/types/sparePartSuitableVehicles";
import { SparePartSuitableVehicleFormValues } from "@/schemas/sparePartSuitableVehicle";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown (hanya SparePart yang dibutuhkan di sini)
import { fetchSpareParts } from "@/store/slices/sparePartSlice";
import SparePartSuitableVehicleDialog from "./SparePartSuitableVehicleDialog";

// PASTIKAN IMPORT INI BENAR DAN MENGARAH KE FILE KOMPONEN DI ATAS

interface SparePartSuitableVehicleDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: SparePartSuitableVehicleFormValues) => Promise<void>;
  initialData?: SparePartSuitableVehicle; // Tipe data yang benar
}

export default function SparePartSuitableVehicleDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: SparePartSuitableVehicleDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown (hanya spareParts yang relevan di sini)
  const spareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartsStatus = useAppSelector((state) => state.spareParts.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (sparePartsStatus === "idle" || sparePartsStatus === "failed") {
      dispatch(fetchSpareParts());
    }
  }, [dispatch, sparePartsStatus]);

  return (
    <SparePartSuitableVehicleDialog // Menggunakan komponen yang benar
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      spareParts={spareParts} // Meneruskan props yang benar
      sparePartsStatus={sparePartsStatus} // Meneruskan props yang benar
    />
  );
}
