// src/types/purchaseOrder.ts
import * as z from "zod";
// --- PENTING: Impor TransactionPartDetails dari sparepart.ts ---
import { transactionPartDetailsSchema } from "./sparepart";

export enum PurchaseOrderStatus {
  DRAFT = "DRAFT",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  ORDERED = "ORDERED",
  SHIPPED = "SHIPPED",
  RECEIVED = "RECEIVED",
  CANCELED = "CANCELED",
}

// Skema Zod untuk form PurchaseOrder
export const purchaseOrderFormSchema = z.object({
  poNum: z.string().min(1, { message: "Nomor PO wajib diisi." }),
  poDate: z.date({ required_error: "Tanggal PO wajib diisi." }),
  supplierId: z.string().uuid({ message: "Supplier wajib dipilih." }),
  deliveryAddress: z.string().optional().nullable(),
  subtotal: z.coerce
    .number()
    .min(0, { message: "Subtotal tidak boleh negatif." }),
  tax: z.coerce.number().min(0, { message: "Pajak tidak boleh negatif." }),
  totalAmount: z.coerce
    .number()
    .min(0, { message: "Total jumlah tidak boleh negatif." }),
  deliveryDate: z.date().optional().nullable(),
  status: z.nativeEnum(PurchaseOrderStatus),
  requestedById: z.string().optional().nullable(),
  approvedById: z.string().optional().nullable(),
  remark: z.string().optional().nullable(),
  // Untuk form, item PO bisa berupa array dari detail part
  orderItems: z
    .array(
      transactionPartDetailsSchema.omit({ partId: true, totalPrice: true })
    )
    .min(1, { message: "Setidaknya satu item harus ditambahkan." }),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;

// Interface untuk PurchaseOrderItem (join table) - mencerminkan Prisma
export interface PurchaseOrderItem {
  id: string; // UUID
  poId: string; // FK
  sparePartId: string; // FK
  quantity: number;
  unitPrice: number; // Decimal di Prisma, number di TS
  totalPrice: number; // Decimal di Prisma, number di TS
  createdAt: Date;
  updatedAt: Date;
  // Relasi:
  // purchaseOrder?: PurchaseOrder;
  // sparePart?: SparePart;
}

// Interface PurchaseOrder lengkap (mencerminkan model Prisma)
export interface PurchaseOrder {
  id: string; // UUID
  poNum: string;
  poDate: Date;
  supplierId: string;
  deliveryAddress?: string | null;
  subtotal: number;
  tax: number;
  totalAmount: number;
  deliveryDate?: Date | null;
  status: PurchaseOrderStatus;
  requestedById?: string | null;
  approvedById?: string | null;
  remark?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relasi: array dari join tables
  orderItems?: PurchaseOrderItem[];

  // Relasi (untuk display, jika di-include dari Prisma)
  // supplier?: Company;
  // requestedBy?: User;
  // approvedBy?: User;
}
