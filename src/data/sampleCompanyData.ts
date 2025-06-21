// src/data/sampleCompanyData.ts
import { Company, CompanyStatus, CompanyType } from "@/types/companies";
// import { v4 as uuidv4 } from "uuid"; // Pastikan baris ini DIKOMENTARI atau DIHAPUS

export const companyData: Company[] = [
  {
    id: "comp-rental-001", // Menggunakan ID statis yang cocok dengan vehicleData
    companyId: "PTTC-003",
    companyName: "PT. Transportasi Cepat",
    address: "Jl. Merdeka No. 78, Surabaya",
    contact: "0312345678",
    companyEmail: "transport.cepat@example.com",
    logo: "https://placehold.co/100x100/FFB6C1/000000?text=PTTC",
    taxRegistered: true,
    companyType: CompanyType.RENTAL_COMPANY,
    status: CompanyStatus.ACTIVE,
    createdAt: "2022-05-01T11:00:00Z",
    updatedAt: "2024-06-12T10:10:00Z",
  },
  {
    id: "comp-rental-002", // Menggunakan ID statis yang cocok dengan vehicleData
    companyId: "CVS-004",
    companyName: "CV. Sewa Kendaraan Aman",
    address: "Jl. Kemerdekaan No. 1, Bandung",
    contact: "022123123",
    companyEmail: "info@sewaaman.com",
    logo: "https://placehold.co/100x100/ADD8E6/000000?text=CVSA",
    taxRegistered: true,
    companyType: CompanyType.RENTAL_COMPANY,
    status: CompanyStatus.ACTIVE,
    createdAt: "2021-03-01T09:00:00Z",
    updatedAt: "2024-06-19T11:00:00Z",
  },
  {
    id: "cust-001", // Menggunakan ID statis yang cocok dengan vehicleData
    companyId: "PTMB-001",
    companyName: "PT. Maju Bersama",
    address: "Jl. Raya Bogor No. 123, Jakarta",
    contact: "0211234567",
    companyEmail: "maju.bersama@example.com",
    logo: "https://placehold.co/100x100/A0E7E5/000000?text=PTMB",
    taxRegistered: true,
    companyType: CompanyType.CAR_USER, // Tipe CAR_USER untuk customer penyewa
    status: CompanyStatus.ACTIVE,
    createdAt: "2020-01-15T09:00:00Z",
    updatedAt: "2024-06-12T10:00:00Z",
  },
  {
    id: "cust-002", // Menggunakan ID statis yang cocok dengan vehicleData
    companyId: "KS-002",
    companyName: "Keluarga Santoso",
    address: "Jl. Pahlawan No. 10, Surabaya",
    contact: "0312222333",
    companyEmail: "santoso.family@example.com",
    logo: "",
    taxRegistered: false,
    companyType: CompanyType.CAR_USER, // Tipe CAR_USER untuk customer penyewa
    status: CompanyStatus.ACTIVE,
    createdAt: "2023-04-05T11:00:00Z",
    updatedAt: "2024-06-19T12:00:00Z",
  },
  {
    id: "comp-vendor-001",
    companyId: "BP-004",
    companyName: "Bengkel Prima",
    address: "Jl. Industri No. 10, Tangerang",
    contact: "0218765432",
    companyEmail: "prima.bengkel@example.com",
    logo: undefined,
    taxRegistered: false,
    companyType: CompanyType.VENDOR,
    status: CompanyStatus.ACTIVE,
    createdAt: "2023-01-10T14:00:00Z",
    updatedAt: "2024-06-12T10:15:00Z",
  },
  {
    id: "comp-sm-001",
    companyId: "PTSL-005",
    companyName: "PT. Solusi Logistik",
    address: "Jl. Pahlawan No. 200, Semarang",
    contact: "0245678901",
    companyEmail: "solusi.logistik@example.com",
    logo: undefined,
    taxRegistered: true,
    companyType: CompanyType.SERVICE_MAINTENANCE,
    status: CompanyStatus.PROSPECT,
    createdAt: "2024-02-05T15:00:00Z",
    updatedAt: "2024-06-12T10:20:00Z",
  },
  // Tambahkan perusahaan lain dari data awal Anda dengan ID statis yang sesuai
  {
    id: "comp-internal-001", // Contoh ID statis
    companyId: "INTERNAL-001",
    companyName: "PT. Internal Jaya",
    address: "Jl. Properti No. 1, Jakarta",
    contact: "021111222",
    companyEmail: "internal@example.com",
    taxRegistered: true,
    companyType: CompanyType.INTERNAL,
    status: CompanyStatus.ACTIVE,
    createdAt: "2020-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z",
  },
  {
    id: "comp-caruser-ptge-007", // Contoh ID statis
    companyId: "PTGE-007",
    companyName: "PT. Global Engineering",
    address: "Jl. Protokol No. 1, Jakarta Pusat",
    contact: "02199887766",
    companyEmail: "global.eng@example.com",
    logo: "https://placehold.co/100x100/87CEEB/000000?text=PTGE",
    taxRegistered: true,
    companyType: CompanyType.CAR_USER,
    status: CompanyStatus.ACTIVE,
    createdAt: "2021-11-11T13:00:00Z",
    updatedAt: "2024-06-12T10:30:00Z",
  },
  {
    id: "comp-caruser-cvts-008", // Contoh ID statis
    companyId: "CVTS-008",
    companyName: "CV. Tekno Sejahtera",
    address: "Jl. Kenangan Indah No. 7, Malang",
    contact: "0341778899",
    companyEmail: "tekno.sej@example.com",
    logo: undefined,
    taxRegistered: false,
    companyType: CompanyType.CAR_USER,
    status: CompanyStatus.ON_HOLD,
    createdAt: "2023-04-25T10:00:00Z",
    updatedAt: "2024-06-12T10:35:00Z",
  },
  {
    id: "comp-caruser-ptaw-009", // Contoh ID statis
    companyId: "PTAW-009",
    companyName: "PT. Armada Wisata",
    address: "Jl. Pariwisata No. 100, Bali",
    contact: "0361223344",
    companyEmail: "armada.wisata@example.com",
    logo: "https://placehold.co/100x100/90EE90/000000?text=PTAW",
    taxRegistered: true,
    companyType: CompanyType.CAR_USER,
    status: CompanyStatus.ACTIVE,
    createdAt: "2022-08-01T09:00:00Z",
    updatedAt: "2024-06-12T10:40:00Z",
  },
  {
    id: "comp-child-pdoc-010", // Contoh ID statis
    companyId: "PDOC-010",
    companyName: "PD. Otomotif Cerdas",
    address: "Jl. Teknologi No. 5, Batam",
    contact: "0778112233",
    companyEmail: "otomotif.cerdas@example.com",
    logo: undefined,
    taxRegistered: false,
    companyType: CompanyType.CHILD_COMPANY,
    status: CompanyStatus.BLACKLISTED,
    createdAt: "2020-09-01T16:00:00Z",
    updatedAt: "2024-06-12T10:45:00Z",
  },
];

export const getCompaniesByType = (
  type: CompanyType | CompanyType[]
): Company[] => {
  const typesArray = Array.isArray(type) ? type : [type];
  return companyData.filter((company) =>
    typesArray.includes(company.companyType)
  );
};
