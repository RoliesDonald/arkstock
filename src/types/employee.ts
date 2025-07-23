export interface RawEmployeeApiResponse {
  id: string;
  userId: string | null;
  name: string;
  email: string | null;
  password?: string; // Opsional dan tidak boleh di-fetch ke frontend
  photo: string | null;
  phone: string | null;
  address: string | null;
  position: string | null;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "FLEET_PIC"
    | "SERVICE_MANAGER"
    | "SERVICE_ADVISOR"
    | "FINANCE_MANAGER"
    | "FINANCE_STAFF"
    | "SALES_MANAGER"
    | "SALES_STAFF"
    | "ACCOUNTING_MANAGER"
    | "ACCOUNTING_STAFF"
    | "WAREHOUSE_MANAGER"
    | "WAREHOUSE_STAFF"
    | "PURCHASING_MANAGER"
    | "PURCHASING_STAFF"
    | "MECHANIC"
    | "USER"
    | "DRIVER"
    | "PIC";
  department: string | null;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";
  tanggalLahir: string | null; // ISO string
  tanggalBergabung: string | null; // ISO string
  gender: "MALE" | "FEMALE";
  companyId: string | null;

  // Relasi opsional jika disertakan dalam respons API
  company?: {
    id: string;
    companyName: string;
  };
}

// Interface untuk data Employee yang sudah diformat di frontend (dengan Date objects)
export interface Employee {
  id: string;
  userId: string | null;
  name: string;
  email: string | null;
  photo: string | null;
  phone: string | null;
  address: string | null;
  position: string | null;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "FLEET_PIC"
    | "SERVICE_MANAGER"
    | "SERVICE_ADVISOR"
    | "FINANCE_MANAGER"
    | "FINANCE_STAFF"
    | "SALES_MANAGER"
    | "SALES_STAFF"
    | "ACCOUNTING_MANAGER"
    | "ACCOUNTING_STAFF"
    | "WAREHOUSE_MANAGER"
    | "WAREHOUSE_STAFF"
    | "PURCHASING_MANAGER"
    | "PURCHASING_STAFF"
    | "MECHANIC"
    | "USER"
    | "DRIVER"
    | "PIC";
  department: string | null;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";
  tanggalLahir: Date | null;
  tanggalBergabung: Date | null;
  gender: "MALE" | "FEMALE";
  companyId: string | null;

  // Relasi opsional
  company?: {
    id: string;
    companyName: string;
  };
}

// CATATAN: EmployeeFormValues TIDAK didefinisikan di sini.
// Ia akan didefinisikan di src/schemas/employee.ts menggunakan z.infer.
