import { PrismaClient } from "@/generated/prisma";
import { authenticateToken, authorizeRoles } from "@/lib/auth";
import { employeeFormSchema, EmployeeRole } from "@/types/employee";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const prisma = new PrismaClient();

const idSchema = z.object({
  id: z.string().uuid({ message: "ID karyawan tidak valid" }),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const authzResult = await authorizeRoles([
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.ADMIN,
    EmployeeRole.USER,
  ])(req);
  if (authzResult instanceof NextResponse) {
    return authzResult;
  }

  try {
    const validation = idSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.flatten().fieldErrors,
          message: "ID karyawan tidak valid",
        },
        { status: 400 }
      );
    }
    const { id } = validation.data;

    const employee = await prisma.employee.findUnique({
      where: { id: id },
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
            companyName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!employee) {
      return NextResponse.json(
        { message: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.log("Error saat menggambil data employee by ID: ", error);
    if (error instanceof Error && (error as any).code === "P2025") {
      return NextResponse.json(
        { message: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat mengambil data karyawan" },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const authzResult = await authorizeRoles([
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.ADMIN,
  ])(req);
  if (authzResult instanceof NextResponse) {
    return authzResult;
  }
  try {
    const idValidation = idSchema.safeParse(params);
    if (!idValidation.success) {
      return NextResponse.json(
        {
          errors: idValidation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { id } = idValidation.data;
    const body = await req.json();

    const validation = employeeFormSchema.partial().safeParse(body);
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

    const { password, ...datatoUpdate } = validation.data;

    let hashedPassword = undefined;
    if (password && password.length > 0) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    if (datatoUpdate.email) {
      const existingEmployeeByEmail = await prisma.employee.findFirst({
        where: { email: datatoUpdate.email, NOT: { id: id } },
      });
      if (existingEmployeeByEmail) {
        return NextResponse.json(
          { message: "Email sudah terdaftar" },
          { status: 409 }
        );
      }
    }
    if (datatoUpdate.userId) {
      const existingEmployeeByUserId = await prisma.employee.findFirst({
        where: { userId: datatoUpdate.userId, NOT: { id: id } },
      });
      if (existingEmployeeByUserId) {
        return NextResponse.json(
          {
            message: "User ID sudah terdafrar",
          },
          { status: 409 }
        );
      }
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: id },
      data: {
        ...datatoUpdate,
        ...(hashedPassword && { password: hashedPassword }),
        tanggalLahir:
          datatoUpdate.tanggalLahir === null
            ? null
            : datatoUpdate.tanggalLahir
            ? new Date(datatoUpdate.tanggalLahir)
            : undefined,
        tanggalBergabung:
          datatoUpdate.tanggalBergabung === null
            ? null
            : datatoUpdate.tanggalBergabung
            ? new Date(datatoUpdate.tanggalBergabung)
            : undefined,
      },
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
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error("Error updating employee:", error);
    if (error instanceof Error && (error as any).code === "P2025") {
      return NextResponse.json(
        { message: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat memperbarui data karyawan",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const authzResult = await authorizeRoles([EmployeeRole.SUPER_ADMIN])(req);
  if (authzResult instanceof NextRequest) {
    return authzResult;
  }
  try {
    const validation = idSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        {
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { id } = validation.data;
    const deleteEmployee = await prisma.employee.delete({
      where: { id: id },
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json(
      { message: "Karyawan berhasil dihapus", employee: deleteEmployee },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
    if (error instanceof Error && (error as any).code === "P2025") {
      return NextResponse.json(
        { message: "Karyawan tidak ditemukan" },
        { status: 404 }
      );
    }
    if (error instanceof Error && (error as any).code === "P2003") {
      return NextResponse.json(
        {
          message:
            "Karyawan tidak dapat dihapus karena mempunyai relasi dengan data lain",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat menghapus karyawan",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}
