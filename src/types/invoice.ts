export interface RawInvoiceApiResponse {
  id: string;
  invoiceNumber: string;
  invoiceDate: string; // ISO string
  requestOdo: number;
  actualOdo: number;
  remark: string | null;
  finishedDate: string; // ISO string
  totalAmount: number; // Decimal dari Prisma akan menjadi number di sini
  status: "DRAFT" | "PENDING" | "PAID" | "CANCELED" | "OVERDUE" | "REJECTED" | "SENT" | "PARTIALLY_PAID";
  workOrderId: string;
  vehicleId: string;
  accountantId: string | null;
  approvedById: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  // Relasi opsional jika disertakan dalam respons API
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  vehicle?: {
    id: string;
    licensePlate: string;
    vehicleMake: string;
    model: string;
  };
  accountant?: {
    id: string;
    name: string;
    position: string | null; // PASTIKAN INI ADA
  };
  approvedBy?: {
    id: string;
    name: string;
    position: string | null; // PASTIKAN INI ADA
  };
}

// Interface untuk data Invoice yang sudah diformat di frontend (dengan Date objects)
export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  requestOdo: number;
  actualOdo: number;
  remark: string | null;
  finishedDate: Date;
  totalAmount: number;
  status: "DRAFT" | "PENDING" | "PAID" | "CANCELED" | "OVERDUE" | "REJECTED" | "SENT" | "PARTIALLY_PAID";
  workOrderId: string;
  vehicleId: string;
  accountantId: string | null;
  approvedById: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relasi opsional
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  vehicle?: {
    id: string;
    licensePlate: string;
    vehicleMake: string;
    model: string;
  };
  accountant?: {
    id: string;
    name: string;
    position: string | null; // PASTIKAN INI ADA
  };
  approvedBy?: {
    id: string;
    name: string;
    position: string | null; // PASTIKAN INI ADA
  };
}

// CATATAN: InvoiceFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/invoice.ts menggunakan z.infer.
