export interface RawSparePartSuitableVehicleApiResponse {
  sparePartId: string;
  vehicleMake: string;
  vehicleModel: string;
  trimLevel: string | null;
  modelYear: number | null;

  // Relasi opsional jika disertakan dalam respons API
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
}

// Interface untuk data SparePartSuitableVehicle yang sudah diformat di frontend
// Tidak ada Date objects karena model ini tidak memiliki createdAt/updatedAt
export interface SparePartSuitableVehicle {
  sparePartId: string;
  vehicleMake: string;
  vehicleModel: string;
  trimLevel: string | null;
  modelYear: number | null;

  // Relasi opsional
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
}

// CATATAN: SparePartSuitableVehicleFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/sparePartSuitableVehicle.ts menggunakan z.infer.
