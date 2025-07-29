// src/app/api/employees/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, EmployeeRole, EmployeeStatus, EmployeePosition, Gender } from "@prisma/client";
import { employeeFormSchema } from "@/schemas/employee";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function getUserIdFromToken(request: Request): Promise<string | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "SUPER_RAHASIA_JWT_KEY_ANDA");
    return decoded.userId;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        employeeId: true,
        // KRUSIAL: Hapus userId dari select karena sudah diganti namanya
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = employeeFormSchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation errors for new employee:", validation.error.errors);
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
    }

    const {
      employeeId,
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
    } = validation.data;

    if (!companyId) {
      return NextResponse.json({ message: "companyId is required" }, { status: 400 });
    }

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newEmployee = await prisma.employee.create({
      data: {
        employeeId: employeeId || null,
        name,
        email,
        password: hashedPassword,
        photo,
        phone,
        address,
        position: position as EmployeePosition,
        role: role as EmployeeRole,
        department,
        status: status as EmployeeStatus,
        tanggalLahir,
        tanggalBergabung,
        gender: gender as Gender,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
      select: {
        id: true,
        employeeId: true,
        // KRUSIAL: Hapus userId dari select karena sudah diganti namanya
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
    if (error.code === "P2025" && error.meta?.cause?.includes("No 'Company' record")) {
      return NextResponse.json(
        {
          message:
            "Company record not found for the provided companyId. Please ensure the company ID exists in the database.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Failed to create employee", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...dataToUpdate } = body;

    if (!id) {
      return NextResponse.json({ message: "Employee ID is required for update" }, { status: 400 });
    }

    const validation = employeeFormSchema.partial().safeParse(dataToUpdate);
    if (!validation.success) {
      console.error("Validation errors for employee update:", validation.error.errors);
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
    }

    if (validation.data.password) {
      validation.data.password = await bcrypt.hash(validation.data.password, 10);
    } else {
      delete validation.data.password;
    }

    const cleanedDataToUpdate: any = {};
    for (const key in validation.data) {
      if (validation.data[key as keyof typeof validation.data] === "") {
        cleanedDataToUpdate[key] = null;
      } else {
        if (key === "position" && validation.data[key]) {
          cleanedDataToUpdate[key] = validation.data[key] as EmployeePosition;
        } else if (key === "role" && validation.data[key]) {
          cleanedDataToUpdate[key] = validation.data[key] as EmployeeRole;
        } else if (key === "status" && validation.data[key]) {
          cleanedDataToUpdate[key] = validation.data[key] as EmployeeStatus;
        } else if (key === "gender" && validation.data[key]) {
          cleanedDataToUpdate[key] = validation.data[key] as Gender;
        } else {
          cleanedDataToUpdate[key] = validation.data[key as keyof typeof validation.data];
        }
      }
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: cleanedDataToUpdate,
    });

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error: any) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ message: "Failed to update employee", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Employee ID is required for delete" }, { status: 400 });
    }

    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Employee deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ message: "Failed to delete employee", error: error.message }, { status: 500 });
  }
}
