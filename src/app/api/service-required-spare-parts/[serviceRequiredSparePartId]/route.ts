// src/app/api/service-required-spare-parts/[serviceRequiredSparePartId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail spare part yang dibutuhkan jasa berdasarkan ID
export async function GET(request: Request, { params }: { params: { serviceRequiredSparePartId: string } }) {
  const { serviceRequiredSparePartId } = params;
  try {
    const serviceRequiredSparePart = await prisma.serviceRequiredSparePart.findUnique({
      where: { id: serviceRequiredSparePartId },
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
    });

    if (!serviceRequiredSparePart) {
      return NextResponse.json({ message: "Service Required Spare Part not found" }, { status: 404 });
    }
    return NextResponse.json(serviceRequiredSparePart, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching service required spare part:", error);
    return NextResponse.json(
      { message: "Failed to fetch service required spare part", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui spare part yang dibutuhkan jasa
export async function PUT(request: Request, { params }: { params: { serviceRequiredSparePartId: string } }) {
  const { serviceRequiredSparePartId } = params;
  try {
    const body = await request.json();
    const { serviceId, sparePartId, quantity } = body;

    const updatedServiceRequiredSparePart = await prisma.serviceRequiredSparePart.update({
      where: { id: serviceRequiredSparePartId },
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
    return NextResponse.json(updatedServiceRequiredSparePart, { status: 200 });
  } catch (error: any) {
    console.error("Error updating service required spare part:", error);
    return NextResponse.json(
      { message: "Failed to update service required spare part", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus spare part yang dibutuhkan jasa
export async function DELETE(
  request: Request,
  { params }: { params: { serviceRequiredSparePartId: string } }
) {
  const { serviceRequiredSparePartId } = params;
  try {
    await prisma.serviceRequiredSparePart.delete({
      where: { id: serviceRequiredSparePartId },
    });
    return NextResponse.json(
      { message: "Service Required Spare Part deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting service required spare part:", error);
    return NextResponse.json(
      { message: "Failed to delete service required spare part", error: error.message },
      { status: 500 }
    );
  }
}
