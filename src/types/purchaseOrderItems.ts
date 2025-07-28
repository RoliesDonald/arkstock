export interface RawPurchaseOrderItemApiResponse {
  id: string;
  poId: string;
  sparePartId: string;
  quantity: number;
  unitPrice: number; // Dari API, bisa berupa number atau string (Decimal di Prisma)
  totalPrice: number; // Dari API, bisa berupa number atau string (Decimal di Prisma)
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  purchaseOrder?: {
    id: string;
    poNumber: string;
  };
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
}

// Interface untuk data PurchaseOrderItem yang sudah diformat di frontend (dengan Date objects)
export interface PurchaseOrderItem {
  id: string;
  poId: string;
  sparePartId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  purchaseOrder?: {
    id: string;
    poNumber: string;
  };
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
}

// CATATAN: PurchaseOrderItemFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/purchaseOrderItem.ts menggunakan z.infer.
