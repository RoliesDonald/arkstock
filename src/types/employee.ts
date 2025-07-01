// src/types/employee.ts
import * as z from "zod";

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
  TERMINATED = "TERMINATED",
}

export enum EmployeeRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN_USER = "ADMIN_USER",
  FLEET_PIC = "FLEET_PIC",
  SERVICE_ADVISOR = "SERVICE_ADVISOR",
  MECHANIC = "MECHANIC",
  WAREHOUSE_STAFF = "WAREHOUSE_STAFF",
  FINANCE_STAFF = "FINANCE_STAFF",
  SALES_STAFF = "SALES_STAFF",
  PURCHASING_STAFF = "PURCHASING_STAFF",
  ACCOUNTING_MANAGER = "ACCOUNTING_MANAGER",
  WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER",
  PURCHASING_MANAGER = "PURCHASING_MANAGER",
}

// Skema Zod untuk form Karyawan
export const employeeFormSchema = z.object({
  id: z.string().optional(), // Tambahkan ID untuk edit form
  name: z
    .string()
    .min(2, { message: "Nama lengkap wajib diisi (minimal 2 karakter)." }), // namaLengkap -> name
  email: z
    .string()
    .email({ message: "Email tidak valid." })
    .nullable()
    .optional(), // Nullable dan opsional
  phoneNumber: z
    .string()
    .min(8, { message: "Nomor telepon wajib diisi (minimal 8 digit)." }), // nomorTelepon -> phoneNumber
  address: z
    .string()
    .min(5, { message: "Alamat wajib diisi (minimal 5 karakter)." }), // alamat -> address
  position: z.string().min(2, { message: "Jabatan wajib diisi." }), // jabatan -> position
  role: z.nativeEnum(EmployeeRole, {
    errorMap: () => ({ message: "Peran karyawan wajib dipilih." }),
  }),
  status: z.nativeEnum(EmployeeStatus, {
    errorMap: () => ({ message: "Status karyawan wajib dipilih." }),
  }),
  tanggalLahir: z.date({
    required_error: "Tanggal lahir wajib diisi.",
  }),
  tanggalBergabung: z.date().nullable().optional(), // Nullable dan opsional
  currentCompanyId: z.string().nullable().optional(), // Tambahkan currentCompanyId, nullable dan opsional
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

// Interface untuk data Karyawan lengkap (termasuk ID dan timestamp)
export interface Employee {
  id: string; // UUID
  name: string; // namaLengkap -> name
  email: string | null; // Konsisten: string atau null
  phoneNumber: string; // nomorTelepon -> phoneNumber
  address: string; // alamat -> address
  position: string; // jabatan -> position
  role: EmployeeRole;
  status: EmployeeStatus;
  tanggalLahir: Date;
  tanggalBergabung: Date | null; // Konsisten: Date atau null
  currentCompanyId: string | null; // ID perusahaan tempat karyawan berafiliasi (opsional)
  createdAt: Date;
  updatedAt: Date;
}
