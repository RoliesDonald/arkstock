import * as z from "zod";
import { Employee } from "./employee";
import { SparePart } from "./sparepart";
import { Service } from "./services";
import { WorkOrder } from "./workOrder";
import { Vehicle } from "./vehicle";

// SEMENTARA buat tester
export const transactionPartDetailsSchema = z.object({
  sparePartId: z
    .string()
    .uuid()
    .min(1, { message: "Suku cadang wajib dipilih." }),
  partName: z.string().min(1, { message: "Nama item wajib diisi." }),
  partNumber: z.string().min(1, { message: "Nomor part wajib diisi." }),
  quantity: z.coerce.number().int().min(1).default(1),
  unit: z.string().min(1, { message: "Satuan wajib diisi." }),
  variant: z.string().min(1, { message: "Varian wajib diisi." }), // Asumsi PartVariant sebagai string
  unitPrice: z.coerce
    .number()
    .min(0.01, { message: "Harga satuan harus lebih dari 0." }),
  totalPrice: z.coerce
    .number()
    .min(0, { message: "Total harga tidak boleh negatif." }),
});

export const transactionServiceDetailsSchema = z.object({
  serviceId: z.string().uuid().min(1, { message: "Layanan wajib dipilih." }),
  serviceName: z.string().min(1, { message: "Nama layanan wajib diisi." }),
  description: z.string().optional().nullable(),
  price: z.number().min(0.01, { message: "Harga layanan harus lebih dari 0." }),
  quantity: z.number().int().min(1).default(1),
  totalPrice: z
    .number()
    .min(0, { message: "Total harga tidak boleh negatif." }),
});

// Enum untuk status Invoice
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELED = "CANCELED",
  OVERDUE = "OVERDUE",
  REJECTED = "REJECTED",
  SENT = "SENT",
  PARTIALLY_PAID = "PARTIALLY_PAID",
}

// Skema Zod untuk form Invoice (yang akan digunakan oleh react-hook-form)
export const invoiceFormSchema = z.object({
  id: z.string().optional(),
  invoiceNumber: z.string().min(1, { message: "Nomor Invoice wajib diisi." }),
  invoiceDate: z.date({ required_error: "Tanggal Invoice wajib diisi." }),
  requestOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer tidak boleh negatif." }),
  actualOdo: z.coerce
    .number()
    .int()
    .min(0, { message: "Odometer tidak boleh negatif." }),
  remark: z.string().optional().nullable(),
  finishedDate: z.date({ required_error: "Tanggal selesai wajib diisi." }),
  totalAmount: z.coerce
    .number()
    .min(0, { message: "Total harga tidak boleh negatif." })
    .default(0),

  // Foreign Keys (UUIDs)
  workOrderId: z.string().uuid({ message: "ID Work Order wajib diisi." }),
  vehicleId: z.string().uuid({ message: "ID Kendaraan wajib diisi." }),
  accountantId: z.string().uuid().optional().nullable(),
  approvedById: z.string().uuid().optional().nullable(),

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

// Interface for InvoiceItem (join table in database)
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  sparePartId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  sparePart?: SparePart; // Detail SparePart master (jika di-populate)
}

// Interface for InvoiceService (join table in database)
export interface InvoiceService {
  id: string;
  invoiceId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  service?: Service; // Detail Service master (jika di-populate)
}

// Interface untuk Invoice yang disimpan di database (meliputi relasi jika di-populate)
export interface Invoice {
  id: string; // UUID Invoice
  nvoiceNumber: string;
  invoiceDate: Date;
  requestOdo: number;
  actualOdo: number;
  remark?: string | null;
  finishedDate: Date;
  totalAmount: number;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date;

  // Foreign Keys (sudah ada di model utama)
  workOrderId: string;
  vehicleId: string;
  accountantId?: string | null;
  approvedById?: string | null;

  // Relasi objects
  workOrder?: WorkOrder;
  vehicle?: Vehicle;
  accountant?: Employee;
  approvedBy?: Employee;

  // Relasi ke item-item transaksi
  invoiceItems: InvoiceItem[];
  invoiceServices: InvoiceService[];
}
