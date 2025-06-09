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
  NEW = "NEW",
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

export enum EmployeeRole {
  ADMIN = "Admin",
  USER = "User",
  MECHANIC = "Mechanic",
  SERVICE_ADVISOR = "Service Advisor",
  LEADER_MECHANIC = "Leader Mechanic",
  FINANCE_STAFF = "Finance Staff",
  ADMIN_STAFF = "Admin Staff",
  WAREHOUSE_STAFF = "Warehouse Staff",
  DRIVER = "Driver",
  PIC_FLEET = "PIC Fleet",
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

export interface Employee {
  id: number;
  employeeId?: string;
  name: string;
  email?: string;
  photo?: string;
  phone?: string;
  role: EmployeeRole; // Menggunakan enum
  department?: string; // 'departement' diubah menjadi 'department'
  companyName?: string; // company.name (untuk display)
  address?: string;
}

export interface Company {
  id: number;
  companyId: string;
  companyName: string;
  companyEmail?: string;
  logo?: string;
  contact?: string;
  address?: string;
  tax: boolean; // taxRegistered
  // type: CompanyType; // Akan ditambahkan jika Anda menggunakan enum CompanyType
}

export interface InvoiceItem {
  itemName: string; // Ini akan menjadi sparePart.name
  partNumber: string; // sparePart.partNumber
  quantity: number;
  unit: string; // sparePart.unit
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  invNum: string; // invoiceNumber
  woMaster: string; // woMasterNumber dari WO
  date: Date; // invoiceDate
  vehicleMake: string; // vehicle.make (untuk display)
  model: string; // vehicle.model (untuk display)
  trimLevel?: string; // vehicle.trimLevel (untuk display)
  licensePlate: string; // vehicle.licensePlate (untuk display)
  vinNum?: string; // vehicle.vinNum (untuk display)
  requestOdo: number;
  actualdOdo: number;
  engineNum?: string; // vehicle.engineNum (untuk display)
  customer: string; // requestorCompany.name (untuk display)
  carUser: string; // carUserCompany.name (untuk display)
  remark: string; // summaryRemark
  mechanic?: string; // mechanic.name (untuk display)
  sparePartList?: string; // Ini sebaiknya menjadi array atau objek InvoiceItem (untuk display)
  servicesList?: string; // Ini sebaiknya menjadi array atau objek InvoiceService (untuk display)
  finished: Date; // finishedDate
  approvedBy?: string; // approvingEmployeeInvoice.name
}

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

export const employeeData: Employee[] = [
  {
    id: 1,
    employeeId: "2323432",
    name: "John Doe",
    email: "john@doe.com",
    photo:
      "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "081284698523",
    role: EmployeeRole.ADMIN, // Menggunakan enum yang lebih umum untuk contoh ini
    department: "Finance",
    companyName: "PT. Jaya Sentosa Abadi",
    address: "Jl. Rasuna Said, Surabaya, Jawa Timur",
  },
];

export const companyData: Company[] = [
  {
    id: 1,
    companyId: "2323432",
    companyName: "PT. Jaya Sentosa Abadi",
    companyEmail: "info@jayasentosa.com",
    logo: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    contact: "081284698523",
    address: "Jl. Bendungan, Surabaya, Jawa Timur",
    tax: true,
  },
];

export const invoiceData: Invoice[] = [
  {
    invNum: "WO 2025/5009344",
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
    sparePartList: "Kampas rem depan dan belakang", // Ini string, tapi idealnya array InvoiceItem
    servicesList: "Penggantian kampas rem depan dan belakang", // Ini string, tapi idealnya array InvoiceService
    finished: new Date("2025-06-03"),
    approvedBy: "Manajer Armada",
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
