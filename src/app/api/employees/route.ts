import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi untuk mengambil semua Employee
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        // Menggunakan select untuk hanya mengambil properti yang dibutuhkan
        id: true,
        userId: true,
        name: true,
        email: true,
        photo: true,
        phone: true,
        address: true,
        position: true, // Pastikan 'position' disertakan
        role: true,
        department: true,
        status: true,
        tanggalLahir: true,
        tanggalBergabung: true,
        gender: true,
        companyId: true,
        company: {
          // Sertakan Company jika diperlukan
          select: {
            id: true,
            companyName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(employees, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ message: "Failed to fetch employees", error: error.message }, { status: 500 });
  }
}

// Fungsi untuk membuat Employee baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      name,
      email,
      password,
      photo,
      phone,
      address,
      position,
      role,
      department,
      status,
      tanggalLahir,
      tanggalBergabung,
      gender,
      companyId,
    } = body;

    const newEmployee = await prisma.employee.create({
      data: {
        userId,
        name,
        email,
        password, // Dalam aplikasi nyata, password harus di-hash sebelum disimpan
        photo,
        phone,
        address,
        position,
        role,
        department,
        status,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        tanggalBergabung: tanggalBergabung ? new Date(tanggalBergabung) : null,
        gender,
        ...(companyId && { company: { connect: { id: companyId } } }),
      },
      select: {
        // Sertakan properti yang sama seperti GET untuk konsistensi respons
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
        gender: true,
        companyId: true,
        company: {
          select: {
            id: true,
            companyName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ message: "Failed to create employee", error: error.message }, { status: 500 });
  }
}
