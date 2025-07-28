import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua jasa work order
export async function GET() {
  try {
    const workOrderServices = await prisma.workOrderService.findMany({
      include: {
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
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
    return NextResponse.json(workOrderServices, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order services:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order services", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat jasa work order baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workOrderId, serviceId, quantity, unitPrice, totalPrice } = body;

    const newWorkOrderService = await prisma.workOrderService.create({
      data: {
        workOrder: { connect: { id: workOrderId } },
        service: { connect: { id: serviceId } },
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseFloat(totalPrice),
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
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
    return NextResponse.json(newWorkOrderService, { status: 201 });
  } catch (error: any) {
    console.error("Error creating work order service:", error);
    return NextResponse.json(
      { message: "Failed to create work order service", error: error.message },
      { status: 500 }
    );
  }
}
