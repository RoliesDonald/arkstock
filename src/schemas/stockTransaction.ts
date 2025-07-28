// src/schemas/stockTransaction.ts
import { z } from "zod";
// Import Enums dari Prisma Client
import { StockTransactionType } from "@prisma/client";

export const stockTransactionFormSchema = z
  .object({
    id: z.string().optional(), // ID opsional karena hanya ada saat edit
    transactionNumber: z.string().min(1, "Nomor Transaksi wajib diisi."),
    transactionDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal transaksi tidak valid (YYYY-MM-DD)."),
    type: z.nativeEnum(StockTransactionType, {
      errorMap: () => ({ message: "Tipe Transaksi tidak valid." }),
    }),
    sparePartId: z.string().min(1, "Spare Part wajib diisi."),
    sourceWarehouseId: z.string().min(1, "Gudang Sumber wajib diisi."), // Perubahan
    targetWarehouseId: z.string().nullable().optional(), // Perubahan
    quantity: z.number().int().min(1, "Kuantitas minimal 1."),
    notes: z.string().nullable().optional(),
    processedById: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      // Logika validasi kondisional untuk targetWarehouseId
      if (data.type === StockTransactionType.TRANSFER && !data.targetWarehouseId) {
        return false; // Jika tipe TRANSFER, targetWarehouseId wajib diisi
      }
      return true;
    },
    {
      message: "Gudang Tujuan wajib diisi untuk tipe Transfer.",
      path: ["targetWarehouseId"], // Pesan error akan muncul di field targetWarehouseId
    }
  );

// Ekspor tipe StockTransactionFormValues langsung dari skema Zod
export type StockTransactionFormValues = z.infer<typeof stockTransactionFormSchema>;
