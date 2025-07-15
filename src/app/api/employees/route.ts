import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { employeeFormSchema, EmployeeRole } from "@/types/employee";
import bcrypt from "bcryptjs";
import { authenticateToken, authorizeRoles } from "@/lib/auth";

const prisma = new PrismaClient();

// Handler untuk membuat karyawan baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validasi input pakai zod
    const validation = employeeFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      role,
      userId,
      photo,
      phone,
      address,
      position,
      department,
      status,
      tanggalLahir,
      tanggalBergabung,
      companyId,
    } = validation.data;

    // Defensive check (opsional, tapi membantu TypeScript jika ada keraguan)
    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json(
        { message: "Password tidak valid." },
        { status: 400 }
      );
    }

    //  Cek apakah email sudah terdaftar (jika email digunakan sebagai unique identifier)
    if (email) {
      const existingEmployee = await prisma.employee.findUnique({
        where: { email: email },
      });
      if (existingEmployee) {
        return NextResponse.json(
          { message: "Email sudah terdaftar." },
          { status: 409 }
        );
      }
    }

    // Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);
    // Buat karyawan baru di database
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword, // hashedPassword sekarang pasti string
        role,
        userId,
        photo,
        phone,
        address,
        position,
        department,
        status,
        tanggalLahir,
        tanggalBergabung,
        companyId,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        position: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}

// Handler untuk request GET (mengambil daftar karyawan)
export async function GET(req: NextRequest) {
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const authzResult = await authorizeRoles([EmployeeRole.SUPER_ADMIN])(req);
  if (authzResult instanceof NextResponse) {
    return authzResult;
  }
  try {
    const employees = await prisma.employee.findMany({
      select: {
        // Pilih field yang ingin diambil (jangan sertakan password!)
        id: true,
        userId: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        position: true,
        role: true,
        department: true,
        status: true,
        tanggalLahir: true,
        tanggalBergabung: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        // Anda bisa menambahkan relasi jika perlu, contoh:
        // company: {
        //   select: {
        //     companyName: true,
        //   },
        // },
      },
      orderBy: {
        // Urutkan berdasarkan nama
        name: "asc",
      },
    });

    return NextResponse.json(employees, { status: 200 }); // 200 OK
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat mengambil data karyawan.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}
