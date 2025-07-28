// // src/types/user.ts
// import * as z from "zod";

// // Enum sesuai Prisma
// export enum UserRole {
//   ADMIN = "ADMIN",
//   USER = "USER",
//   MECHANIC = "MECHANIC",
//   DRIVER = "DRIVER",
//   PIC = "PIC",
//   SERVICE_ADVISOR = "SERVICE_ADVISOR",
//   WAREHOSE_STAFF = "WAREHOSE_STAFF",
//   WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER",
//   ACCOUNTING_STAFF = "ACCOUNTING_STAFF",
//   ACCOUNTING_MANAGER = "ACCOUNTING_MANAGER",
//   PURCHASING_STAFF = "PURCHASING_STAFF",
//   PURCHASING_MANAGER = "PURCHASING_MANAGER",
// }

// // Enum tambahan untuk UI (tidak ada di Prisma)
// export enum UserStatus {
//   ON_DUTY = "ON DUTY",
//   OFF_DUTY = "OFF DUTY",
//   ON_LEAVE = "ON LEAVE",
//   SUSPENDED = "SUSPENDED",
// }

// // Skema Zod untuk validasi form User
// export const userFormSchema = z.object({
//   userId: z.string().optional(), // Opsional jika UUID sudah cukup atau auto-generated
//   name: z.string().min(1, { message: "Nama wajib diisi." }),
//   email: z
//     .string()
//     .email({ message: "Format email tidak valid." })
//     .optional()
//     .or(z.literal("")),
//   photo: z
//     .string()
//     .url({ message: "Format URL foto tidak valid." })
//     .optional()
//     .or(z.literal("")),
//   phone: z.string().optional(),
//   role: z.nativeEnum(UserRole, {
//     required_error: "Peran pengguna wajib dipilih.",
//   }),
//   department: z.string().optional(), // Di Prisma 'departement'
//   companyId: z.string().optional(), // ID perusahaan tempat karyawan bekerja
//   // Status tetap di form untuk UI
//   status: z.nativeEnum(UserStatus, {
//     required_error: "Status pengguna wajib dipilih.",
//   }),
// });

// export type UserFormValues = z.infer<typeof userFormSchema>;

// export interface User {
//   id: string; // UUID
//   userId?: string;
//   name: string;
//   email?: string;
//   photo?: string;
//   phone?: string;
//   role: UserRole;
//   department?: string;
//   companyId?: string; // Foreign Key
//   // Status (dari UserStatus) tidak ada di Prisma, ditambahkan sebagai opsional
//   status?: UserStatus;
//   createdAt: Date;
//   updatedAt: Date;

//   // Relasi (tidak diisi di form)
//   // company?: Company;
//   // mechanicWorkOrders?: WorkOrder[];
//   // driverWorkOrders?: WorkOrder[];
//   // approvedWorkOrders?: WorkOrder[];
//   // requestedWorkOrders?: WorkOrder[];
//   // mechanicInvoices?: Invoice[];
//   // approvedInvoices?: Invoice[];
//   // mechanicEstimations?: Estimation[];
//   // approvedEstimations?: Estimation[];
//   // requestedPurchaseOrders?: PurchaseOrder[];
//   // approvedPurchaseOrders?: PurchaseOrder[];
// }
