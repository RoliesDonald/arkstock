import { PurchaseOrderStatus } from "@prisma/client";

// Interface untuk data mentah yang diterima langsung dari API
export interface RawPurchaseOrderApiResponse {
  id: string;
  poNumber: string;
  poDate: string; // Dari API, akan berupa string ISO
  supplierId: string;
  deliveryAddress: string | null;
  subtotal: number; // Dari API, bisa berupa number atau string
  tax: number; // Dari API, bisa berupa number atau string
  totalAmount: number; // Dari API, bisa berupa number atau string
  deliveryDate: string | null; // Dari API, akan berupa string ISO
  status: string; // Dari API, akan berupa string
  requestedById: string | null;
  approvedById: string | null;
  remark: string | null;
  rejectionReason: string | null;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  supplier?: {
    id: string;
    companyName: string;
  };
  requestedBy?: {
    id: string;
    name: string;
  };
  approvedBy?: {
    id: string;
    name: string;
  };
  // orderItems tidak langsung di sini untuk kesederhanaan
}

// Interface untuk data PurchaseOrder yang sudah diformat di frontend (dengan Date objects dan Enums)
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  poDate: Date; // Date object
  supplierId: string;
  deliveryAddress: string | null;
  subtotal: number;
  tax: number;
  totalAmount: number;
  deliveryDate: Date | null; // Date object
  status: PurchaseOrderStatus; // Tipe Enum Prisma
  requestedById: string | null;
  approvedById: string | null;
  remark: string | null;
  rejectionReason: string | null;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  supplier?: {
    id: string;
    companyName: string;
  };
  requestedBy?: {
    id: string;
    name: string;
  };
  approvedBy?: {
    id: string;
    name: string;
  };
}

// CATATAN: PurchaseOrderFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/purchaseOrder.ts menggunakan z.infer.
