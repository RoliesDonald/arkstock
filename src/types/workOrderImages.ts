export interface RawWorkOrderImageApiResponse {
  id: string;
  workOrderId: string;
  imageUrl: string;
  description: string | null;
  uploadedBy: string | null; // Ini akan menjadi ID karyawan
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  // Jika Anda ingin menyertakan detail karyawan yang mengunggah, tambahkan di sini
  // uploadedByEmployee?: {
  //   id: string;
  //   name: string;
  // };
}

// Interface untuk data WorkOrderImage yang sudah diformat di frontend (dengan Date objects)
export interface WorkOrderImage {
  id: string;
  workOrderId: string;
  imageUrl: string;
  description: string | null;
  uploadedBy: string | null; // Ini akan menjadi ID karyawan
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  // uploadedByEmployee?: {
  //   id: string;
  //   name: string;
  // };
}

// CATATAN: WorkOrderImageFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/workOrderImage.ts menggunakan z.infer.
