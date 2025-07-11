import * as z from "zod";
import { Company } from "./companies"; // Asumsi ada file company.ts
import { Employee } from "./employee"; // Asumsi ada file employee.ts
import { SparePart } from "./sparepart"; // Asumsi ada file sparePart.ts

// Enum untuk status Purchase Order (sesuai dengan schema.prisma)
export enum PurchaseOrderStatus {
  DRAFT = "DRAFT",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED", // PO sudah dipenuhi/diterima barangnya
  CANCELED = "CANCELED",
  ORDERED = "ORDERED", // Ditambahkan dari schema.prisma
  SHIPPED = "SHIPPED", // Ditambahkan dari schema.prisma
  RECEIVED = "RECEIVED", // Ditambahkan dari schema.prisma
  PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED", // Ditambahkan dari schema.prisma
}

// Skema Zod untuk setiap item dalam Purchase Order (untuk input form)
// Ini mencakup detail yang mungkin denormalisasi dari SparePart untuk kemudahan UI
export const purchaseOrderItemFormSchema = z.object({
  id: z.string().optional(), // ID untuk item (jika perlu untuk edit/hapus individual)
  sparePartId: z
    .string()
    .uuid()
    .min(1, { message: "Suku cadang wajib dipilih." }),
  itemName: z.string().min(1, { message: "Nama item wajib diisi." }), // Dari SparePart.partName
  partNumber: z.string().min(1, { message: "Nomor part wajib diisi." }), // Dari SparePart.partNumber
  quantity: z.coerce.number().int().min(1, { message: "Kuantitas minimal 1." }),
  unit: z.string().min(1, { message: "Satuan wajib diisi." }), // Dari SparePart.unit
  unitPrice: z.coerce
    .number()
    .min(0, { message: "Harga satuan tidak boleh negatif." }),
  totalPrice: z.coerce
    .number()
    .min(0, { message: "Total harga tidak boleh negatif." }), // Ditambahkan, karena ada di DB
});

export type PurchaseOrderItemFormValues = z.infer<
  typeof purchaseOrderItemFormSchema
>;

// Interface untuk PurchaseOrderItem yang diterima dari database (dengan relasi SparePart)
export interface PurchaseOrderItem {
  id: string;
  poId: string;
  sparePartId: string;
  sparePart: SparePart; // Relasi ke objek SparePart lengkap
  quantity: number;
  unitPrice: number; // Decimal di Prisma, number di TS
  totalPrice: number; // Decimal di Prisma, number di TS
  createdAt: Date;
  updatedAt: Date;
}

// Skema Zod untuk form Purchase Order
export const purchaseOrderFormSchema = z.object({
  id: z.string().optional(), // Opsional untuk mode edit
  poNumber: z.string().optional(), // Akan di-generate otomatis
  poDate: z.date({ required_error: "Tanggal PO wajib diisi." }), // KOREKSI: date -> poDate
  supplierId: z.string().min(1, { message: "Supplier wajib dipilih." }), // KOREKSI: vendorId -> supplierId
  deliveryAddress: z.string().nullable().optional(), // Sesuai schema.prisma
  deliveryDate: z.date().nullable().optional(), // Sesuai schema.prisma
  requestedById: z.string().min(1, { message: "Diminta oleh wajib dipilih." }),
  approvedById: z.string().nullable().optional(), // Opsional, diisi setelah approval
  remark: z.string().nullable().optional(), // Catatan tambahan
  rejectionReason: z.string().nullable().optional(), // DITAMBAHKAN: Sesuai schema.prisma
  status: z.nativeEnum(PurchaseOrderStatus), // Status PO

  // Daftar item suku cadang dalam PO (menggunakan skema form item)
  items: z
    .array(purchaseOrderItemFormSchema)
    .min(1, { message: "Minimal ada satu item dalam Purchase Order." }),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;

// Interface untuk data Purchase Order lengkap (termasuk ID, timestamp, dan relasi)
export interface PurchaseOrder {
  id: string; // UUID
  poNumber: string;
  poDate: Date;
  supplierId: string;
  supplier?: Company; // Opsional: untuk menampung objek Company jika di-include
  deliveryAddress: string | null;
  subtotal: number; // Decimal di Prisma, number di TS
  tax: number; // Decimal di Prisma, number di TS
  totalAmount: number; // Total jumlah PO
  deliveryDate: Date | null;
  status: PurchaseOrderStatus;
  requestedById: string | null;
  requestedBy?: Employee; // Opsional: untuk menampung objek Employee jika di-include
  approvedById: string | null;
  approvedBy?: Employee; // Opsional: untuk menampung objek Employee jika di-include
  remark: string | null;
  rejectionReason: string | null; // DITAMBAHKAN: Sesuai schema.prisma

  // Items sekarang mencakup tipe PurchaseOrderItem yang lengkap dari DB
  orderItems: PurchaseOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
