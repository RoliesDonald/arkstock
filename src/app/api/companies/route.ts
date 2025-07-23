// src/app/api/companies/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua perusahaan
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        parentCompany: {
          select: {
            id: true,
            companyName: true,
          },
        },
        // Anda bisa menyertakan relasi lain jika dibutuhkan di daftar,
        // seperti vehiclesOwned, vehiclesUsed, employees, dll.,
        // namun untuk daftar, seringkali hanya data dasar yang dibutuhkan
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(companies, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ message: "Failed to fetch companies", error: error.message }, { status: 500 });
  }
}

// Membuat perusahaan baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyId,
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

    const newCompany = await prisma.company.create({
      data: {
        companyId,
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
        ...(parentCompanyId && { parentCompany: { connect: { id: parentCompanyId } } }),
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
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error: any) {
    console.error("Error creating company:", error);
    return NextResponse.json({ message: "Failed to create company", error: error.message }, { status: 500 });
  }
}
