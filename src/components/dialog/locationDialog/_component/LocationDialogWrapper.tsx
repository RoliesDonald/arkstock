"use client";

import { Location } from "@/types/locations";
import { LocationFormValues } from "@/schemas/locations";
// Tidak ada Redux state yang perlu diambil di sini untuk dialog lokasi saat ini.
// Jika di masa depan ada dropdown yang membutuhkan data dari Redux,
// maka logika fetch akan ditambahkan di sini.
import LocationDialog from "./LocationDialog";

interface LocationDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: LocationFormValues) => Promise<void>;
  initialData?: Location;
}

export default function LocationDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: LocationDialogWrapperProps) {
  // Tidak ada logika fetch data Redux di sini untuk saat ini.
  // Jika diperlukan, bisa ditambahkan di sini, mirip dengan CompanyDialogWrapper.

  return (
    <LocationDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
    />
  );
}
