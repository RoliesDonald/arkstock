// src/app/api/companies/[companyId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
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

// Handler GET untuk mengambil detail perusahaan berdasarkan ID
export async function GET(request: Request, { params }: { params: { companyId: string } }) {
  try {
    const { companyId } = params;
    console.log(`API: Attempting to fetch company with ID: ${companyId}`); // LOGGING: ID yang diterima

    // Opsional: Verifikasi token JWT jika akses ke detail perusahaan memerlukan otentikasi
    // const userId = await getUserIdFromToken(request);
    // if (!userId) {
    //   console.warn(`API: Unauthorized attempt to access company ${companyId}`);
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        id: true,
        companyId: true,
        companyName: true,
        address: true,
        contact: true,
        companyEmail: true,
        city: true,
        taxRegistered: true,
        companyType: true,
        status: true,
        companyRole: true,
        logo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!company) {
      console.warn(`API: Company with ID ${companyId} not found.`); // LOGGING: Perusahaan tidak ditemukan
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    console.log(`API: Successfully fetched company: ${company.companyName}`); // LOGGING: Berhasil
    return NextResponse.json(company, { status: 200 });
  } catch (error: any) {
    console.error("API: Error fetching company:", error);
    return NextResponse.json({ message: "Failed to fetch company", error: error.message }, { status: 500 });
  }
}
