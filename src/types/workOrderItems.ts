export interface RawWorkOrderItemApiResponse {
  id: string;
  workOrderId: string;
  sparePartId: string;
  quantity: number;
  unitPrice: number; // Dari API, bisa berupa number atau string (Decimal di Prisma)
  totalPrice: number; // Dari API, bisa berupa number atau string (Decimal di Prisma)
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
}

// Interface untuk data WorkOrderItem yang sudah diformat di frontend (dengan Date objects)
export interface WorkOrderItem {
  id: string;
  workOrderId: string;
  sparePartId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
}

// CATATAN: WorkOrderItemFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/workOrderItem.ts menggunakan z.infer.
