import * as z from "zod";

// Ini adalah Zod schema untuk join table 'SparePartSuitableVehicle'
export const sparePartSuitableVehicleSchema = z.object({
  sparePartId: z.string().uuid(),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type SparePartSuitableVehicle = z.infer<
  typeof sparePartSuitableVehicleSchema
>;

// Anda mungkin tidak akan memiliki form schema terpisah untuk ini
// karena ini biasanya diatur melalui form SparePart atau Vehicle.
