// src/components/dialog/warehouseDialog/_components/WarehouseDialogWrapper.tsx
"use client";

import { Warehouse } from "@/types/warehouse";
import { WarehouseFormValues } from "@/schemas/warehouse";
// Tidak ada Redux state yang perlu diambil di sini untuk dialog warehouse saat ini.
// Jika di masa depan ada dropdown yang membutuhkan data dari Redux,
// maka logika fetch akan ditambahkan di sini.
import WarehouseDialog from "./WarehouseDialog";

interface WarehouseDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: WarehouseFormValues) => Promise<void>;
  initialData?: Warehouse;
}

export default function WarehouseDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: WarehouseDialogWrapperProps) {
  // Tidak ada logika fetch data Redux di sini untuk saat ini.
  // Jika diperlukan, bisa ditambahkan di sini, mirip dengan CompanyDialogWrapper.

  return (
    <WarehouseDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
    />
  );
}
