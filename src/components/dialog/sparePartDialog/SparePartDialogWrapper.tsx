"use client";

import { SparePart } from "@/types/sparepart";
import { SparePartFormValues } from "@/schemas/sparePart";
// Tidak ada Redux state yang perlu diambil di sini untuk dialog spare part saat ini.
// Jika di masa depan ada dropdown yang membutuhkan data dari Redux (misal daftar vehicles yang cocok),
// maka logika fetch akan ditambahkan di sini.
import SparePartDialog from "./SparePartDialog";

interface EnumsApiResponse {
  SparePartCategory: string[];
  SparePartStatus: string[];
  PartVariant: string[];
}

interface SparePartDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: SparePartFormValues) => Promise<void>;
  initialData?: SparePart;
  enums: EnumsApiResponse |null;
}

export default function SparePartDialogWrapper({
  onClose,
  onSubmit,
  initialData,
  enums
}: SparePartDialogWrapperProps) {
  // Tidak ada logika fetch data Redux di sini untuk saat ini.
  // Jika diperlukan, bisa ditambahkan di sini, mirip dengan CompanyDialogWrapper.

  return (
    <SparePartDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      enums={enums}
    />
  );
}
