import { CompanyType, CompanyStatus, CompanyRole } from "@prisma/client";
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
  companyType: string; // Dari API, akan berupa string
  status: string; // Dari API, akan berupa string
  companyRole: string; // Dari API, akan berupa string
  parentCompanyId: string | null;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO
  parentCompany?: {
    id: string;
    companyName: string;
  };
}

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
  companyType: CompanyType; // Tipe Enum Prisma
  status: CompanyStatus; // Tipe Enum Prisma
  companyRole: CompanyRole; // Tipe Enum Prisma
  parentCompanyId: string | null;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object
  parentCompany?: {
    id: string;
    companyName: string;
  };
}

export interface CompanyNameAndId {
  id: string;
  companyName: string;
}
