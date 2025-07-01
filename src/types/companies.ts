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
  CHILD_COMPANY = "CHILD_COMPANY", // Pastikan underscore
  OTHER = "OTHER", // Tambahkan kembali jika ini diperlukan di aplikasi Anda
}

// Enum tambahan untuk UI (tidak ada di Prisma)
export enum CompanyStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PROSPECT = "Prospect",
  BLACKLISTED = "Blacklisted",
  ON_HOLD = "On Hold",
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
    .or(z.literal("")),
  logo: z
    .string()
    .url({ message: "Format URL logo tidak valid." })
    .optional()
    .or(z.literal("")),
  contact: z.string().min(1, { message: "Nomor telepon wajib diisi." }),
  address: z.string().min(1, { message: "Alamat wajib diisi." }),
  city: z.string().min(1, { message: "Kota wajib diisi." }),
  phone: z.string().min(1, { message: "Nomor telepon wajib diisi." }),
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
  status?: CompanyStatus;
  createdAt: string;
  updatedAt: string;
}
