"use client";

import { Service } from "@/types/services";
import { ServiceFormValues } from "@/schemas/service";
// Tidak ada Redux state yang perlu diambil di sini untuk dialog service saat ini.
// Jika di masa depan ada dropdown yang membutuhkan data dari Redux (misal daftar spare part yang cocok),
// maka logika fetch akan ditambahkan di sini.
import ServiceDialog from "./ServiceDialog";

interface ServiceDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  initialData?: Service;
}

export default function ServiceDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: ServiceDialogWrapperProps) {
  // Tidak ada logika fetch data Redux di sini untuk saat ini.
  // Jika diperlukan, bisa ditambahkan di sini, mirip dengan CompanyDialogWrapper.

  return (
    <ServiceDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
    />
  );
}
