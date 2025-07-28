import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail unit berdasarkan ID
export async function GET(request: Request, { params }: { params: { unitId: string } }) {
  const { unitId } = params;
  try {
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
    });

    if (!unit) {
      return NextResponse.json({ message: "Unit not found" }, { status: 404 });
    }
    return NextResponse.json(unit, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching unit:", error);
    return NextResponse.json({ message: "Failed to fetch unit", error: error.message }, { status: 500 });
  }
}

// Memperbarui unit
export async function PUT(request: Request, { params }: { params: { unitId: string } }) {
  const { unitId } = params;
  try {
    const body = await request.json();
    const { name, symbol, unitType, unitCategory, description } = body;

    const updatedUnit = await prisma.unit.update({
      where: { id: unitId },
      data: {
        name,
        symbol,
        unitType,
        unitCategory,
        description,
      },
    });
    return NextResponse.json(updatedUnit, { status: 200 });
  } catch (error: any) {
    console.error("Error updating unit:", error);
    return NextResponse.json({ message: "Failed to update unit", error: error.message }, { status: 500 });
  }
}

// Menghapus unit
export async function DELETE(request: Request, { params }: { params: { unitId: string } }) {
  const { unitId } = params;
  try {
    await prisma.unit.delete({
      where: { id: unitId },
    });
    return NextResponse.json({ message: "Unit deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting unit:", error);
    return NextResponse.json({ message: "Failed to delete unit", error: error.message }, { status: 500 });
  }
}
