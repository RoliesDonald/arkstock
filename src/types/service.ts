// src/types/service.ts
import * as z from "zod";

// Skema untuk entitas Service utama (sesuai Prisma)
export const serviceSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => crypto.randomUUID()),
  serviceName: z.string().min(1, { message: "Nama layanan wajib diisi." }),
  description: z.string().optional().nullable(),
  price: z.coerce
    .number()
    .min(0, { message: "Harga layanan tidak boleh negatif." }),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export type Service = z.infer<typeof serviceSchema>;

// Skema untuk form input Service
export const serviceFormSchema = serviceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  invoiceServices: true, // Relasi
  estimationServices: true, // Relasi
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

// Interface untuk item layanan dalam transaksi (InvoiceService, EstimationService)
// Ini adalah "view model" item layanan yang berisi detail layanan untuk ditampilkan
export const transactionServiceDetailsSchema = z.object({
  serviceId: z.string().uuid(), // ID layanan dari database
  serviceName: z.string().min(1, { message: "Nama layanan wajib diisi." }),
  description: z.string().optional().nullable(),
  price: z.coerce
    .number()
    .min(0.01, { message: "Harga layanan harus lebih dari 0." }),
  quantity: z.coerce.number().int().min(1).default(1), // Quantity default 1
  totalPrice: z.coerce
    .number()
    .min(0, { message: "Total harga tidak boleh negatif." }),
});

export type TransactionServiceDetails = z.infer<
  typeof transactionServiceDetailsSchema
>;
