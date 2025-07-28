export interface RawEstimationServiceApiResponse {
  id: string;
  estimationId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number; // Dari API, bisa berupa number atau string (Decimal di Prisma)
  totalPrice: number; // Dari API, bisa berupa number atau string (Decimal di Prisma)
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  estimation?: {
    id: string;
    estimationNumber: string;
  };
  service?: {
    id: string;
    name: string;
    price: number; // Harga dasar jasa
  };
}

// Interface untuk data EstimationService yang sudah diformat di frontend (dengan Date objects)
export interface EstimationService {
  id: string;
  estimationId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  estimation?: {
    id: string;
    estimationNumber: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
  };
}

// CATATAN: EstimationServiceFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/estimationService.ts menggunakan z.infer.
