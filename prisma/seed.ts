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

  // Buat Company (jika belum ada)
  try {
    // <--- BLOK TRY DIMULAI DI SINI
    const company = await prisma.company.upsert({
      where: { companyName: "PT. Arkstok Utama" },
      update: {},
      create: {
        companyId: "ARKSTOK-MAIN-001", // Wajib dan unik sesuai schema.prisma
        companyName: "PT. Arkstok Utama",
        address: "Jl. Contoh No. 123",
        contact: "081234567890", // Sesuai dengan `contact` di schema.prisma
        companyEmail: "info@arkstok.com", // Sesuai dengan `companyEmail` di schema.prisma
        // website: 'www.arkstok.com', // Dihilangkan karena Anda bilang tidak ada di schema.prisma
        city: "Jakarta",
        taxRegistered: false,
        companyType: CompanyType.CUSTOMER, // Menggunakan enum dari Prisma Client
        status: CompanyStatus.ACTIVE, // Menggunakan enum dari Prisma Client
        companyRole: CompanyRole.MAIN_COMPANY, // Wajib dan menggunakan enum dari Prisma Client
        logo: null,
      },
    });
    console.log(`Created company with id: ${company.id}`);

    // Buat Super Admin Employee
    const hashedPassword = await bcrypt.hash("passwordaman123", 10); // Hash password Anda
    const superAdminEmail = "superadmin@arkstok.com";

    const superAdmin = await prisma.employee.upsert({
      where: { email: superAdminEmail },
      update: {
        password: hashedPassword,
        companyId: company.id,
        role: EmployeeRole.SUPER_ADMIN, // Menggunakan enum dari Prisma Client
      },
      create: {
        name: "Super Admin",
        email: superAdminEmail,
        password: hashedPassword,
        photo: null,
        phone: "081122334455",
        address: "Jl. Admin Raya No. 1",
        position: EmployeePosition.CHIEF_LEVEL,
        role: EmployeeRole.SUPER_ADMIN, // Menggunakan enum dari Prisma Client
        department: "IT",
        status: EmployeeStatus.ACTIVE, // Menggunakan enum dari Prisma Client
        tanggalLahir: new Date("1990-01-01"),
        tanggalBergabung: new Date(),
        gender: Gender.MALE, // Menggunakan enum dari Prisma Client
        company: {
          connect: { id: company.id },
        },
      },
    });
    console.log(`Created super admin with id: ${superAdmin.id}`);

    // Tambahkan data seed lainnya di sini jika diperlukan
    // Contoh: SparePart, Service, Vehicle, dll.
  } catch (e) {
    // <--- BLOK CATCH DIMULAI DI SINI
    console.error("Error during seeding:", e);
    process.exit(1);
  } finally {
    // <--- BLOK FINALLY DIMULAI DI SINI
    await prisma.$disconnect();
  }
}

main();
