import * as z from "zod";

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
  TERMINATED = "TERMINATED",
}

export enum EmployeeRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN", // KOREKSI: ADMIN_USER menjadi ADMIN
  FLEET_PIC = "FLEET_PIC",
  SERVICE_MANAGER = "SERVICE_MANAGER", // DITAMBAHKAN
  SERVICE_ADVISOR = "SERVICE_ADVISOR",
  FINANCE_MANAGER = "FINANCE_MANAGER", // DITAMBAHKAN
  FINANCE_STAFF = "FINANCE_STAFF",
  SALES_MANAGER = "SALES_MANAGER", // DITAMBAHKAN
  SALES_STAFF = "SALES_STAFF",
  ACCOUNTING_MANAGER = "ACCOUNTING_MANAGER",
  ACCOUNTING_STAFF = "ACCOUNTING_STAFF", // DITAMBAHKAN
  WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER",
  WAREHOUSE_STAFF = "WAREHOUSE_STAFF",
  PURCHASING_MANAGER = "PURCHASING_MANAGER",
  PURCHASING_STAFF = "PURCHASING_STAFF", // DITAMBAHKAN
  MECHANIC = "MECHANIC",
  USER = "USER", // DITAMBAHKAN
  DRIVER = "DRIVER", // DITAMBAHKAN
  PIC = "PIC", // DITAMBAHKAN
}

// Skema Zod untuk form Karyawan
export const employeeFormSchema = z.object({
  id: z.string().optional(),
  userId: z.string().nullable().optional(),
  name: z
    .string()
    .min(2, { message: "Nama lengkap wajib diisi (minimal 2 karakter)." }), // namaLengkap -> name
  email: z
    .string()
    .email({ message: "Email tidak valid." })
    .nullable()
    .optional(),
  photo: z
    .string()
    .url({ message: "Format URL foto tidak valid." })
    .nullable()
    .optional(),
  phone: z
    .string()
    .min(8, { message: "Nomor telepon wajib diisi (minimal 8 digit)." })
    .nullable()
    .optional(),
  address: z
    .string()
    .min(5, { message: "Alamat wajib diisi (minimal 5 karakter)." })
    .optional()
    .nullable(),
  position: z.string().min(2, { message: "Jabatan wajib diisi." }),
  department: z.string().nullable().optional(),
  role: z.nativeEnum(EmployeeRole, {
    errorMap: () => ({ message: "Peran karyawan wajib dipilih." }),
  }),
  status: z.nativeEnum(EmployeeStatus, {
    errorMap: () => ({ message: "Status karyawan wajib dipilih." }),
  }),
  tanggalLahir: z
    .date({
      required_error: "Tanggal lahir wajib diisi.",
    })
    .optional()
    .nullable(),
  tanggalBergabung: z.date().nullable().optional(),
  companyId: z.string().nullable().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

// Interface untuk data Karyawan lengkap (termasuk ID dan timestamp)
export interface Employee {
  id: string; // UUID
  userId?: string | null;
  name: string;
  email?: string | null;
  photo?: string | null;
  phone?: string | null;
  address?: string | null;
  position?: string | null;
  role: EmployeeRole;
  department?: string | null;
  status: EmployeeStatus;
  tanggalLahir?: Date | null;
  tanggalBergabung?: Date | null;
  companyId?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relasi (jika ingin disertakan di type ini untuk frontend)
  company?: any[];
  mechanicWorkOrders?: any[];
  driverWorkOrders?: any[];
  approvedWorkOrders?: any[];
  requestedWorkOrders?: any[];
  accountingInvoices?: any[];
  approvedInvoices?: any[];
  mechanicEstimations?: any[];
  approvedEstimations?: any[];
  estimationAccountants?: any[];
  requestedPurchaseOrders?: any[];
  approvedPurchaseOrders?: any[];
}
