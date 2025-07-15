import { PrismaClient } from "@/generated/prisma";
import { authenticateToken, authorizeRoles } from "@/lib/auth";
import { companyFormSchema } from "@/types/companies";
import { EmployeeRole } from "@/types/employee";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // otensikasi token
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
    const body = await req.json();
    // validasi input
    const validation = companyFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const {
      // id, // 'id' tidak diperlukan saat membuat, karena Prisma akan auto-generate UUID
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
      parentCompanyId,
    } = validation.data;

    const existingCompany = await prisma.company.findUnique({
      where: { companyId: companyId },
    });
    if (existingCompany) {
      return NextResponse.json(
        { message: "ID Perusahaan sudah terdaftar" },
        { status: 409 }
      );
    }
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
        parentCompanyId,
      },
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
    });
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error("Gagal membuat perusahaan baru:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat membuat perusahaan baru",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest) {
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
    const companies = await prisma.company.findMany({
      select: {
        id: true, // Pastikan id tetap dipilih
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
        parentCompany: {
          select: { companyName: true },
        },
        childCompanies: { select: { companyName: true, id: true } },
      },
      orderBy: {
        companyName: "asc",
      },
    });

    // --- DEBUG LOG BARU DI SINI ---
    console.log(
      "API /api/companies: Data retrieved from Prisma before sending:"
    );
    companies.forEach((company, index) => {
      console.log(`  Company ${index}:`, JSON.stringify(company, null, 2));
    });
    // --- AKHIR DEBUG LOG BARU ---

    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data perusahaan:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat mengambil data perusahaan",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}
