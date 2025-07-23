import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua unit
export async function GET() {
  try {
    const units = await prisma.unit.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(units, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching units:", error);
    return NextResponse.json({ message: "Failed to fetch units", error: error.message }, { status: 500 });
  }
}

// Membuat unit baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, symbol, unitType, unitCategory, description } = body;

    const newUnit = await prisma.unit.create({
      data: {
        name,
        symbol,
        unitType,
        unitCategory,
        description,
      },
    });
    return NextResponse.json(newUnit, { status: 201 });
  } catch (error: any) {
    console.error("Error creating unit:", error);
    return NextResponse.json({ message: "Failed to create unit", error: error.message }, { status: 500 });
  }
}
