// src/types/serviceRequiredSpareParts.ts

// Interface untuk data mentah yang diterima langsung dari API
export interface RawServiceRequiredSparePartApiResponse {
  id: string;
  serviceId: string;
  sparePartId: string;
  quantity: number;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  service?: {
    id: string;
    name: string;
  };
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
    price: number;
  };
}

// Interface untuk data ServiceRequiredSparePart yang sudah diformat di frontend (dengan Date objects)
export interface ServiceRequiredSparePart {
  id: string;
  serviceId: string;
  sparePartId: string;
  quantity: number;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  service?: {
    id: string;
    name: string;
  };
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
    price: number;
  };
}

// CATATAN: ServiceRequiredSparePartFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/serviceRequiredSparePart.ts menggunakan z.infer.
