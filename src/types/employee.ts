import * as z from "zod";
import { Company, RawCompanyApiResponse } from "./companies"; // Pastikan import RawCompanyApiResponse
import { Estimation } from "./estimation"; // Asumsi ini sudah string atau akan difix
import { Invoice } from "./invoice";
import { WorkOrder } from "./workOrder";
import { PurchaseOrder } from "./purchaseOrder";

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
  TERMINATED = "TERMINATED",
}

export enum EmployeeRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  FLEET_PIC = "FLEET_PIC",
  SERVICE_MANAGER = "SERVICE_MANAGER",
  SERVICE_ADVISOR = "SERVICE_ADVISOR",
  FINANCE_MANAGER = "FINANCE_MANAGER",
  FINANCE_STAFF = "FINANCE_STAFF",
  SALES_MANAGER = "SALES_MANAGER",
  SALES_STAFF = "SALES_STAFF",
  ACCOUNTING_MANAGER = "ACCOUNTING_MANAGER",
  ACCOUNTING_STAFF = "ACCOUNTING_STAFF",
  WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER",
  WAREHOUSE_STAFF = "WAREHOUSE_STAFF",
  PURCHASING_MANAGER = "PURCHASING_MANAGER",
  PURCHASING_STAFF = "PURCHASING_STAFF",
  MECHANIC = "MECHANIC",
  USER = "USER",
  DRIVER = "DRIVER",
  PIC = "PIC",
}

// Interface untuk data Karyawan yang akan disimpan di Redux state (tanggal sebagai string)
export interface Employee {
  id: string;
  userId: string | null;
  name: string;
  email: string | null;
  photo: string | null;
  phone: string | null;
  address: string | null;
  position: string | null;
  role: EmployeeRole;
  department: string | null;
  status: EmployeeStatus;
  tanggalLahir: string | null; // Tanggal sebagai string ISO atau null
  tanggalBergabung: string | null; // Tanggal sebagai string ISO atau null
  companyId: string | null; // <-- HARUS ADA DAN string | null
  createdAt: string;
  updatedAt: string;

  // Relasi (jika ingin disertakan di type ini untuk frontend)
  company?: Company | null; // <-- Menggunakan Company yang sudah terformat string
  mechanicWorkOrders?: WorkOrder[];
  driverWorkOrders?: WorkOrder[];
  approvedWorkOrders?: WorkOrder[];
  requestedWorkOrders?: WorkOrder[];
  accountingInvoices?: Invoice[];
  approvedInvoices?: Invoice[];
  mechanicEstimations?: Estimation[];
  approvedEstimations?: Estimation[];
  estimationAccountants?: Estimation[];
  requestedPurchaseOrders?: PurchaseOrder[];
  approvedPurchaseOrders?: PurchaseOrder[];
}

// Interface untuk data mentah Karyawan yang diterima dari API (tanggal sebagai Date objek)
// Ini akan sesuai dengan output default Prisma
export interface RawEmployeeApiResponse {
  id: string;
  userId: string | null;
  name: string;
  email: string | null;
  photo: string | null;
  phone: string | null;
  address: string | null;
  position: string | null;
  role: EmployeeRole;
  department: string | null;
  status: EmployeeStatus;
  tanggalLahir: Date | null; // <-- Ini Date objek atau null dari API
  tanggalBergabung: Date | null; // <-- Ini Date objek atau null dari API
  createdAt: Date; // <-- Ini Date objek dari API
  updatedAt: Date; // <-- Ini Date objek dari API
  companyId: string | null; // <-- HARUS ADA DAN string | null

  // Relasi (jika ingin disertakan dan juga perlu diformat)
  company?: RawCompanyApiResponse | null; // <-- Ini RawCompanyApiResponse
  mechanicWorkOrders?: WorkOrder[]; // Asumsi ini sudah string atau akan difix
  driverWorkOrders?: WorkOrder[];
  approvedWorkOrders?: WorkOrder[];
  requestedWorkOrders?: WorkOrder[];
  accountingInvoices?: Invoice[];
  approvedInvoices?: Invoice[];
  mechanicEstimations?: Estimation[];
  approvedEstimations?: Estimation[];
  estimationAccountants?: Estimation[];
  requestedPurchaseOrders?: PurchaseOrder[];
  approvedPurchaseOrders?: PurchaseOrder[];
}

// Skema Zod untuk form Karyawan
export const employeeFormSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().nullable().optional(),
  name: z.string().min(2, { message: "Nama lengkap wajib diisi." }),
  email: z
    .string()
    .email({ message: "Email tidak valid." })
    .nullable()
    .optional(),
  password: z
    .string()
    .min(6, { message: "Password harus minimal 6 karakter." })
    .optional(),
  photo: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().optional().nullable(),
  position: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  role: z.nativeEnum(EmployeeRole, {
    required_error: "Role Wajib dipilih",
  }),
  status: z.nativeEnum(EmployeeStatus, {
    required_error: "Status Wajib dipilih",
  }),
  tanggalLahir: z
    .string()
    .datetime("Tanggal lahir tidak valid")
    .optional()
    .nullable(),
  tanggalBergabung: z
    .string()
    .datetime("Tanggal bergabung tidak valid")
    .nullable()
    .optional(),
  companyId: z.string().uuid("ID Perusahaan tidak valid").nullable().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
