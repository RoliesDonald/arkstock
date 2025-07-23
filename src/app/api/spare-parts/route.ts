// src/app/api/spare-parts/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua spare part
export async function GET() {
  try {
    const spareParts = await prisma.sparePart.findMany({
      include: {
        supplier: {
          // Sertakan supplier (Company)
          select: {
            id: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(spareParts, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching spare parts:", error);
    return NextResponse.json(
      { message: "Failed to fetch spare parts", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat spare part baru
export async function POST(request: Request) {
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

    const newSparePart = await prisma.sparePart.create({
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
        ...(supplierId && { supplier: { connect: { id: supplierId } } }),
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
    return NextResponse.json(newSparePart, { status: 201 });
  } catch (error: any) {
    console.error("Error creating spare part:", error);
    return NextResponse.json(
      { message: "Failed to create spare part", error: error.message },
      { status: 500 }
    );
  }
}
