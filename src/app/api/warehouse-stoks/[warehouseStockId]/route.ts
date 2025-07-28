import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail stok gudang berdasarkan ID
export async function GET(request: Request, { params }: { params: { warehouseStockId: string } }) {
  const { warehouseStockId } = params;
  try {
    const warehouseStock = await prisma.warehouseStock.findUnique({
      where: { id: warehouseStockId },
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
    });

    if (!warehouseStock) {
      return NextResponse.json({ message: "Warehouse Stock not found" }, { status: 404 });
    }
    return NextResponse.json(warehouseStock, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching warehouse stock:", error);
    return NextResponse.json(
      { message: "Failed to fetch warehouse stock", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui stok gudang
export async function PUT(request: Request, { params }: { params: { warehouseStockId: string } }) {
  const { warehouseStockId } = params;
  try {
    const body = await request.json();
    const { sparePartId, warehouseId, currentStock } = body;

    const updatedWarehouseStock = await prisma.warehouseStock.update({
      where: { id: warehouseStockId },
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
    return NextResponse.json(updatedWarehouseStock, { status: 200 });
  } catch (error: any) {
    console.error("Error updating warehouse stock:", error);
    return NextResponse.json(
      { message: "Failed to update warehouse stock", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus stok gudang
export async function DELETE(request: Request, { params }: { params: { warehouseStockId: string } }) {
  const { warehouseStockId } = params;
  try {
    await prisma.warehouseStock.delete({
      where: { id: warehouseStockId },
    });
    return NextResponse.json({ message: "Warehouse Stock deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting warehouse stock:", error);
    return NextResponse.json(
      { message: "Failed to delete warehouse stock", error: error.message },
      { status: 500 }
    );
  }
}
