import { NextRequest, NextResponse } from "next/server";
import { authenticateToken, authorizeRoles } from "@/lib/auth";
import { EmployeeRole } from "@/types/employee";
import { employeeFormSchema } from "@/types/employee"; // Import schema Zod Employee
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Untuk hashing password

const prisma = new PrismaClient();

// Handler untuk request GET (mengambil semua karyawan)
export async function GET(req: NextRequest) {
  // 1. Otentikasi Token
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // 2. Otorisasi Peran (SUPER_ADMIN, ADMIN, USER bisa melihat daftar karyawan)
  const authzResult = await authorizeRoles([
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.ADMIN,
    EmployeeRole.USER,
  ])(req);
  if (authzResult instanceof NextResponse) {
    return authzResult;
  }

  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        photo: true,
        phone: true,
        address: true,
        position: true,
        role: true,
        department: true,
        status: true,
        tanggalLahir: true,
        tanggalBergabung: true,
        companyId: true,
        company: {
          // Sertakan nama perusahaan jika ada relasi
          select: {
            id: true,
            companyId: true,
            companyName: true,
            companyEmail: true,
            logo: true,
            contact: true,
            address: true,
            city: true,
            taxRegistered: true,
            companyType: true,
            status: true,
            parentCompanyId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat mengambil daftar karyawan.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}

// Handler untuk request POST (membuat karyawan baru)
export async function POST(req: NextRequest) {
  // 1. Otentikasi Token
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // 2. Otorisasi Peran (hanya SUPER_ADMIN atau ADMIN yang bisa membuat karyawan)
  const authzResult = await authorizeRoles([
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.ADMIN,
  ])(req);
  if (authzResult instanceof NextResponse) {
    return authzResult;
  }

  try {
    const body = await req.json();

    // 3. Validasi input menggunakan Zod
    const validation = employeeFormSchema.safeParse(body);
    if (!validation.success) {
      console.error(
        "Employee validation failed:",
        validation.error.flatten().fieldErrors
      );
      return NextResponse.json(
        {
          errors: validation.error.flatten().fieldErrors,
          message: "Data karyawan tidak valid.",
        },
        { status: 400 }
      );
    }

    const { password, ...dataToCreate } = validation.data;

    // Hash password jika disediakan
    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Salt rounds 10
    }

    // Cek duplikasi email atau userId jika ada
    if (dataToCreate.email) {
      const existingEmployeeByEmail = await prisma.employee.findUnique({
        where: { email: dataToCreate.email },
      });
      if (existingEmployeeByEmail) {
        return NextResponse.json(
          { message: "Email sudah terdaftar." },
          { status: 409 }
        );
      }
    }
    if (dataToCreate.userId) {
      const existingEmployeeByUserId = await prisma.employee.findUnique({
        where: { userId: dataToCreate.userId },
      });
      if (existingEmployeeByUserId) {
        return NextResponse.json(
          { message: "User ID sudah terdaftar." },
          { status: 409 }
        );
      }
    }

    const newEmployee = await prisma.employee.create({
      data: {
        ...dataToCreate,
        password: hashedPassword, // Simpan hashed password
        // Pastikan tanggal yang opsional diset null jika tidak ada
        tanggalLahir: dataToCreate.tanggalLahir
          ? new Date(dataToCreate.tanggalLahir)
          : null,
        tanggalBergabung: dataToCreate.tanggalBergabung
          ? new Date(dataToCreate.tanggalBergabung)
          : null,
      },
      select: {
        // Pilih field yang ingin dikembalikan (tanpa password)
        id: true,
        userId: true,
        name: true,
        email: true,
        photo: true,
        phone: true,
        address: true,
        position: true,
        role: true,
        department: true,
        status: true,
        tanggalLahir: true,
        tanggalBergabung: true,
        companyId: true,
        company: {
          select: {
            id: true,
            companyId: true,
            companyName: true,
            companyEmail: true,
            logo: true,
            contact: true,
            address: true,
            city: true,
            taxRegistered: true,
            companyType: true,
            status: true,
            parentCompanyId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat membuat karyawan baru.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}
