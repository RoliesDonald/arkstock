import * as z from "zod";

export enum CompanyType {
  CUSTOMER = "CUSTOMER",
  VENDOR = "VENDOR",
  RENTAL_COMPANY = "RENTAL_COMPANY",
  SERVICE_MAINTENANCE = "SERVICE_MAINTENANCE",
  FLEET_COMPANY = "FLEET_COMPANY",
  INTERNAL = "INTERNAL",
  CAR_USER = "CAR_USER",
  CHILD_COMPANY = "CHILD_COMPANY",
  SUPPLIER = "SUPPLIER",
}

export enum CompanyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PROSPECT = "PROSPECT",
  SUSPENDED = "SUSPENDED",
  ON_HOLD = "ON_HOLD",
}

export enum CompanyRole {
  MAIN_COMPANY = "MAIN_COMPANY",
  CHILD_COMPANY = "CHILD_COMPANY",
}

// Interface untuk data Company yang akan disimpan di Redux state (tanggal sebagai string)
export interface Company {
  id: string;
  companyId: string;
  companyName: string;
  companyEmail: string | null;
  logo: string | null;
  contact: string | null;
  address: string | null;
  city: string | null;
  taxRegistered: boolean;
  companyType: CompanyType;
  status: CompanyStatus;
  parentCompanyId: string | null;
  createdAt: string;
  updatedAt: string;
  parentCompany?: Company | null;
  childCompanies?: Company[];
}

// Interface untuk data mentah Company yang diterima dari API (tanggal sebagai STRING)
export interface RawCompanyApiResponse {
  id: string;
  companyId: string;
  companyName: string;
  companyEmail: string | null;
  logo: string | null;
  contact: string | null;
  address: string | null;
  city: string | null;
  taxRegistered: boolean;
  companyType: CompanyType;
  status: CompanyStatus;
  parentCompanyId: string | null;
  createdAt: string;
  updatedAt: string;
  parentCompany?: RawCompanyApiResponse | null;
  childCompanies?: RawCompanyApiResponse[];
}

export interface CompanyNameAndId {
  id: string;
  companyName: string;
}

export const companyFormSchema = z
  .object({
    id: z.string().uuid().optional(),
    companyId: z.string().min(1, "ID Perusahaan wajib diisi."),
    companyName: z.string().min(1, "Nama Perusahaan wajib diisi."),
    companyEmail: z.string().email("Email tidak valid.").nullable().optional(),
    logo: z.string().nullable().optional(),
    contact: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    // PENTING: Gunakan z.preprocess untuk memastikan taxRegistered selalu boolean
    taxRegistered: z.preprocess(
      (val) => (val === undefined || val === null ? false : val), // Ubah undefined/null menjadi false
      z.boolean() // Kemudian validasi sebagai boolean
    ),
    companyType: z.nativeEnum(CompanyType, {
      required_error: "Tipe Perusahaan wajib dipilih.",
    }),
    status: z.nativeEnum(CompanyStatus, {
      required_error: "Status wajib dipilih.",
    }),
    companyRole: z.nativeEnum(CompanyRole, {
      required_error: "Role Perusahaan wajib dipilih.",
    }),
    parentCompanyId: z
      .string()
      .uuid("ID Perusahaan Induk tidak valid.")
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.companyRole === CompanyRole.CHILD_COMPANY) {
      if (!data.parentCompanyId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ID Perusahaan wajib di isi",
          path: ["parentCompanyId"],
        });
      }
    } else if (data.companyRole === CompanyRole.MAIN_COMPANY) {
      if (data.parentCompanyId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Perusahaan utama tidak boleh memiliki ID Perusahaan Induk",
          path: ["parentCompanyId"],
        });
      }
    }
  });

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
