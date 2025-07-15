import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid." }),
  password: z
    .string()
    .min(6, { message: "Password harus memiliki minimal 6 karakter." })
    .max(100, { message: "Password tidak boleh lebih dari 100 karakter." }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // validasi
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, password } = validation.data;

    // Cek apakah email ada di database
    const employee = await prisma.employee.findUnique({
      where: { email: email },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "email tidak ditemukan" },
        { status: 401 } // Unauthorized
      );
    }

    if (!employee.password) {
      return NextResponse.json(
        { message: "Karyawan ini tidak memiliki password" },
        { status: 500 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Password salah" },
        { status: 401 } // Unauthorized
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.log("JWT_SECRET tidak ditemukan");
      return NextResponse.json(
        { message: "Config server tidak lengkap" },
        { status: 500 } // Internal Server Error
      );
    }

    const tokenPayload = {
      id: employee.id,
      email: employee.email,
      role: employee.role,
      name: employee.name,
    };

    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: "1h" });

    return NextResponse.json(
      {
        message: "Login berhasil",
        token: token,
        employee: {
          id: employee.id,
          userId: employee.userId,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          phone: employee.phone,
          position: employee.position,
          department: employee.department,
          status: employee.status,
          tanggalLahir: employee.tanggalLahir,
          tanggalBergabung: employee.tanggalBergabung,
          companyId: employee.companyId,
        },
      },
      { status: 200 } //OK
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat login.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // Tidak perlu disconnect di setiap request jika menggunakan Next.js API routes
    // await prisma.$disconnect();
  }
}
