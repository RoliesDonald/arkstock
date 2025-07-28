// src/app/api/service-required-spare-parts/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua spare part yang dibutuhkan jasa
export async function GET() {
  try {
    const serviceRequiredSpareParts = await prisma.serviceRequiredSparePart.findMany({
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
            unit: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(serviceRequiredSpareParts, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching service required spare parts:", error);
    return NextResponse.json(
      { message: "Failed to fetch service required spare parts", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat entri spare part yang dibutuhkan jasa baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, sparePartId, quantity } = body;

    const newServiceRequiredSparePart = await prisma.serviceRequiredSparePart.create({
      data: {
        service: { connect: { id: serviceId } },
        sparePart: { connect: { id: sparePartId } },
        quantity: parseInt(quantity),
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        service: {
          select: {
            id: true,
            name: true,
          },
        },
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
            unit: true,
          },
        },
      },
    });
    return NextResponse.json(newServiceRequiredSparePart, { status: 201 });
  } catch (error: any) {
    console.error("Error creating service required spare part:", error);
    return NextResponse.json(
      { message: "Failed to create service required spare part", error: error.message },
      { status: 500 }
    );
  }
}
