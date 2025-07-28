import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail perusahaan berdasarkan ID
export async function GET(request: Request, { params }: { params: { companyId: string } }) {
  const { companyId } = params;
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        parentCompany: {
          select: {
            id: true,
            companyName: true,
          },
        },
        childCompanies: {
          // Sertakan anak perusahaan
          select: {
            id: true,
            companyName: true,
          },
        },
        // Anda bisa menyertakan relasi lain yang relevan untuk detail di sini
        // Misalnya: vehiclesOwned, vehiclesUsed, employees, customerWorkOrders, dll.
      },
    });

    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(company, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching company:", error);
    return NextResponse.json({ message: "Failed to fetch company", error: error.message }, { status: 500 });
  }
}

// Memperbarui perusahaan
export async function PUT(request: Request, { params }: { params: { companyId: string } }) {
  const { companyId } = params;
  try {
    const body = await request.json();
    const {
      companyId: newCompanyId,
      companyName,
      companyEmail,
      logo,
      contact,
      address,
      city,
      taxRegistered,
      companyType,
      status,
      companyRole,
      parentCompanyId,
    } = body;

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        companyId: newCompanyId, // Bisa diupdate jika tidak @unique
        companyName,
        companyEmail,
        logo,
        contact,
        address,
        city,
        taxRegistered,
        companyType,
        status,
        companyRole,
        parentCompany: parentCompanyId ? { connect: { id: parentCompanyId } } : { disconnect: true },
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        parentCompany: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });
    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error: any) {
    console.error("Error updating company:", error);
    return NextResponse.json({ message: "Failed to update company", error: error.message }, { status: 500 });
  }
}

// Menghapus perusahaan
export async function DELETE(request: Request, { params }: { params: { companyId: string } }) {
  const { companyId } = params;
  try {
    await prisma.company.delete({
      where: { id: companyId },
    });
    return NextResponse.json({ message: "Company deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting company:", error);
    return NextResponse.json({ message: "Failed to delete company", error: error.message }, { status: 500 });
  }
}
