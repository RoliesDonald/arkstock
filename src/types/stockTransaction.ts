// Import Enums dari Prisma Client
import { StockTransactionType } from "@prisma/client";

// Interface untuk data mentah yang diterima langsung dari API
export interface RawStockTransactionApiResponse {
  id: string;
  transactionNumber: string;
  transactionDate: string; // Dari API, akan berupa string ISO
  type: string; // Dari API, akan berupa string
  sparePartId: string;
  sourceWarehouseId: string; // Perubahan
  targetWarehouseId: string | null; // Perubahan
  quantity: number;
  notes: string | null;
  processedById: string | null;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
  sourceWarehouse?: {
    // Perubahan
    id: string;
    name: string;
  };
  targetWarehouse?: {
    // Perubahan
    id: string;
    name: string;
  };
  processedBy?: {
    id: string;
    name: string;
  };
}

// Interface untuk data StockTransaction yang sudah diformat di frontend (dengan Date objects dan Enums)
export interface StockTransaction {
  id: string;
  transactionNumber: string;
  transactionDate: Date; // Date object
  type: StockTransactionType; // Tipe Enum Prisma
  sparePartId: string;
  sourceWarehouseId: string; // Perubahan
  targetWarehouseId: string | null; // Perubahan
  quantity: number;
  notes: string | null;
  processedById: string | null;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
  sourceWarehouse?: {
    // Perubahan
    id: string;
    name: string;
  };
  targetWarehouse?: {
    // Perubahan
    id: string;
    name: string;
  };
  processedBy?: {
    id: string;
    name: string;
  };
}

// CATATAN: StockTransactionFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/stockTransaction.ts menggunakan z.infer.
