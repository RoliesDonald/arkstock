// src/components/dialog/employeeDialog/EmDialogWrapper.tsx
import { Employee } from "@/types/employee";
import { Company } from "@/types/companies"; // Import Company type
import EmployeeDialog from "./EmployeeDialog";
import { EmployeeFormValues } from "@/schemas/employee";

interface EmployeeDialogWrapperProps {
    onClose: () => void;
    initialData?: Employee;
    onSubmit: (values: EmployeeFormValues) => Promise<void>;
    companies: Company[]; // Tambahkan prop untuk daftar perusahaan
    companyStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // Tambahkan prop untuk status perusahaan
}

export default function EmDialogWrapper({
  onClose,
  initialData,
  onSubmit,
  companies, // Terima prop companies
  companyStatus, // Terima prop companyStatus
}: EmployeeDialogWrapperProps) {
  return (
    // Tidak perlu div tambahan di sini jika DialogContent sudah menangani tata letak
    // EmployeeDialog sudah merupakan DialogContent, jadi wrapper ini hanya meneruskan props
    <EmployeeDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      companies={companies}
      companyStatus={companyStatus}
    />
  );
}
