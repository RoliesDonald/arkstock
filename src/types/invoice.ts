// src/types/invoice.ts
import * as z from "zod";
import { SparePart, transactionPartDetailsSchema } from "./sparepart";
import { Service, transactionServiceDetailsSchema } from "./service";

// Enum untuk status Invoice
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELED = "CANCELED",
  OVERDUE = "OVERDUE",
}

// Skema Zod untuk form Invoice (yang akan digunakan oleh react-hook-form)
export const invoiceFormSchema = z.object({
  invNum: z.string().min(1, { message: "Nomor Invoice wajib diisi." }),
  date: z.date({ required_error: "Tanggal Invoice wajib diisi." }),
  requestOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer tidak boleh negatif." })
    .nullable()
    .optional(),
  actualOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer tidak boleh negatif." })
    .nullable()
    .optional(),
  remark: z.string().optional().nullable(),
  finished: z.date({ required_error: "Tanggal selesai wajib diisi." }),
  // totalAmount akan selalu ada karena ada default value
  totalAmount: z.coerce
    .number()
    .min(0, { message: "Total harga tidak boleh negatif." })
    .default(0),

  // Foreign Keys (UUIDs)
  woId: z.string().uuid({ message: "ID Work Order wajib diisi." }),

  status: z
    .nativeEnum(InvoiceStatus, {
      errorMap: () => ({ message: "Status Invoice wajib dipilih." }),
    })
    .default(InvoiceStatus.DRAFT),

  // Array untuk item suku cadang dan layanan
  partItems: z.array(transactionPartDetailsSchema).optional(),
  serviceItems: z.array(transactionServiceDetailsSchema).optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

// Interface untuk Invoice yang disimpan di database (meliputi relasi jika di-populate)
export interface Invoice {
  id: string; // UUID Invoice
  invNum: string;
  date: Date;
  requestOdo?: number | null;
  actualOdo?: number | null;
  remark?: string | null;
  finished: Date;
  totalAmount: number;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date;

  // Foreign Keys
  woId: string;

  // Virtual fields / Populated relations (dari Work Order atau lookup data)
  woMaster: string; // dari WO
  vehicleMake: string; // dari Vehicle
  model: string; // dari Vehicle
  licensePlate: string; // dari Vehicle
  vinNum?: string | null; // dari Vehicle
  engineNum?: string | null; // dari Vehicle
  customer: string; // dari Company
  carUser: string; // dari Company
  mechanic?: string | null; // dari User
  approvedBy?: string | null; // dari User

  // Relasi ke item-item transaksi
  invoiceItems: InvoiceItem[];
  invoiceServices: InvoiceService[];
}

// Interface for InvoiceItem (join table in database)
export interface InvoiceItem
  extends z.infer<typeof transactionPartDetailsSchema> {
  id: string; // UUID untuk item invoice itu sendiri
  invoiceId: string; // FK ke Invoice
  createdAt: Date;
  updatedAt: Date;
  sparePart?: SparePart; // Detail SparePart master (jika di-populate)
}

// Interface for InvoiceService (join table in database)
export interface InvoiceService
  extends z.infer<typeof transactionServiceDetailsSchema> {
  id: string; // UUID untuk item layanan invoice itu sendiri
  invoiceId: string; // FK ke Invoice
  createdAt: Date;
  updatedAt: Date;
  service?: Service; // Detail Service master (jika di-populate)
}
