import { Company, CompanyStatus, CompanyType } from "@/types/companies";
import { UserRole, UserStatus } from "@/types/user";

// --- ENUMS (Disesuaikan dari skema database) ---
export enum WoProgressStatus {
  DRAFT = "Draft",
  REQUESTED = "Requested",
  PENDING_APPROVAL_RENTAL = "Pending by Rental",
  PENDING_VENDOR_ASSIGN = "Pending by Vendor",
  ON_PROCESS = "On Process",
  WAITING_PART = "Waiting Part",
  WAITING_ESTIMATION_APPROVAL = "Waiting Estimation",
  FINISHED = "Finished",
  INVOICED = "Invoiced",
  NEW = "New",
  CANCELED = "Canceled",
  REJECTED = "Rejected",
}

export enum WoPriorityType {
  NORMAL = "Normal",
  URGENT = "Urgent",
  EMERGENCY = "Emergency",
}

export enum PartVariant {
  OEM = "oem",
  AFTERMARKET = "aftermarket",
  GENUINE = "genuine", // Mengganti "gbox" dengan "genuine"
}

export enum PurchaseOrderStatus {
  DRAFT = "Draft",
  PENDING_APPROVAL = "Pending Approval",
  APPROVED = "Approved",
  ORDERED = "Ordered",
  SHIPPED = "Shipped",
  RECEIVED_PARTIAL = "Received Partial",
  RECEIVED_FULL = "Received Full",
  CANCELED = "Canceled",
  REJECTED = "Rejected",
}

// --- INTERFACES / TYPES ---

export interface WorkOrder {
  woNumber: string;
  woMaster: string; // woMasterNumber
  date: Date; // requestDate
  vehicleMake: string;
  model: string;
  trimLevel: string;
  licensePlate: string;
  vinNum: string;
  engineNum: string;
  settledOdo: number; // odometer
  customer: string; // requestorCompany.name
  carUser: string; // carUserCompany.name
  vendor: string; // assignedVendor.name
  remark: string; // complaint
  mechanic: string; // mechanic.name
  schedule: Date; // scheduleDate
  vehicleLocation: string;
  notes?: string;
  driver?: string; // driver.name
  driverContact?: string; // driver.phone (jika disimpan di sini)
  approvedBy?: string; // approvingEmployeeWO.name
  custPicContact?: string; // (jika disimpan di sini, sebaiknya di Employee.phone)
  requestBy?: string; // requestingEmployee.name
  progresStatus: WoProgressStatus;
  priorityType: WoPriorityType;
}

export interface Vehicle {
  id: number;
  licensePlate: string;
  make: string;
  model: string;
  trimLevel?: string;
  modelYear?: number;
  bodyStyle?: string;
  color?: string;
  // vinNum?: string; // Ditambahkan dari WO
  // engineNum?: string; // Ditambahkan dari WO
}

export interface SparePart {
  id: number;
  partNumber: string;
  sku?: string;
  partName: string;
  variant: PartVariant;
  make?: string;
  suitable_for_vehicles?: string[]; // Jika ini adalah string[]
  price: number; // Ubah ke number
  unit: string;
}

export interface User {
  id: number;
  userId?: string;
  name: string;
  email?: string;
  photo?: string;
  phone?: string;
  role: UserRole; // Menggunakan enum
  department?: string; // 'departement' diubah menjadi 'department'
  companyName?: string; // company.name (untuk display)
  address?: string;
  status: UserStatus; // Menggunakan enum
}

//============== User Dummy Data ===============
export const userData: User[] = [
  {
    id: 1,
    userId: "EMP001",
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@example.com",
    phone: "081234567890",
    status: UserStatus.ON_DUTY,
    role: UserRole.MECHANIC,
    department: "Workshop",
    companyName: "PT. Bengkel Maju",
    address: "Jl. Merdeka No. 10, Jakarta",
  },
  {
    id: 2,
    userId: "EMP002",
    name: "Budi Santoso",
    email: "budi.santoso@example.com",
    phone: "081298765432",
    status: UserStatus.OFF_DUTY,
    role: UserRole.SERVICE_ADVISOR,
    department: "Customer Service",
    companyName: "PT. Bengkel Maju",
    address: "Jl. Diponegoro No. 5, Surabaya",
  },
  {
    id: 3,
    userId: "EMP003",
    name: "Citra Dewi",
    email: "citra.dewi@example.com",
    phone: "081311223344",
    status: UserStatus.ON_LEAVE,
    role: UserRole.ACCOUNTING_STAFF,
    department: "Finance",
    companyName: "PT. Bengkel Maju",
    address: "Jl. Sudirman No. 20, Bandung",
  },
  {
    id: 4,
    userId: "EMP004",
    name: "Denny Firmansyah",
    email: "denny.f@example.com",
    phone: "087855667788",
    status: UserStatus.ON_DUTY,
    role: UserRole.WAREHOSE_STAFF,
    department: "Warehouse",
    companyName: "PT. Bengkel Maju",
    address: "Jl. Gatot Subroto No. 30, Semarang",
  },
  {
    id: 5,
    userId: "EMP005",
    name: "Eka Putri",
    email: "eka.p@example.com",
    phone: "085299887766",
    status: UserStatus.ON_DUTY,
    role: UserRole.ADMIN,
    department: "IT",
    companyName: "PT. Bengkel Maju",
    address: "Jl. Thamrin No. 40, Yogyakarta",
  },
  {
    id: 6,
    userId: "EMP006",
    name: "Faisal Rahman",
    email: "faisal.r@example.com",
    phone: "081122334455",
    status: UserStatus.SUSPENDED,
    role: UserRole.DRIVER,
    department: "Logistics",
    companyName: "PT. Transportasi Jaya",
    address: "Jl. Pahlawan No. 50, Medan",
  },
  {
    id: 7,
    userId: "EMP007",
    name: "Gina Lestari",
    email: "gina.l@example.com",
    phone: "081900112233",
    status: UserStatus.ON_DUTY,
    role: UserRole.PURCHASING_MANAGER,
    department: "Procurement",
    companyName: "PT. Bengkel Maju",
    address: "Jl. Asia Afrika No. 60, Palembang",
  },
  {
    id: 8,
    userId: "EMP008",
    name: "Hadi Kusuma",
    email: "hadi.k@example.com",
    phone: "082144556677",
    status: UserStatus.ON_DUTY,
    role: UserRole.ADMIN,
    department: "Management",
    companyName: "PT. Bengkel Maju",
    address: "Jl. Cendrawasih No. 70, Makassar",
  },
  {
    id: 9,
    userId: "EMP009",
    name: "Indah Sari",
    email: "indah.s@example.com",
    phone: "085788990011",
    status: UserStatus.OFF_DUTY,
    role: UserRole.PIC,
    department: "Client Relations",
    companyName: "PT. Cepat Tanggap",
    address: "Jl. Melati No. 80, Denpasar",
  },
  {
    id: 10,
    userId: "EMP010",
    name: "Joko Susilo",
    email: "joko.s@example.com",
    phone: "081277665544",
    status: UserStatus.ON_DUTY,
    role: UserRole.MECHANIC,
    department: "Workshop",
    companyName: "PT. Bengkel Maju",
    address: "Jl. Raya No. 90, Jakarta",
  },
];

//================= Invoice sample data ===============
export const companyData: Company[] = [
  {
    id: "uuid-comp-001", // Contoh UUID
    companyId: "MB001",
    companyName: "PT. Maju Bersama",
    address: "Jl. Raya Bogor No. 123, Jakarta",
    contact: "0211234567",
    companyEmail: "maju.bersama@example.com",
    logo: "https://placehold.co/150x150/lightblue/black?text=MB",
    taxRegistered: true,
    companyType: CompanyType.CUSTOMER,
    status: CompanyStatus.ACTIVE, // Status FE
    createdAt: new Date("2020-01-15T09:00:00Z"),
    updatedAt: new Date("2024-06-12T10:00:00Z"),
  },
  {
    id: "uuid-comp-002",
    companyId: "JA002",
    companyName: "CV. Jaya Abadi",
    address: "Jl. Asia Afrika No. 45, Bandung",
    contact: "0229876543",
    companyEmail: "jaya.abadi@example.com",
    logo: "https://placehold.co/150x150/lightgreen/black?text=JA",
    taxRegistered: false,
    companyType: CompanyType.VENDOR,
    status: CompanyStatus.ACTIVE,
    createdAt: new Date("2021-03-20T10:30:00Z"),
    updatedAt: new Date("2024-06-12T10:05:00Z"),
  },
  {
    id: "uuid-comp-003",
    companyId: "TC003",
    companyName: "PT. Transportasi Cepat",
    address: "Jl. Merdeka No. 78, Surabaya",
    contact: "0312345678",
    companyEmail: "transport.cepat@example.com",
    logo: "https://placehold.co/150x150/lightcoral/black?text=TC",
    taxRegistered: true,
    companyType: CompanyType.CAR_USER, // Menggunakan CAR_USER
    status: CompanyStatus.ACTIVE,
    createdAt: new Date("2022-05-01T11:00:00Z"),
    updatedAt: new Date("2024-06-12T10:10:00Z"),
  },
  {
    id: "uuid-comp-004",
    companyId: "BP004",
    companyName: "Bengkel Prima",
    address: "Jl. Industri No. 10, Tangerang",
    contact: "0218765432",
    companyEmail: "prima.bengkel@example.com",
    logo: "https://placehold.co/150x150/lightblue/black?text=BP",
    taxRegistered: false,
    companyType: CompanyType.INTERNAL, // Menggunakan INTERNAL jika ini workshop internal
    status: CompanyStatus.ACTIVE,
    createdAt: new Date("2023-01-10T14:00:00Z"),
    updatedAt: new Date("2024-06-12T10:15:00Z"),
  },
  {
    id: "uuid-comp-005",
    companyId: "SL005",
    companyName: "PT. Solusi Logistik",
    address: "Jl. Pahlawan No. 200, Semarang",
    contact: "0245678901",
    companyEmail: "solusi.logistik@example.com",
    logo: undefined,
    taxRegistered: true,
    companyType: CompanyType.CUSTOMER,
    status: CompanyStatus.BLACKLISTED,
    createdAt: new Date("2024-02-05T15:00:00Z"),
    updatedAt: new Date("2024-06-12T10:20:00Z"),
  },
  {
    id: "uuid-comp-006",
    companyId: "BP006",
    companyName: "UD. Baja Perkasa",
    address: "Jl. Utama No. 50, Yogyakarta",
    contact: "0274112233",
    companyEmail: "baja.perkasa@example.com",
    logo: "https://placehold.co/150x150/lightgray/black?text=BPRK",
    taxRegistered: false,
    companyType: CompanyType.SUPPLIER,
    status: CompanyStatus.INACTIVE,
    createdAt: new Date("2019-07-01T08:00:00Z"),
    updatedAt: new Date("2024-06-12T10:25:00Z"),
  },
  {
    id: "uuid-comp-007",
    companyId: "GE007",
    companyName: "PT. Global Engineering",
    address: "Jl. Protokol No. 1, Jakarta Pusat",
    contact: "02199887766",
    companyEmail: "global.eng@example.com",
    logo: "https://placehold.co/150x150/lightgreen/black?text=GE",
    taxRegistered: true,
    companyType: CompanyType.CUSTOMER,
    status: CompanyStatus.ACTIVE,
    createdAt: new Date("2021-11-11T13:00:00Z"),
    updatedAt: new Date("2024-06-12T10:30:00Z"),
  },
  {
    id: "uuid-comp-008",
    companyId: "TS008",
    companyName: "CV. Tekno Sejahtera",
    address: "Jl. Kenangan Indah No. 7, Malang",
    contact: "0341778899",
    companyEmail: "tekno.sej@example.com",
    logo: undefined,
    taxRegistered: false,
    companyType: CompanyType.VENDOR,
    status: CompanyStatus.ON_HOLD,
    createdAt: new Date("2023-04-25T10:00:00Z"),
    updatedAt: new Date("2024-06-12T10:35:00Z"),
  },
  {
    id: "uuid-comp-009",
    companyId: "AW009",
    companyName: "PT. Armada Wisata",
    address: "Jl. Pariwisata No. 100, Bali",
    contact: "0361223344",
    companyEmail: "armada.wisata@example.com",
    logo: "https://placehold.co/150x150/lightblue/black?text=AW",
    taxRegistered: true,
    companyType: CompanyType.CAR_USER, // Menggunakan CAR_USER
    status: CompanyStatus.ACTIVE,
    createdAt: new Date("2022-08-01T09:00:00Z"),
    updatedAt: new Date("2024-06-12T10:40:00Z"),
  },
  {
    id: "uuid-comp-010",
    companyId: "OC010",
    companyName: "PD. Otomotif Cerdas",
    address: "Jl. Teknologi No. 5, Batam",
    contact: "0778112233",
    companyEmail: "otomotif.cerdas@example.com",
    logo: undefined,
    taxRegistered: false,
    companyType: CompanyType.INTERNAL, // Menggunakan INTERNAL
    status: CompanyStatus.BLACKLISTED,
    createdAt: new Date("2020-09-01T16:00:00Z"),
    updatedAt: new Date("2024-06-12T10:45:00Z"),
  },
];

// Definisi interface untuk setiap item suku cadang di faktur
export interface InvoiceItem {
  itemName: string; // Nama suku cadang (misal: "Kampas Rem Depan")
  partNumber: string; // Nomor suku cadang (misal: "BRK-FRT-001")
  quantity: number; // Kuantitas suku cadang
  unit: string; // Satuan (misal: "Set", "Pcs")
  unitPrice: number; // Harga per satuan suku cadang
  totalPrice: number; // Total harga untuk item ini (quantity * unitPrice)
}

// Definisi interface untuk setiap item layanan di faktur
export interface InvoiceService {
  serviceName: string; // Nama layanan (misal: "Jasa Penggantian Kampas Rem")
  description?: string; // Deskripsi layanan (opsional)
  price: number; // Harga layanan
}

// Definisi interface untuk keseluruhan objek Invoice
export interface Invoice {
  id: string; // ID unik untuk setiap faktur (sering ditambahkan oleh database)
  invNum: string; // Nomor faktur (invoiceNumber)
  woMaster: string; // Nomor WO Master dari Work Order terkait
  date: Date; // Tanggal terbit faktur (invoiceDate)
  vehicleMake: string; // Merk kendaraan (untuk display)
  model: string; // Model kendaraan (untuk display)
  trimLevel?: string; // Tingkat trim kendaraan (opsional, untuk display)
  licensePlate: string; // Plat nomor kendaraan (untuk display)
  vinNum?: string; // Nomor VIN kendaraan (opsional, untuk display)
  requestOdo: number; // Odometer saat request WO
  actualdOdo: number; // Odometer aktual saat pengerjaan
  engineNum?: string; // Nomor mesin kendaraan (opsional, untuk display)
  customer: string; // Nama pelanggan/perusahaan pemohon
  carUser: string; // Nama pengguna mobil/perusahaan pengguna
  remark: string; // Ringkasan keluhan/pekerjaan
  mechanic?: string; // Nama mekanik yang mengerjakan (opsional)

  // Perubahan penting: Menggunakan array dari objek untuk daftar suku cadang dan layanan
  sparePartList?: InvoiceItem[]; // Daftar suku cadang yang digunakan
  servicesList?: InvoiceService[]; // Daftar layanan yang diberikan

  finished: Date; // Tanggal pekerjaan selesai (finishedDate)
  approvedBy?: string; // Nama karyawan yang menyetujui faktur (opsional)
  totalAmount: number; // Total keseluruhan jumlah faktur (sum dari sparePartList dan servicesList)

  // Properti tambahan yang sering ada pada data dari API
  createdAt?: string; // Timestamp kapan faktur dibuat
  updatedAt?: string; // Timestamp kapan faktur terakhir diperbarui
  status: string; // Status faktur (contoh: "Paid", "Pending", "Overdue")
}

// Data sampel invoice
export const invoiceData: Invoice[] = [
  {
    id: "inv-2025-001",
    invNum: "INV 2025/5009344",
    woMaster: "WO 2025/27454",
    date: new Date("2025-06-08"),
    vehicleMake: "Toyota",
    model: "Avanza",
    trimLevel: "G 1.3 M/T",
    licensePlate: "L 1234 XY",
    vinNum: "MHKF123456V678901",
    requestOdo: 120000,
    actualdOdo: 120000,
    engineNum: "K3-VE-901234567",
    customer: "PT. Rental Mobil Sejahtera",
    carUser: "PT. Rental Mobil Sejahtera",
    remark: "Bunyi berdecit saat mengerem",
    mechanic: "Vino Akbar",
    sparePartList: [
      {
        itemName: "Kampas Rem Depan",
        partNumber: "BRK-FRT-AVZ",
        quantity: 1,
        unit: "Set",
        unitPrice: 500000,
        totalPrice: 500000,
      },
      {
        itemName: "Minyak Rem",
        partNumber: "OIL-BRK-001",
        quantity: 1,
        unit: "Botol",
        unitPrice: 75000,
        totalPrice: 75000,
      },
    ],
    servicesList: [
      {
        serviceName: "Jasa Penggantian Kampas Rem",
        price: 250000,
      },
      {
        serviceName: "Bleeding Sistem Rem",
        price: 100000,
      },
    ],
    finished: new Date("2025-06-03"),
    approvedBy: "Manajer Armada",
    totalAmount: 925000, // 500k + 75k + 250k + 100k
    createdAt: new Date("2025-06-08T10:00:00Z").toISOString(),
    status: "Paid",
  },
  {
    id: "inv-2025-002",
    invNum: "INV 2025/5009345",
    woMaster: "WO 2025/27455",
    date: new Date("2025-06-09"),
    vehicleMake: "Honda",
    model: "Mobilio",
    trimLevel: "E CVT",
    licensePlate: "B 5678 CD",
    vinNum: "MHKF987654H321098",
    requestOdo: 80000,
    actualdOdo: 80000,
    engineNum: "L15Z1-123456789",
    customer: "CV. Usaha Mandiri",
    carUser: "Bapak Budi",
    remark: "Servis rutin 80.000 KM",
    mechanic: "Siti Rahma",
    sparePartList: [
      {
        itemName: "Filter Oli",
        partNumber: "FIL-OIL-MOB",
        quantity: 1,
        unit: "Pcs",
        unitPrice: 80000,
        totalPrice: 80000,
      },
      {
        itemName: "Oli Mesin 4L",
        partNumber: "OIL-ENG-SYN",
        quantity: 1,
        unit: "Pcs",
        unitPrice: 350000,
        totalPrice: 350000,
      },
    ],
    servicesList: [
      {
        serviceName: "Jasa Servis Berkala",
        price: 300000,
      },
    ],
    finished: new Date("2025-06-09"),
    approvedBy: "Manajer Operasional",
    totalAmount: 730000, // 80k + 350k + 300k
    createdAt: new Date("2025-06-09T14:30:00Z").toISOString(),
    status: "Pending",
  },
  {
    id: "inv-2025-003",
    invNum: "INV 2025/5009346",
    woMaster: "WO 2025/27456",
    date: new Date("2025-06-01"),
    vehicleMake: "Suzuki",
    model: "Ertiga",
    trimLevel: "GL M/T",
    licensePlate: "D 7777 EF",
    vinNum: "MHKF000111A222333",
    requestOdo: 65000,
    actualdOdo: 65000,
    engineNum: "K15B-998877665",
    customer: "PT. Logistik Cepat",
    carUser: "Ibu Desi",
    remark: "Perbaikan AC kurang dingin",
    mechanic: "Agus Santoso",
    sparePartList: [
      {
        itemName: "Refrigeran AC",
        partNumber: "REF-AC-R134A",
        quantity: 1,
        unit: "Kg",
        unitPrice: 150000,
        totalPrice: 150000,
      },
    ],
    servicesList: [
      {
        serviceName: "Jasa Perbaikan AC",
        price: 400000,
      },
      {
        serviceName: "Pembersihan Kondensor AC",
        price: 100000,
      },
    ],
    finished: new Date("2025-06-02"),
    approvedBy: "PIC Perusahaan",
    totalAmount: 650000, // 150k + 400k + 100k
    createdAt: new Date("2025-06-01T09:15:00Z").toISOString(),
    status: "Overdue",
  },
];

//============== Estimation sample data ===============

export interface EstimationItem {
  itemName: string; // Ini akan menjadi sparePart.name
  partNumber: string; // sparePart.partNumber
  quantity: number;
  unit: string; // sparePart.unit
  unitPrice: number;
  totalPrice: number;
}

export interface Estimation {
  invNum: string; // estimationNumber
  woMaster: string; // woMasterNumber dari WO
  date: Date; // estimationDate
  vehicleMake: string;
  model: string;
  trimLevel?: string;
  licensePlate: string;
  vinNum?: string;
  requestOdo: number;
  actualdOdo: number;
  engineNum?: string;
  customer: string;
  carUser: string;
  remark: string;
  mechanic?: string;
  reqSparePartList?: string[]; // Ini bisa jadi string[] untuk list nama, atau array EstimationItem
  reqServicesList?: string[]; // Ini bisa jadi string[] untuk list nama, atau array EstimationService
  finished: Date; // estimatedFinishDate
  approvedBy?: string; // approvingEmployeeEstimation.name
}

export interface PurchaseOrderItem {
  itemName: string;
  partNumber: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  poNum: string; // poNumber
  poDate: Date;
  supplierName: string; // supplierCompany.name
  supplierContact?: string; // supplierCompany.contact
  deliveryAddress?: string;
  orderItems: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  deliveryDate?: Date;
  status: PurchaseOrderStatus;
  requestedBy?: string; // requestingEmployeePO.name
  approvedBy?: string; // approvingEmployeePO.name
  remark?: string;
}

// --- DATA ARRAYS ---

export const workOrderData: WorkOrder[] = [
  {
    woNumber: "WO 2025/5009324",
    woMaster: "WO 2025/27434",
    date: new Date("2025-05-31"), // Menggunakan objek Date
    vehicleMake: "Toyota",
    model: "Camry",
    trimLevel: "Premium",
    licensePlate: "B 9342 DKT",
    vinNum: "MHF1234567B567890",
    engineNum: "3ZR-FE0011223",
    settledOdo: 140000,
    customer: "PT. Dipo Star Finance",
    carUser: "PT. SPX express",
    vendor: "PT. Lawak Abadi Sejahtera",
    remark: "Mesin tidak mau starter",
    mechanic: "Arip Wong Sabar",
    schedule: new Date("2025-06-02"), // Menggunakan objek Date
    vehicleLocation: "DC Shoppe Rungkut",
    notes: "Disarankan mengganti shock absorber depan",
    driver: "Cak Cuk",
    driverContact: "081543239483",
    approvedBy: "PIC Vendor",
    custPicContact: "081543239483",
    requestBy: "PIC Customer",
    progresStatus: WoProgressStatus.ON_PROCESS, // Menggunakan enum
    priorityType: WoPriorityType.EMERGENCY, // Menggunakan enum
  },
  {
    woNumber: "WO 2025/5009324",
    woMaster: "WO 2025/27434",
    date: new Date("2025-05-31"),
    vehicleMake: "Toyota",
    model: "Camry",
    trimLevel: "Premium",
    licensePlate: "B 9342 DKT",
    vinNum: "MHF1234567B567890",
    engineNum: "3ZR-FE0011223",
    settledOdo: 140000,
    customer: "PT. Dipo Star Finance",
    carUser: "PT. SPX express",
    vendor: "PT. Lawak Abadi Sejahtera",
    remark: "Mesin tidak mau starter",
    mechanic: "Arip Wong Sabar",
    schedule: new Date("2025-06-02"),
    vehicleLocation: "DC Shopee Rungkut",
    notes: "Disarankan mengganti shock absorber depan",
    driver: "Cak Cuk",
    driverContact: "081543239483",
    approvedBy: "PIC Vendor",
    custPicContact: "081543239483",
    requestBy: "PIC Customer",
    progresStatus: WoProgressStatus.ON_PROCESS,
    priorityType: WoPriorityType.EMERGENCY,
  },
  {
    woNumber: "WO 2025/5009325",
    woMaster: "WO 2025/27435",
    date: new Date("2025-06-01"),
    vehicleMake: "Honda",
    model: "Civic",
    trimLevel: "RS",
    licensePlate: "D 1234 ABC",
    vinNum: "ABC1234567H123456",
    engineNum: "L15B70011224",
    settledOdo: 85000,
    customer: "PT. Maju Mundur Sentosa",
    carUser: "PT. Gojek Indonesia",
    vendor: "Bengkel Jaya Abadi",
    remark: "Rem bunyi saat diinjak",
    mechanic: "Budi Santoso",
    schedule: new Date("2025-06-03"),
    vehicleLocation: "Kantor Pusat Gojek Jakarta",
    notes: "Perlu penggantian kampas rem",
    driver: "Agus Driver",
    driverContact: "081234567890",
    approvedBy: "Manajer Operasional",
    custPicContact: "081234567891",
    requestBy: "PIC Gojek",
    progresStatus: WoProgressStatus.PENDING_APPROVAL_RENTAL,
    priorityType: WoPriorityType.URGENT,
  },
  {
    woNumber: "WO 2025/5009326",
    woMaster: "WO 2025/27436",
    date: new Date("2025-06-01"),
    vehicleMake: "Mitsubishi",
    model: "Xpander",
    trimLevel: "Ultimate",
    licensePlate: "N 5678 XYZ",
    vinNum: "MITS1234567X789012",
    engineNum: "4A910011225",
    settledOdo: 45000,
    customer: "PT. Sejahtera Jaya",
    carUser: "PT. Grab Indonesia",
    vendor: "Karya Mandiri Service",
    remark: "AC tidak dingin",
    mechanic: "Citra Dewi",
    schedule: new Date("2025-06-04"),
    vehicleLocation: "Depo Grab Surabaya",
    notes: "Disarankan cek freon dan kondensor",
    driver: "Siti Sopir",
    driverContact: "085678901234",
    approvedBy: "PIC Grab",
    custPicContact: "085678901235",
    requestBy: "Admin Grab",
    progresStatus: WoProgressStatus.INVOICED,
    priorityType: WoPriorityType.NORMAL,
  },
  {
    woNumber: "WO 2025/5009327",
    woMaster: "WO 2025/27437",
    date: new Date("2025-06-02"),
    vehicleMake: "Suzuki",
    model: "Ertiga",
    trimLevel: "Sport",
    licensePlate: "L 9012 PQR",
    vinNum: "SUZ1234567E345678",
    engineNum: "K15B0011226",
    settledOdo: 60000,
    customer: "PT. Logistik Cepat",
    carUser: "PT. JNE Express",
    vendor: "Bengkel Prima Motor",
    remark: "Lampu depan mati sebelah",
    mechanic: "Dwi Cahyono",
    schedule: new Date("2025-06-05"),
    vehicleLocation: "Gudang JNE Gresik",
    notes: "Perlu penggantian bohlam",
    driver: "Rudi Kirim",
    driverContact: "087812345678",
    approvedBy: "PIC JNE",
    custPicContact: "087812345679",
    requestBy: "Manajer Gudang",
    progresStatus: WoProgressStatus.ON_PROCESS,
    priorityType: WoPriorityType.NORMAL,
  },
  {
    woNumber: "WO 2025/5009328",
    woMaster: "WO 2025/27438",
    date: new Date("2025-06-02"),
    vehicleMake: "Daihatsu",
    model: "Sigra",
    trimLevel: "R Deluxe",
    licensePlate: "AG 3456 MNO",
    vinNum: "DAI1234567S901234",
    engineNum: "1NR-VE0011227",
    settledOdo: 72000,
    customer: "PT. Transportasi Utama",
    carUser: "PT. Bluebird Group",
    vendor: "Service Auto Cepat",
    remark: "Ban kempes",
    mechanic: "Eka Putri",
    schedule: new Date("2025-06-03"),
    vehicleLocation: "Pool Bluebird Malang",
    notes: "Ada paku di ban belakang kanan",
    driver: "Wati Taksi",
    driverContact: "089678901234",
    approvedBy: "Supervisor Pool",
    custPicContact: "089678901235",
    requestBy: "Driver Taksi",
    progresStatus: WoProgressStatus.ON_PROCESS,
    priorityType: WoPriorityType.EMERGENCY,
  },
  {
    woNumber: "WO 2025/5009329",
    woMaster: "WO 2025/27439",
    date: new Date("2025-06-03"),
    vehicleMake: "Hyundai",
    model: "Creta",
    trimLevel: "Prime",
    licensePlate: "B 7890 UVW",
    vinNum: "HYU1234567C567890",
    engineNum: "G4FL0011228",
    settledOdo: 15000,
    customer: "PT. Solusi Otomotif",
    carUser: "PT. Avis Rental",
    vendor: "Bengkel Mitra Jaya",
    remark: "Mesin bergetar saat idle",
    mechanic: "Fandi Rahman",
    schedule: new Date("2025-06-06"),
    vehicleLocation: "Bandara Soekarno-Hatta",
    notes: "Perlu cek busi dan filter udara",
    driver: "Rizky Rental",
    driverContact: "081122334455",
    approvedBy: "PIC Rental",
    custPicContact: "081122334456",
    requestBy: "PIC Avis",
    progresStatus: WoProgressStatus.NEW,
    priorityType: WoPriorityType.URGENT,
  },
  {
    woNumber: "WO 2025/5009330",
    woMaster: "WO 2025/27440",
    date: new Date("2025-06-03"),
    vehicleMake: "Wuling",
    model: "Confero",
    trimLevel: "S",
    licensePlate: "B 1011 FGH",
    vinNum: "WUL1234567C101112",
    engineNum: "LSI0011229",
    settledOdo: 90000,
    customer: "PT. Armada Niaga",
    carUser: "PT. Wahana Express",
    vendor: "Bengkel Amanah",
    remark: "Kaca jendela tidak bisa naik",
    mechanic: "Gilang Pratama",
    schedule: new Date("2025-06-07"),
    vehicleLocation: "Depo Wahana Jakarta",
    notes: "Motor power window rusak",
    driver: "Joko Kurir",
    driverContact: "081298765432",
    approvedBy: "Kepala Depo",
    custPicContact: "081298765433",
    requestBy: "Admin Depo",
    progresStatus: WoProgressStatus.CANCELED,
    priorityType: WoPriorityType.NORMAL,
  },
  {
    woNumber: "WO 2025/5009331",
    woMaster: "WO 2025/27441",
    date: new Date("2025-06-04"),
    vehicleMake: "Nissan",
    model: "Livina",
    trimLevel: "VL",
    licensePlate: "AD 2345 KLM",
    vinNum: "NIS1234567L345678",
    engineNum: "HR15DE0011230",
    settledOdo: 55000,
    customer: "PT. Mitra Transport",
    carUser: "PT. Lalamove Indonesia",
    vendor: "Service Cepat Tepat",
    remark: "Indikator cek engine menyala",
    mechanic: "Hadi Kusumo",
    schedule: new Date("2025-06-08"),
    vehicleLocation: "Pangkalan Lalamove Solo",
    notes: "Perlu scaner untuk kode error",
    driver: "Putra Lalamove",
    driverContact: "085712345678",
    approvedBy: "PIC Lalamove",
    custPicContact: "085712345679",
    requestBy: "Koordinator Lapangan",
    progresStatus: WoProgressStatus.ON_PROCESS,
    priorityType: WoPriorityType.URGENT,
  },
  {
    woNumber: "WO 2025/5009332",
    woMaster: "WO 2025/27442",
    date: new Date("2025-06-04"),
    vehicleMake: "BMW",
    model: "320i",
    trimLevel: "Sport",
    licensePlate: "B 8888 ABC",
    vinNum: "BMW1234567F890123",
    engineNum: "B48B20A0011231",
    settledOdo: 30000,
    customer: "PT. Eksekutif Mandiri",
    carUser: "Direktur Utama",
    vendor: "Euro Auto Service",
    remark: "Suara aneh di suspensi",
    mechanic: "Iwan Setiawan",
    schedule: new Date("2025-06-05"),
    vehicleLocation: "Kediaman Direktur",
    notes: "Disarankan cek bushing arm",
    driver: "Pak Sopir",
    driverContact: "081309876543",
    approvedBy: "Sekretaris Direktur",
    custPicContact: "081309876544",
    requestBy: "Direktur Utama",
    progresStatus: WoProgressStatus.ON_PROCESS,
    priorityType: WoPriorityType.EMERGENCY,
  },
  {
    woNumber: "WO 2025/5009333",
    woMaster: "WO 2025/27443",
    date: new Date("2025-06-05"),
    vehicleMake: "Mercedes-Benz",
    model: "C200",
    trimLevel: "AMG Line",
    licensePlate: "B 7777 XYZ",
    vinNum: "MER1234567W456789",
    engineNum: "M274DE20AL0011232",
    settledOdo: 25000,
    customer: "PT. Prestisius Jaya",
    carUser: "Manajer Pemasaran",
    vendor: "Prime German Service",
    remark: "Pintu tidak bisa tertutup rapat",
    mechanic: "Joko Susilo",
    schedule: new Date("2025-06-09"),
    vehicleLocation: "Area Parkir Kantor",
    notes: "Perlu adjust engsel pintu",
    driver: "Bu Sopir",
    driverContact: "081698765432",
    approvedBy: "PIC Divisi",
    custPicContact: "081698765433",
    requestBy: "Manajer Pemasaran",
    progresStatus: WoProgressStatus.WAITING_PART,
    priorityType: WoPriorityType.NORMAL,
  },
  {
    woNumber: "WO 2025/5009334",
    woMaster: "WO 2025/27444",
    date: new Date("2025-05-29"),
    vehicleMake: "Mazda",
    model: "CX-5",
    trimLevel: "Elite",
    licensePlate: "B 1111 FFF",
    vinNum: "MAZ1234567K123456",
    engineNum: "SKYACTIV-G250011233",
    settledOdo: 50000,
    customer: "PT. Dunia Otomotif",
    carUser: "Kepala Cabang",
    vendor: "Bengkel Sejati",
    remark: "Ganti oli rutin",
    mechanic: "Kurniawan Adi",
    schedule: new Date("2025-06-01"),
    vehicleLocation: "Kantor Cabang Bandung",
    notes: "Filter oli dan filter udara sekalian diganti",
    driver: "Ani Staff",
    driverContact: "081787654321",
    approvedBy: "Manajer Cabang",
    custPicContact: "081787654322",
    requestBy: "Kepala Cabang",
    progresStatus: WoProgressStatus.FINISHED, // Sudah selesai
    priorityType: WoPriorityType.NORMAL,
  },
  {
    woNumber: "WO 2025/5009335",
    woMaster: "WO 2025/27445",
    date: new Date("2025-05-30"),
    vehicleMake: "Volvo",
    model: "XC60",
    trimLevel: "Recharge",
    licensePlate: "B 2222 GGG",
    vinNum: "VOL1234567P789012",
    engineNum: "B4204T340011234",
    settledOdo: 20000,
    customer: "PT. Inovasi Teknologi",
    carUser: "CEO Perusahaan",
    vendor: "Scandinavia Service",
    remark: "Pengecekan sistem kelistrikan",
    mechanic: "Lilis Suryani",
    schedule: new Date("2025-06-03"),
    vehicleLocation: "Rumah CEO",
    notes: "Ada masalah di charging port",
    driver: "Andi Pribadi",
    driverContact: "081876543210",
    approvedBy: "Asisten Pribadi",
    custPicContact: "081876543211",
    requestBy: "CEO",
    progresStatus: WoProgressStatus.REQUESTED,
    priorityType: WoPriorityType.URGENT,
  },
  {
    woNumber: "WO 2025/5009336",
    woMaster: "WO 2025/27446",
    date: new Date("2025-06-01"),
    vehicleMake: "Geely",
    model: "Coolray",
    trimLevel: "Sport",
    licensePlate: "B 3333 HHH",
    vinNum: "GEE1234567C345678",
    engineNum: "JL3G15TD0011235",
    settledOdo: 10000,
    customer: "PT. Mobilitas Baru",
    carUser: "Manajer Operasional",
    vendor: "Bengkel Maju Bersama",
    remark: "Update software infotainment",
    mechanic: "Maman Tukang",
    schedule: new Date("2025-06-06"),
    vehicleLocation: "Kantor Pusat Geely",
    notes: "Sudah ada notifikasi update terbaru",
    driver: "Bambang Operasional",
    driverContact: "081912345678",
    approvedBy: "PIC Geely",
    custPicContact: "081912345679",
    requestBy: "Manajer Operasional",
    progresStatus: WoProgressStatus.REJECTED, // Sudah selesai
    priorityType: WoPriorityType.NORMAL,
  },
  {
    woNumber: "WO 2025/5009337",
    woMaster: "WO 2025/27447",
    date: new Date("2025-06-02"),
    vehicleMake: "Hyundai",
    model: "Ioniq 5",
    trimLevel: "Signature",
    licensePlate: "B 4444 III",
    vinNum: "HYU1234567I901234",
    engineNum: "EMO0011236",
    settledOdo: 5000,
    customer: "PT. Energi Terbarukan",
    carUser: "General Manager",
    vendor: "EV Pro Service",
    remark: "Pengecekan baterai",
    mechanic: "Nina Teknisi",
    schedule: new Date("2025-06-05"),
    vehicleLocation: "Charging Station SCBD",
    notes: "Indikator baterai aneh",
    driver: "Dani Listrik",
    driverContact: "082109876543",
    approvedBy: "GM Divisi EV",
    custPicContact: "082109876544",
    requestBy: "General Manager",
    progresStatus: WoProgressStatus.ON_PROCESS,
    priorityType: WoPriorityType.URGENT,
  },
  {
    woNumber: "WO 2025/5009338",
    woMaster: "WO 2025/27448",
    date: new Date("2025-06-03"),
    vehicleMake: "Honda",
    model: "CR-V",
    trimLevel: "Prestige",
    licensePlate: "B 5555 JJJ",
    vinNum: "HON1234567C567890",
    engineNum: "K20C40011237",
    settledOdo: 40000,
    customer: "PT. Global Solusi",
    carUser: "VP Pemasaran",
    vendor: "Auto Repair Spesialis",
    remark: "Ganti ban dan balancing",
    mechanic: "Oki Montir",
    schedule: new Date("2025-06-07"),
    vehicleLocation: "Mall Pondok Indah",
    notes: "Ban sudah tipis",
    driver: "Eva Driver",
    driverContact: "082212345678",
    approvedBy: "PIC Pemasaran",
    custPicContact: "082212345679",
    requestBy: "VP Pemasaran",
    progresStatus: WoProgressStatus.ON_PROCESS,
    priorityType: WoPriorityType.NORMAL,
  },
];

export const vehicleData: Vehicle[] = [
  {
    id: 1,
    licensePlate: "B 9867 NCG",
    make: "MITSUBISHI",
    model: "canter",
    trimLevel: "FE 84 SHDX",
    modelYear: 2020, // Menggunakan number
    bodyStyle: "Box Body",
    color: "Yellow",
  },
];

export const sparePartData: SparePart[] = [
  {
    id: 1,
    partNumber: "KM006102A1",
    sku: "MIT-FF-KM006102A1-A",
    partName: "Fuel Filter",
    variant: PartVariant.OEM, // Menggunakan enum
    make: "Mitsubishi",
    suitable_for_vehicles: ["Canter Euro 4", "Mitsubishi L300"],
    price: 75000, // Menggunakan number
    unit: "pcs",
  },
];

export const estimationData: Estimation[] = [
  {
    invNum: "EST 2025/5009344",
    woMaster: "WO 2025/27454",
    date: new Date("2025-06-08"),
    vehicleMake: "Toyota",
    model: "Avanza",
    trimLevel: "G 1.3 M/T",
    licensePlate: "L 1234 XY",
    vinNum: "MHKF123456V678901",
    requestOdo: 120000,
    actualdOdo: 120000,
    engineNum: "K3-VE-901234567",
    customer: "PT. Rental Mobil Sejahtera",
    carUser: "PT. Rental Mobil Sejahtera",
    remark: "Bunyi berdecit saat mengerem",
    mechanic: "Vino Akbar",
    reqSparePartList: ["Kampas rem depan", "Kampas rem belakang"],
    reqServicesList: [
      "Pengecekan sistem pengereman",
      "Penggantian kampas rem depan",
      "Penggantian kampas rem belakang",
    ],
    finished: new Date("2025-06-03"),
    approvedBy: "Manajer Armada",
  },
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    poNum: "PO-2025-00123",
    poDate: new Date("2025-06-07"),
    supplierName: "PT. Sumber Suku Cadang",
    supplierContact: "0812-3456-7890",
    deliveryAddress: "Jl. Mekanik No. 10, Surabaya",
    orderItems: [
      {
        itemName: "Kampas Rem Depan",
        partNumber: "KRD-TY-001",
        quantity: 2,
        unit: "pcs",
        unitPrice: 150000,
        totalPrice: 300000,
      },
      {
        itemName: "Minyak Rem DOT 3",
        partNumber: "MBR-DOT3-500ML",
        quantity: 2,
        unit: "botol",
        unitPrice: 40000,
        totalPrice: 80000,
      },
    ],
    subtotal: 380000,
    tax: 38000,
    totalAmount: 418000,
    deliveryDate: new Date("2025-06-10"),
    status: PurchaseOrderStatus.PENDING_APPROVAL, // Menggunakan enum
    requestedBy: "Vino Akbar",
    approvedBy: "Kepala Gudang",
    remark: "Stok habis, urgent untuk kendaraan operasional",
  },
];
