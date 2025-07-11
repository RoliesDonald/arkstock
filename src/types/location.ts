import * as z from "zod";

export const locationFormSchema = z.object({
  name: z.string().min(1, { message: "Nama lokasi wajib diisi." }),
  address: z.string().optional().nullable(),
});

export type LocationFormValues = z.infer<typeof locationFormSchema>;

export interface Location {
  id: string; // UUID
  name: string;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relasi (tidak diisi di form)
  // workOrders?: WorkOrder[];
}
