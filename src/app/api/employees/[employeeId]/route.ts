import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi untuk mengambil detail Employee berdasarkan ID
export async function GET(request: Request, { params }: { params: { employeeId: string } }) {
  const { employeeId } = params;
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        // Menggunakan select untuk hanya mengambil properti yang dibutuhkan
        id: true,
        employeeId: true,
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
          select: {
            id: true,
            companyName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }
    return NextResponse.json(employee, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ message: "Failed to fetch employee", error: error.message }, { status: 500 });
  }
}

// Fungsi untuk memperbarui Employee
export async function PUT(request: Request, { params }: { params: { employeeId: string } }) {
  const { employeeId } = params;
  try {
    const body = await request.json();
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
    } = body;

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        employeeId,
        name,
        email,
        // password, // Hati-hati saat mengupdate password, biasanya ada endpoint terpisah
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
        company: companyId ? { connect: { id: companyId } } : { disconnect: true },
      },
      select: {
        // Sertakan properti yang sama seperti GET untuk konsistensi respons
        id: true,
        employeeId: true,
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
    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error: any) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ message: "Failed to update employee", error: error.message }, { status: 500 });
  }
}

// Fungsi untuk menghapus Employee
export async function DELETE(request: Request, { params }: { params: { employeeId: string } }) {
  const { employeeId } = params;
  try {
    await prisma.employee.delete({
      where: { id: employeeId },
    });
    return NextResponse.json({ message: "Employee deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ message: "Failed to delete employee", error: error.message }, { status: 500 });
  }
}
