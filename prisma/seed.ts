// prisma/seed.ts
import {
  PrismaClient,
  CompanyType,
  CompanyStatus,
  CompanyRole,
  EmployeeRole,
  Gender,
  EmployeeStatus,
  EmployeePosition,
} from "@prisma/client"; // Pastikan semua enum diimpor
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Fungsi helper untuk mengonversi angka ke Romawi
const toRoman = (num: number): string => {
  if (num < 1 || num > 12) return String(num); // Hanya untuk bulan (1-12)
  const numerals = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII",
  };
  return numerals[num as keyof typeof numerals];
};

async function main() {
  console.log("Start seeding...");

  // Hapus data yang ada (opsional, untuk memastikan database bersih saat seeding)
  // HATI-HATI DENGAN INI DI PRODUKSI!
  // Urutan penghapusan penting karena relasi foreign key
  await prisma.workOrderImage.deleteMany();
  await prisma.workOrderSparePart.deleteMany();
  await prisma.workOrderService.deleteMany();
  await prisma.workOrderTask.deleteMany();
  await prisma.workOrderItem.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoiceService.deleteMany();
  await prisma.purchaseOrderItem.deleteMany();
  await prisma.estimationItem.deleteMany();
  await prisma.estimationService.deleteMany();
  await prisma.warehouseStock.deleteMany();
  await prisma.stockTransaction.deleteMany();
  await prisma.serviceRequiredSparePart.deleteMany();
  await prisma.sparePartSuitableVehicle.deleteMany();
  await prisma.estimation.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.sparePart.deleteMany();
  await prisma.service.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.location.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.company.deleteMany();

  try {
    const company = await prisma.company.upsert({
      where: { companyName: "PT. Arkstok Utama" },
      update: {},
      create: {
        companyId: "ARKSTOK-MAIN-001",
        companyName: "PT. Arkstok Utama",
        address: "Jl. Contoh No. 123",
        contact: "081234567890",
        companyEmail: "info@arkstok.com",
        city: "Jakarta",
        taxRegistered: false,
        companyType: CompanyType.CUSTOMER,
        status: CompanyStatus.ACTIVE,
        companyRole: CompanyRole.MAIN_COMPANY,
        logo: null,
      },
    });
    console.log(`Created company with id: ${company.id}`);

    // Logika untuk menghasilkan employeeId kustom
    const joinDate = new Date();
    const romanMonth = toRoman(joinDate.getMonth() + 1); // getMonth() is 0-indexed
    const year = joinDate.getFullYear();

    // Untuk super admin, kita bisa asumsikan ini adalah karyawan pertama
    // atau gunakan logika yang lebih canggih jika ada karyawan lain yang di-seed
    const nextEmployeeNumber = "000001"; // Nomor urut pertama
    const companyPrefix = company.companyName
      .replace(/^(PT\.|CV\.|UD\.)\s*/i, "")
      .trim()
      .substring(0, 3)
      .toUpperCase();

    const superAdminEmployeeId = `${nextEmployeeNumber}/${companyPrefix}/${romanMonth}/${year}`;

    // Buat Super Admin Employee
    const hashedPassword = await bcrypt.hash("passwordaman123", 10);
    const superAdminEmail = "superadmin@arkstok.com";

    const superAdmin = await prisma.employee.upsert({
      where: { email: superAdminEmail },
      update: {
        password: hashedPassword,
        companyId: company.id,
        role: EmployeeRole.SUPER_ADMIN,
        employeeId: superAdminEmployeeId, // KRUSIAL: Tambahkan employeeId saat update
      },
      create: {
        employeeId: superAdminEmployeeId, // KRUSIAL: Tambahkan employeeId saat create
        name: "Super Admin",
        email: superAdminEmail,
        password: hashedPassword,
        photo: null,
        phone: "081122334455",
        address: "Jl. Admin Raya No. 1",
        position: EmployeePosition.CHIEF_LEVEL,
        role: EmployeeRole.SUPER_ADMIN,
        department: "IT",
        status: EmployeeStatus.ACTIVE,
        tanggalLahir: new Date("1990-01-01"),
        tanggalBergabung: joinDate, // Gunakan tanggal bergabung saat ini untuk konsistensi ID
        gender: Gender.MALE,
        company: {
          connect: { id: company.id },
        },
      },
    });
    console.log(`Created super admin with id: ${superAdmin.id} and employeeId: ${superAdmin.employeeId}`);

    // Tambahkan data seed lainnya di sini jika diperlukan
    // Contoh: SparePart, Service, Vehicle, dll.
  } catch (e) {
    console.error("Error during seeding:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
