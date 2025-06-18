// src/types/company.ts
import * as z from "zod";

// Enum sesuai Prisma
export enum CompanyType {
  CUSTOMER = "CUSTOMER",
  VENDOR = "VENDOR",
  CAR_USER = "CAR_USER",
  SUPPLIER = "SUPPLIER",
  INTERNAL = "INTERNAL",
}

// Enum tambahan untuk UI (tidak ada di Prisma)
export enum CompanyStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PROSPECT = "Prospect",
  BLACKLISTED = "Blacklisted",
  ON_HOLD = "On Hold",
}

// Skema Zod untuk validasi form Company
export const companyFormSchema = z.object({
  companyId: z.string().min(1, { message: "ID Perusahaan wajib diisi." }),
  companyName: z.string().min(1, { message: "Nama perusahaan wajib diisi." }),
  companyEmail: z
    .string()
    .email({ message: "Format email tidak valid." })
    .optional()
    .or(z.literal("")),
  logo: z
    .string()
    .url({ message: "Format URL logo tidak valid." })
    .optional()
    .or(z.literal("")),
  contact: z.string().min(1, { message: "Nomor telepon wajib diisi." }),
  address: z.string().min(1, { message: "Alamat wajib diisi." }),
  taxRegistered: z.boolean(),
  companyType: z.nativeEnum(CompanyType, {
    required_error: "Tipe perusahaan wajib dipilih.",
  }),
  // Status tetap di form untuk UI
  status: z.nativeEnum(CompanyStatus, {
    required_error: "Status perusahaan wajib dipilih.",
  }),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

// Interface Company lengkap (mencerminkan model Prisma)
export interface Company {
  id: string; // UUID
  companyId: string;
  companyName: string;
  companyEmail?: string;
  logo?: string;
  contact?: string;
  address?: string;
  taxRegistered: boolean;
  companyType: CompanyType;
  // Status (dari CompanyStatus) tidak ada di Prisma, ditambahkan sebagai opsional
  status?: CompanyStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relasi: di sisi frontend, ini mungkin hanya ID atau bisa di-expand
  // vehiclesOwned?: Vehicle[]; // Tidak akan dimasukkan ke form
  // vehiclesUsed?: Vehicle[];
  // user?: User[];
  // customerWorkOrders?: WorkOrder[];
  // carUserWorkOrders?: WorkOrder[];
  // vendorWorkOrders?: WorkOrder[];
  // suppliedPurchaseOrders?: PurchaseOrder[];
}
