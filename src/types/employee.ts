import * as z from "zod";

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
  TERMINATED = "TERMINATED",
}

export enum EmployeeRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  MECHANIC = "MECHANIC",
  DRIVER = "DRIVER",
  SERVICE_ADVISOR = "SERVICE_ADVISOR",
  PIC = "PIC", // Person In Charge
  ACCOUNTING_MANAGER = "ACCOUNTING_MANAGER",
  WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER",
  PURCHASING_MANAGER = "PURCHASING_MANAGER",
  SUPER_ADMIN = "SUPER_ADMIN", // Untuk kasus SuperAdmin
}

export const employeeFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nama Karyawan wajib diisi (minimal 2 karakter)" }),
  email: z
    .string()
    .email({ message: "Email tidak valid" })
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .min(10, { message: "Nomor telepon wajib diisi (minimal 10 digit)." }),
  address: z
    .string()
    .min(5, { message: "Alamat wajib diisi (minimal 5 karakter)." }),
  position: z.string().min(2, { message: "Jabatan wajib diisi." }),
  role: z.nativeEnum(EmployeeRole, {
    errorMap: () => ({ message: "Peran karyawan wajib dipilih." }),
  }),
  status: z.nativeEnum(EmployeeStatus, {
    errorMap: () => ({ message: "Status karyawan wajib dipilih." }),
  }),
  // tanggalLahir: z.date({
  //   required_error: "Tanggal lahir wajib diisi.",
  // }),
  tanggalBergabung: z.date().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export interface Employee {
  id: string; // UUID
  name: string;
  email?: string | null; // Bisa null di database
  phoneNumber: string;
  address: string;
  position: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  // tanggalLahir: Date;
  tanggalBergabung?: Date | null; // Bisa null di database
  createdAt: Date;
  updatedAt: Date;
}
