// Interface untuk data mentah yang diterima langsung dari API
export interface RawLocationApiResponse {
  id: string;
  name: string;
  address: string | null;
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO
}

// Interface untuk data Location yang sudah diformat di frontend (dengan Date objects)
export interface Location {
  id: string;
  name: string;
  address: string | null;
  createdAt: Date; // Date object
  updatedAt: Date; // Date object
}
