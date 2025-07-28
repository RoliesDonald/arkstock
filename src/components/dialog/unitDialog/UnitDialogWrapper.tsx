"use client";

import { Unit } from "@/types/unit";
import { UnitFormValues } from "@/schemas/unit";
// Tidak ada Redux state yang perlu diambil di sini untuk dialog unit saat ini.
// Jika di masa depan ada dropdown yang membutuhkan data dari Redux,
// maka logika fetch akan ditambahkan di sini.
import UnitDialog from "./UnitDialog";

interface UnitDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: UnitFormValues) => Promise<void>;
  initialData?: Unit;
}

export default function UnitDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: UnitDialogWrapperProps) {
  // Tidak ada logika fetch data Redux di sini untuk saat ini.
  // Jika diperlukan, bisa ditambahkan di sini, mirip dengan CompanyDialogWrapper.

  return (
    <UnitDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
    />
  );
}
