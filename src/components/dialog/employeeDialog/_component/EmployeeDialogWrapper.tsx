"use client";

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Employee } from "@/types/employee";
import { EmployeeFormValues } from "@/schemas/employee";
import EmployeeDialog from "./EmployeeDialog";

// Definisikan tipe untuk enum yang akan kita ambil dari API
interface EnumsApiResponse {
  SparePartCategory: string[];
  SparePartStatus: string[];
  PartVariant: string[];
  EmployeeRole: string[];
  EmployeeStatus: string[];
  Gender: string[];
  EmployeePosition: string[];
}

interface EmployeeDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: EmployeeFormValues) => void;
  initialData?: Employee;
  enums: EnumsApiResponse | null;
}

export default function EmployeeDialogWrapper({
  onClose,
  onSubmit,
  initialData,
  enums, // KUNCI PERBAIKAN: Destrukturisasi enums
}: EmployeeDialogWrapperProps) {
  const title = initialData ? "Edit Karyawan" : "Tambah Karyawan Baru";

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="p-4">
        <EmployeeDialog
          onClose={onClose}
          initialData={initialData}
          onSubmit={onSubmit}
          enums={enums} // KUNCI PERBAIKAN: Teruskan enums ke EmployeeDialog
        />
      </div>
    </DialogContent>
  );
}
