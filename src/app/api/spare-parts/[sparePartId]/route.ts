// src/app/api/spare-parts/[sparePartId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail spare part berdasarkan ID
export async function GET(request: Request, { params }: { params: { sparePartId: string } }) {
  const { sparePartId } = params;
  try {
    const sparePart = await prisma.sparePart.findUnique({
      where: { id: sparePartId },
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
          },
        },
        // Anda bisa menyertakan relasi lain yang relevan untuk detail di sini
        // Misalnya: serviceRequiredSpareParts, estimationItems, InvoiceItem, PurchaseOrderItem, dll.
      },
    });

    if (!sparePart) {
      return NextResponse.json({ message: "Spare Part not found" }, { status: 404 });
    }
    return NextResponse.json(sparePart, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching spare part:", error);
    return NextResponse.json(
      { message: "Failed to fetch spare part", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui spare part
export async function PUT(request: Request, { params }: { params: { sparePartId: string } }) {
  const { sparePartId } = params;
  try {
    const body = await request.json();
    const {
      partNumber,
      partName,
      description,
      unit,
      price,
      category,
      subCategory,
      stockQuantity,
      minStockLevel,
      maxStockLevel,
      imageUrl,
      supplierId,
    } = body;

    const updatedSparePart = await prisma.sparePart.update({
      where: { id: sparePartId },
      data: {
        partNumber,
        partName,
        description,
        unit,
        price: parseFloat(price),
        category,
        subCategory,
        stockQuantity: parseInt(stockQuantity),
        minStockLevel: parseInt(minStockLevel),
        maxStockLevel: parseInt(maxStockLevel),
        imageUrl,
        supplier: supplierId ? { connect: { id: supplierId } } : { disconnect: true },
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        supplier: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });
    return NextResponse.json(updatedSparePart, { status: 200 });
  } catch (error: any) {
    console.error("Error updating spare part:", error);
    return NextResponse.json(
      { message: "Failed to update spare part", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus spare part
export async function DELETE(request: Request, { params }: { params: { sparePartId: string } }) {
  const { sparePartId } = params;
  try {
    await prisma.sparePart.delete({
      where: { id: sparePartId },
    });
    return NextResponse.json({ message: "Spare Part deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting spare part:", error);
    return NextResponse.json(
      { message: "Failed to delete spare part", error: error.message },
      { status: 500 }
    );
  }
}
