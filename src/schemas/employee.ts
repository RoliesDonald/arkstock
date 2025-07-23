// src/schemas/employee.ts
import { z } from "zod";
// Impor Enums langsung dari @prisma/client untuk validasi Zod
import { EmployeeRole, EmployeeStatus, Gender } from "@prisma/client";

export const employeeFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  employeeId: z.string().min(1, "ID Karyawan wajib diisi."), // Asumsi ini wajib
  name: z.string().min(1, "Nama Karyawan wajib diisi."), // Asumsi ini wajib
  email: z.string().email("Format email tidak valid.").nullable().optional(), // Opsional
  photo: z.string().url("Format URL foto tidak valid.").nullable().optional(), // Opsional
  phone: z.string().nullable().optional(), // Opsional
  address: z.string().nullable().optional(), // Opsional
  position: z.string().nullable().optional(), // Opsional
  role: z.nativeEnum(EmployeeRole, {
    errorMap: () => ({ message: "Role Karyawan tidak valid." }),
  }),
  department: z.string().nullable().optional(), // Opsional
  status: z.nativeEnum(EmployeeStatus, {
    errorMap: () => ({ message: "Status Karyawan tidak valid." }),
  }),
  tanggalLahir: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal lahir tidak valid (YYYY-MM-DD).")
    .nullable()
    .optional(), // Opsional
  tanggalBergabung: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal bergabung tidak valid (YYYY-MM-DD).")
    .nullable()
    .optional(), // Opsional
  companyId: z.string().nullable().optional(), // Opsional, karena bisa null di defaultValues
  password: z.string().min(6, "Password minimal 6 karakter.").nullable().optional(), // Opsional, hanya diisi saat membuat/mengubah
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: "Jenis Kelamin tidak valid." }),
  }), // Tambahkan field gender
});

// Ekspor tipe EmployeeFormValues langsung dari skema Zod
export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
