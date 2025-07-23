export interface RawWorkOrderServiceApiResponse {
  id: string;
  workOrderId: string;
  serviceId: string;
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
  service?: {
    id: string;
    name: string;
    price: number; // Harga dasar jasa
  };
}

// Interface untuk data WorkOrderService yang sudah diformat di frontend (dengan Date objects)
export interface WorkOrderService {
  id: string;
  workOrderId: string;
  serviceId: string;
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
  service?: {
    id: string;
    name: string;
    price: number;
  };
}

// CATATAN: WorkOrderServiceFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/workOrderService.ts menggunakan z.infer.
