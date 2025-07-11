import { z } from "zod";
import { SparePart } from "./sparepart";
import { InvoiceService } from "./invoice";
import { EstimationService } from "./estimation";

// RequiredSparePart interface
export interface RequiredSparePart {
  serviceId?: string;
  sparePartId: string;
  quantity: number;
  sparePart?: SparePart;
}

// Service schema
export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: "Nama layanan wajib diisi." }),
  category: z.string(),
  subCategory: z.string(),
  description: z.string().nullable().optional(),
  price: z.number().min(0.01, { message: "Harga layanan harus lebih dari 0." }),
  tasks: z.array(z.string()),
  requiredSpareParts: z
    .array(
      z.object({
        sparePartId: z
          .string()
          .min(1, { message: "ID Spare Part wajib diisi." }),
        quantity: z
          .number()
          .int()
          .min(1, { message: "Kuantitas harus minimal 1." }),
      })
    )
    .nullable()
    .optional(), // Opsional karena tidak semua service butuh spare part
});

// Main Service type
export type Service = z.infer<typeof serviceSchema> & {
  createdAt: Date;
  updatedAt: Date;
  requiredSpareParts?: RequiredSparePart[];
  invoiceServices?: InvoiceService[];
  estimationServices?: EstimationService[];
};

// Service form schema (omit id, createdAt, updatedAt)
export const serviceFormSchema = serviceSchema.omit({
  id: true,
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

// TransactionServiceDetails schema
export const transactionServiceDetailsSchema = z.object({
  id: z.string().optional(),
  serviceId: z.string().uuid(),
  serviceName: z.string().min(1, { message: "Nama layanan wajib diisi." }),
  description: z.string().optional().nullable(),
  price: z.number().min(0.01, { message: "Harga layanan harus lebih dari 0." }),
  quantity: z.number().int().min(1).default(1),
  totalPrice: z
    .number()
    .min(0, { message: "Total harga tidak boleh negatif." }),
});

export type TransactionServiceDetails = z.infer<
  typeof transactionServiceDetailsSchema
>;
