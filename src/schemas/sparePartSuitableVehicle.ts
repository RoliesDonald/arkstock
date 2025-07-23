import { z } from "zod";

export const sparePartSuitableVehicleFormSchema = z.object({
  sparePartId: z.string().min(1, "Spare Part wajib diisi."),
  vehicleMake: z.string().min(1, "Merk Kendaraan wajib diisi."),
  vehicleModel: z.string().min(1, "Model Kendaraan wajib diisi."),
  trimLevel: z.string().nullable().optional(),
  modelYear: z.number().int().min(1900, "Tahun Model tidak valid.").nullable().optional(),
});

// Ekspor tipe SparePartSuitableVehicleFormValues langsung dari skema Zod
export type SparePartSuitableVehicleFormValues = z.infer<typeof sparePartSuitableVehicleFormSchema>;
