import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail jasa estimasi berdasarkan ID
export async function GET(request: Request, { params }: { params: { estimationServiceId: string } }) {
  const { estimationServiceId } = params;
  try {
    const estimationService = await prisma.estimationService.findUnique({
      where: { id: estimationServiceId },
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
    });

    if (!estimationService) {
      return NextResponse.json({ message: "Estimation Service not found" }, { status: 404 });
    }
    return NextResponse.json(estimationService, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching estimation service:", error);
    return NextResponse.json(
      { message: "Failed to fetch estimation service", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui jasa estimasi
export async function PUT(request: Request, { params }: { params: { estimationServiceId: string } }) {
  const { estimationServiceId } = params;
  try {
    const body = await request.json();
    const { estimationId, serviceId, quantity, unitPrice, totalPrice } = body;

    const updatedEstimationService = await prisma.estimationService.update({
      where: { id: estimationServiceId },
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
    return NextResponse.json(updatedEstimationService, { status: 200 });
  } catch (error: any) {
    console.error("Error updating estimation service:", error);
    return NextResponse.json(
      { message: "Failed to update estimation service", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus jasa estimasi
export async function DELETE(request: Request, { params }: { params: { estimationServiceId: string } }) {
  const { estimationServiceId } = params;
  try {
    await prisma.estimationService.delete({
      where: { id: estimationServiceId },
    });
    return NextResponse.json({ message: "Estimation Service deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting estimation service:", error);
    return NextResponse.json(
      { message: "Failed to delete estimation service", error: error.message },
      { status: 500 }
    );
  }
}
