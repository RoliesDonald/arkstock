import * as z from "zod";

export enum TransactionType {
  IN = "IN",
  OUT = "OUT",
  TRANSFER_OUT = "TRANSFER_OUT",
  TRANSFER_IN = "TRANSFER_IN",
}

export interface StockTransaction {
  id: string;
  date: Date;
  sparePartId: string;
  quantity: number;
  transactionType: TransactionType;
  sourceWarehouseId: string;
  targetWarehouseId?: string | null;
  remark?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const stockTransactionFormSchema = z.object({
  id: z.string().optional(),
  date: z.date({ required_error: "Tanggal wajib diisi" }),
  sparePartId: z.string().uuid({ message: "Spare part wajib dipilih" }),
  quantity: z.coerce
    .number()
    .int()
    .min(1, { message: "Jumlah harus lebih dari 0" }),
  transactionType: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: "Tipe transaksi wajib dipilih" }),
  }),
  sourceWarehouseId: z.string().uuid({ message: "Gudang asal wajib dipilih" }),
  targetWarehouseId: z
    .string()
    .uuid({ message: "Gudang tujuan wajib dipilih" })
    .nullable()
    .optional(),
  remark: z.string().optional().nullable(),
});

export type StockTransactionFormValues = z.infer<
  typeof stockTransactionFormSchema
>;
