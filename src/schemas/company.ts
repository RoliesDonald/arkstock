// src/schemas/company.ts
import { z } from "zod";
// Import Enums dari Prisma Client
import { CompanyType, CompanyStatus, CompanyRole } from "@prisma/client";

export const companyFormSchema = z.object({
  id: z.string().optional(), // ID opsional karena hanya ada saat edit
  companyId: z.string().min(1, "ID Perusahaan wajib diisi."),
  companyName: z.string().min(1, "Nama Perusahaan wajib diisi."),
  companyEmail: z.string().email("Format email tidak valid.").nullable().optional(),
  logo: z.string().url("Format URL logo tidak valid.").nullable().optional(),
  contact: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  taxRegistered: z.boolean(),
  companyType: z.nativeEnum(CompanyType, {
    errorMap: () => ({ message: "Tipe Perusahaan tidak valid." }),
  }),
  status: z.nativeEnum(CompanyStatus, {
    errorMap: () => ({ message: "Status Perusahaan tidak valid." }),
  }),
  companyRole: z.nativeEnum(CompanyRole, {
    errorMap: () => ({ message: "Role Perusahaan tidak valid." }),
  }),
  parentCompanyId: z.string().nullable().optional(), // ID perusahaan induk
});

// Ekspor tipe CompanyFormValues langsung dari skema Zod
export type CompanyFormValues = z.infer<typeof companyFormSchema>;
