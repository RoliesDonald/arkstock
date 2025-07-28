export interface RawWarehouseStockApiResponse {
  id: string;
  sparePartId: string;
  warehouseId: string;
  currentStock: number;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
  warehouse?: {
    id: string;
    name: string;
    location: string;
  };
}

// Interface untuk data WarehouseStock yang sudah diformat di frontend (dengan Date objects)
export interface WarehouseStock {
  id: string;
  sparePartId: string;
  warehouseId: string;
  currentStock: number;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
  warehouse?: {
    id: string;
    name: string;
    location: string;
  };
}

// CATATAN: WarehouseStockFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/warehouseStock.ts menggunakan z.infer.
