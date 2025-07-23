export interface RawInvoiceServiceApiResponse {
  id: string;
  invoiceId: string;
  serviceId: string;
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
  service?: {
    id: string;
    name: string;
    price: number; // Harga dasar jasa
  };
}

// Interface untuk data InvoiceService yang sudah diformat di frontend (dengan Date objects)
export interface InvoiceService {
  id: string;
  invoiceId: string;
  serviceId: string;
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
  service?: {
    id: string;
    name: string;
    price: number;
  };
}

// CATATAN: InvoiceServiceFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/invoiceService.ts menggunakan z.infer.
