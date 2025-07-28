export interface RawInvoiceItemApiResponse {
  id: string;
  invoiceId: string;
  sparePartId: string;
  quantity: number;
  unitPrice: number; // Dari API, bisa berupa number atau string (Decimal di Prisma)
  totalPrice: number; // Dari API, bisa berupa number atau string (Decimal di Prisma)
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  invoice?: {
    id: string;
    invoiceNumber: string;
  };
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
}

// Interface untuk data InvoiceItem yang sudah diformat di frontend (dengan Date objects)
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  sparePartId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  invoice?: {
    id: string;
    invoiceNumber: string;
  };
  sparePart?: {
    id: string;
    partNumber: string;
    partName: string;
    unit: string;
  };
}

// CATATAN: InvoiceItemFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/invoiceItem.ts menggunakan z.infer.
