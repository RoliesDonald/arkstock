import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua stok gudang
export async function GET() {
  try {
    const warehouseStocks = await prisma.warehouseStock.findMany({
      include: {
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
            unit: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(warehouseStocks, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching warehouse stocks:", error);
    return NextResponse.json(
      { message: "Failed to fetch warehouse stocks", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat stok gudang baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sparePartId, warehouseId, currentStock } = body;

    const newWarehouseStock = await prisma.warehouseStock.create({
      data: {
        sparePart: { connect: { id: sparePartId } },
        warehouse: { connect: { id: warehouseId } },
        currentStock: parseInt(currentStock),
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
            unit: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });
    return NextResponse.json(newWarehouseStock, { status: 201 });
  } catch (error: any) {
    console.error("Error creating warehouse stock:", error);
    return NextResponse.json(
      { message: "Failed to create warehouse stock", error: error.message },
      { status: 500 }
    );
  }
}
