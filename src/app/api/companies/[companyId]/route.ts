import { NextRequest, NextResponse } from "next/server";
import {
  companyFormSchema,
  CompanyType,
  CompanyStatus,
} from "@/types/companies";
import { authenticateToken, authorizeRoles } from "@/lib/auth";
import { EmployeeRole } from "@/types/employee";
import * as z from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Skema Zod untuk validasi parameter ID
const idSchema = z.object({
  companyId: z.string().uuid({ message: "ID perusahaan tidak valid." }),
});

// Handler untuk request GET (mengambil detail satu perusahaan)
export async function GET(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  // 1. Otentikasi Token
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) {
    console.error(
      "Authentication failed for GET /api/companies/[id]:",
      authResult.status
    );
    return authResult;
  }

  // 2. Otorisasi Peran
  const authzResult = await authorizeRoles([
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.ADMIN,
    EmployeeRole.USER,
  ])(req);
  if (authzResult instanceof NextResponse) {
    console.error(
      "Authorization failed for GET /api/companies/[id]:",
      authzResult.status
    );
    return authzResult;
  }

  try {
    // 3. Validasi ID dari params
    console.log("Backend: Menerima params:", params); // DEBUG LOG
    const validation = idSchema.safeParse(params);
    console.log("Backend: Hasil validasi ID:", validation); // DEBUG LOG

    if (!validation.success) {
      console.error(
        "Backend: Validasi ID gagal:",
        validation.error.flatten().fieldErrors
      ); // DEBUG LOG
      return NextResponse.json(
        {
          errors: validation.error.flatten().fieldErrors,
          message: "ID perusahaan tidak valid.",
        },
        { status: 400 }
      );
    }
    const { companyId } = validation.data;
    console.log("Backend: ID yang divalidasi:", companyId); // DEBUG LOG

    const company = await prisma.company.findUnique({
      where: { id: companyId },
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
        parentCompany: {
          select: {
            id: true, // Tambahkan ID untuk parentCompany juga jika diperlukan
            companyName: true,
          },
        },
        childCompanies: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    console.log("Backend: Data perusahaan dari Prisma:", company); // DEBUG LOG

    if (!company) {
      console.warn("Backend: Perusahaan tidak ditemukan untuk ID:", companyId); // DEBUG LOG
      return NextResponse.json(
        { message: "Perusahaan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("Backend: Error fetching company by ID:", error); // DEBUG LOG
    if (error instanceof Error && (error as any).code === "P2025") {
      return NextResponse.json(
        { message: "Perusahaan tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat mengambil detail perusahaan.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}

// Handler untuk request PUT (memperbarui perusahaan)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Otentikasi Token
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // 2. Otorisasi Peran (hanya SUPER_ADMIN atau ADMIN yang bisa memperbarui perusahaan)
  const authzResult = await authorizeRoles([
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.ADMIN,
  ])(req);
  if (authzResult instanceof NextResponse) {
    return authzResult;
  }

  try {
    // 3. Validasi ID dari params
    const idValidation = idSchema.safeParse(params);
    if (!idValidation.success) {
      return NextResponse.json(
        { errors: idValidation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { companyId } = idValidation.data;

    const body = await req.json();

    // 4. Validasi input body menggunakan Zod (gunakan partial() untuk update)
    const validation = companyFormSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: validation.data,
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

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error("Error updating company:", error);
    if (error instanceof Error && (error as any).code === "P2025") {
      return NextResponse.json(
        { message: "Perusahaan tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat memperbarui perusahaan.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}

// Handler untuk request DELETE (menghapus perusahaan)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Otentikasi Token
  const authResult = await authenticateToken(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // 2. Otorisasi Peran (hanya SUPER_ADMIN yang bisa menghapus perusahaan)
  const authzResult = await authorizeRoles([EmployeeRole.SUPER_ADMIN])(req);
  if (authzResult instanceof NextResponse) {
    return authzResult;
  }

  try {
    // 3. Validasi ID dari params
    const validation = idSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { companyId } = validation.data;

    const deletedCompany = await prisma.company.delete({
      where: { id: companyId },
      select: {
        id: true,
        companyName: true,
      },
    });

    return NextResponse.json(
      { message: "Perusahaan berhasil dihapus.", company: deletedCompany },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting company:", error);
    if (error instanceof Error && (error as any).code === "P2025") {
      return NextResponse.json(
        { message: "Perusahaan tidak ditemukan." },
        { status: 404 }
      );
    }
    if (error instanceof Error && (error as any).code === "P2003") {
      return NextResponse.json(
        {
          message:
            "Perusahaan tidak dapat dihapus karena masih memiliki relasi data (misalnya, karyawan atau kendaraan terkait).",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat menghapus perusahaan.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // await prisma.$disconnect();
  }
}
