import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail gudang berdasarkan ID
export async function GET(request: Request, { params }: { params: { warehouseId: string } }) {
  const { warehouseId } = params;
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      return NextResponse.json({ message: "Warehouse not found" }, { status: 404 });
    }
    return NextResponse.json(warehouse, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching warehouse:", error);
    return NextResponse.json({ message: "Failed to fetch warehouse", error: error.message }, { status: 500 });
  }
}

// Memperbarui gudang
export async function PUT(request: Request, { params }: { params: { warehouseId: string } }) {
  const { warehouseId } = params;
  try {
    const body = await request.json();
    const { name, location, warehouseType } = body;

    const updatedWarehouse = await prisma.warehouse.update({
      where: { id: warehouseId },
      data: {
        name,
        location,
        warehouseType,
      },
    });
    return NextResponse.json(updatedWarehouse, { status: 200 });
  } catch (error: any) {
    console.error("Error updating warehouse:", error);
    return NextResponse.json(
      { message: "Failed to update warehouse", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus gudang
export async function DELETE(request: Request, { params }: { params: { warehouseId: string } }) {
  const { warehouseId } = params;
  try {
    await prisma.warehouse.delete({
      where: { id: warehouseId },
    });
    return NextResponse.json({ message: "Warehouse deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting warehouse:", error);
    return NextResponse.json(
      { message: "Failed to delete warehouse", error: error.message },
      { status: 500 }
    );
  }
}
