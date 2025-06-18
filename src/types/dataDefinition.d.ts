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
  vinNum?: string; // Ditambahkan dari WO
  engineNum?: string; // Ditambahkan dari WO
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
  type: CompanyType; // Akan ditambahkan jika Anda menggunakan enum CompanyType
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
