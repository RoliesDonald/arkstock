import * as z from "zod";

export interface Unit {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const unitFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "nama satuan wajib diisi" }),
  description: z.string().nullable().optional(),
});

export type UnitFormValues = z.infer<typeof unitFormSchema>;
