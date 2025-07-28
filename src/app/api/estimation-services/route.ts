import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua jasa estimasi
export async function GET() {
  try {
    const estimationServices = await prisma.estimationService.findMany({
      include: {
        estimation: {
          select: {
            id: true,
            estimationNumber: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(estimationServices, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching estimation services:", error);
    return NextResponse.json(
      { message: "Failed to fetch estimation services", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat jasa estimasi baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { estimationId, serviceId, quantity, unitPrice, totalPrice } = body;

    const newEstimationService = await prisma.estimationService.create({
      data: {
        estimation: { connect: { id: estimationId } },
        service: { connect: { id: serviceId } },
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseFloat(totalPrice),
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        estimation: {
          select: {
            id: true,
            estimationNumber: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });
    return NextResponse.json(newEstimationService, { status: 201 });
  } catch (error: any) {
    console.error("Error creating estimation service:", error);
    return NextResponse.json(
      { message: "Failed to create estimation service", error: error.message },
      { status: 500 }
    );
  }
}
