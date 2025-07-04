// src/types/purchaseOrder.ts
import * as z from "zod";

// Enum untuk status Purchase Order
export enum PurchaseOrderStatus {
  DRAFT = "DRAFT",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED", // PO sudah dipenuhi/diterima barangnya
  CANCELED = "CANCELED",
}

// Skema Zod untuk setiap item dalam Purchase Order
export const purchaseOrderItemSchema = z.object({
  id: z.string().optional(), // ID untuk item (jika perlu untuk edit/hapus individual)
  sparePartId: z.string().min(1, { message: "Suku cadang wajib dipilih." }),
  itemName: z.string().min(1, { message: "Nama item wajib diisi." }),
  partNumber: z.string().min(1, { message: "Nomor part wajib diisi." }),
  quantity: z.coerce.number().int().min(1, { message: "Kuantitas minimal 1." }),
  unit: z.string().min(1, { message: "Satuan wajib diisi." }), // <-- DITAMBAHKAN: Unit untuk item PO
  unitPrice: z.coerce
    .number()
    .min(0, { message: "Harga satuan tidak boleh negatif." }),
});

export type PurchaseOrderItemFormValues = z.infer<
  typeof purchaseOrderItemSchema
>;

// Skema Zod untuk form Purchase Order
export const purchaseOrderFormSchema = z.object({
  id: z.string().optional(), // Opsional untuk mode edit
  poNumber: z.string().optional(), // Akan di-generate otomatis
  date: z.date({ required_error: "Tanggal PO wajib diisi." }),
  vendorId: z.string().min(1, { message: "Vendor wajib dipilih." }),
  requestedById: z.string().min(1, { message: "Diminta oleh wajib dipilih." }),
  approvedById: z.string().nullable().optional(), // Opsional, diisi setelah approval
  rejectionReason: z.string().nullable().optional(), // Alasan penolakan, opsional
  status: z.nativeEnum(PurchaseOrderStatus), // Status PO
  remark: z.string().nullable().optional(), // Catatan tambahan

  // Daftar item suku cadang dalam PO
  items: z
    .array(purchaseOrderItemSchema)
    .min(1, { message: "Minimal ada satu item dalam Purchase Order." }),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;

// Interface untuk data Purchase Order lengkap (termasuk ID dan timestamp)
export interface PurchaseOrder {
  id: string; // UUID
  poNumber: string;
  date: Date;
  vendorId: string;
  requestedById: string;
  approvedById: string | null;
  rejectionReason: string | null;
  status: PurchaseOrderStatus;
  remark: string | null;
  // Items sekarang mencakup itemName, partNumber, unit, dan totalPrice
  items: Array<PurchaseOrderItemFormValues & { totalPrice: number }>;
  totalAmount: number; // Total jumlah PO
  createdAt: Date;
  updatedAt: Date;
}
