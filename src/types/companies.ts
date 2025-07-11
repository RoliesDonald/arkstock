import * as z from "zod";

// Enum sesuai Prisma
export enum CompanyType {
  RENTAL = "RENTAL", // Perusahaan Rental Kendaraan
  CUSTOMER = "CUSTOMER", // Pelanggan Umum
  VENDOR = "VENDOR", // Pemasok/Vendor (misal: suku cadang, servis)
  INTERNAL = "INTERNAL", // Perusahaan internal (jika ada struktur multi-entitas)
  FLEET_COMPANY = "FLEET_COMPANY", // Perusahaan dengan armada sendiri (selain rental)
  SERVICE_MAINTENANCE = "SERVICE_MAINTENANCE", // Perusahaan penyedia jasa servis/perawatan
  RENTAL_COMPANY = "RENTAL_COMPANY", // Alias atau spesifikasi lebih lanjut untuk perusahaan rental
  CAR_USER = "CAR_USER", // Pengguna kendaraan (customer penyewa)
  OTHER = "OTHER", // Tambahkan kembali jika ini diperlukan di aplikasi Anda
  SUPPLIER = "SUPPLIER", // Pemasok atau vendor yang menyediakan barang/jasa
}

// Enum tambahan untuk UI (tidak ada di Prisma)
export enum CompanyStatus {
  ACTIVE = "ACTIVE", // Menggunakan casing yang sama dengan Prisma
  INACTIVE = "INACTIVE",
  PROSPECT = "PROSPECT",
  SUSPENDED = "SUSPENDED", // <-- DITAMBAHKAN: Menggantikan BLACKLISTED
  ON_HOLD = "ON_HOLD",
}

// Skema Zod untuk validasi form Company
export const companyFormSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().min(1, { message: "ID Perusahaan wajib diisi." }),
  companyName: z.string().min(1, { message: "Nama perusahaan wajib diisi." }),
  companyEmail: z
    .string()
    .email({ message: "Format email tidak valid." })
    .optional()
    .nullable()
    .or(z.literal("")),
  logo: z
    .string()
    .url({ message: "Format URL logo tidak valid." })
    .optional()
    .nullable()
    .or(z.literal("")),
  contact: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  taxRegistered: z.boolean(),
  companyType: z.nativeEnum(CompanyType, {
    required_error: "Tipe perusahaan wajib dipilih.",
  }),
  status: z.nativeEnum(CompanyStatus, {
    required_error: "Status perusahaan wajib dipilih.",
  }),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

// Interface Company lengkap (mencerminkan model Prisma)
export interface Company {
  id: string; // UUID
  companyId: string;
  companyName: string;
  companyEmail?: string | null;
  logo?: string | null;
  contact?: string | null;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  taxRegistered: boolean;
  companyType: CompanyType;
  status: CompanyStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relasi
  parentCompanyId?: string | null;
  parentCompany?: Company | null;
  childCompanies?: Company[] | null; // Relasi satu ke banyak
  vehiclesOwnned?: any[]; // Relasi ke kendaraan yang dimiliki
  vehiclesUsed?: any[]; // Ganti 'any' dengan tipe Vehicle[] jika sudah ada
  employees?: any[]; // Ganti 'any' dengan tipe Employee[] jika sudah ada
  customerWorkOrders?: any[]; // Ganti 'any' dengan tipe WorkOrder[] jika sudah ada
  carUserWorkOrders?: any[]; // Ganti 'any' dengan tipe WorkOrder[] jika sudah ada
  vendorWorkOrders?: any[]; // Ganti 'any' dengan tipe WorkOrder[] jika sudah ada
  suppliedPurchaseOrders?: any[]; // Ganti 'any' dengan tipe PurchaseOrder[] jika sudah ada
}
