// Interface untuk data mentah yang diterima langsung dari API
export interface RawEstimationItemApiResponse {
  id: string;
  estimationId: string;
  sparePartId: string;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  estimation?: {
    id: string;
    estimationNumber: string;
  };
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
}

// Interface untuk data EstimationItem yang sudah diformat di frontend (dengan Date objects)
export interface EstimationItem {
  id: string;
  estimationId: string;
  sparePartId: string;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  estimation?: {
    id: string;
    estimationNumber: string;
  };
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
}

// CATATAN: EstimationItemFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/estimationItem.ts menggunakan z.infer.
