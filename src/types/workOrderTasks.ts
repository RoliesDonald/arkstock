export interface RawWorkOrderTaskApiResponse {
  id: string;
  workOrderId: string;
  taskName: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELED";
  assignedToId: string | null;
  startTime: string | null; // Akan berupa string ISO dari API
  endTime: string | null; // Akan berupa string ISO dari API
  createdAt: string; // Dari API, akan berupa string ISO
  updatedAt: string; // Dari API, akan berupa string ISO

  // Relasi opsional jika disertakan dalam respons API
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    position: string | null;
  };
}

// Interface untuk data WorkOrderTask yang sudah diformat di frontend (dengan Date objects)
export interface WorkOrderTask {
  id: string;
  workOrderId: string;
  taskName: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "CANCELED";
  assignedToId: string | null;
  startTime: Date | null; // Date object
  endTime: Date | null; // Date object
  createdAt: Date; // Date object
  updatedAt: Date; // Date object

  // Relasi opsional
  workOrder?: {
    id: string;
    workOrderNumber: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    position: string | null;
  };
}

// CATATAN: WorkOrderTaskFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/workOrderTask.ts menggunakan z.infer.
