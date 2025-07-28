// Interface untuk data mentah yang diterima langsung dari API
export interface RawServiceApiResponse {
  id: string;
  name: string;
  description: string | null;
  price: number; // Dari API, bisa berupa number atau string, kita asumsikan number
  category: string | null;
  subCategory: string | null;
  tasks: string[]; // Array of strings
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO
  // Relasi untuk requiredSpareParts tidak langsung di sini, akan di-include jika diperlukan
  // requiredSpareParts?: { sparePartId: string; quantity: number; sparePart: { id: string; partName: string; unit: string; price: number; } }[];
}

// Interface untuk data Service yang sudah diformat di frontend (dengan Date objects)
export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  subCategory: string | null;
  tasks: string[]; // Array of strings
  createdAt: Date; // Date object
  updatedAt: Date; // Date object
  // requiredSpareParts?: { sparePartId: string; quantity: number; sparePart: { id: string; partName: string; unit: string; price: number; } }[];
}
