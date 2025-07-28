import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil semua transaksi stok
export async function GET() {
  try {
    const stockTransactions = await prisma.stockTransaction.findMany({
      include: {
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
            unit: true,
          },
        },
        sourceWarehouse: {
          select: {
            id: true,
            name: true,
          },
        },
        targetWarehouse: {
          select: {
            id: true,
            name: true,
          },
        },
        processedBy: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(stockTransactions, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching stock transactions:", error);
    return NextResponse.json(
      { message: "Failed to fetch stock transactions", error: error.message },
      { status: 500 }
    );
  }
}

// Membuat transaksi stok baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      transactionNumber,
      transactionDate,
      type,
      sparePartId,
      sourceWarehouseId,
      targetWarehouseId,
      quantity,
      notes,
      processedById,
    } = body;

    const newStockTransaction = await prisma.stockTransaction.create({
      data: {
        transactionNumber,
        transactionDate: new Date(transactionDate),
        type,
        sparePart: { connect: { id: sparePartId } },
        sourceWarehouse: { connect: { id: sourceWarehouseId } },
        ...(targetWarehouseId && { targetWarehouse: { connect: { id: targetWarehouseId } } }),
        quantity: parseInt(quantity),
        notes,
        ...(processedById && { processedBy: { connect: { id: processedById } } }),
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
        sourceWarehouse: {
          select: {
            id: true,
            name: true,
          },
        },
        targetWarehouse: {
          select: {
            id: true,
            name: true,
          },
        },
        processedBy: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
      },
    });
    return NextResponse.json(newStockTransaction, { status: 201 });
  } catch (error: any) {
    console.error("Error creating stock transaction:", error);
    return NextResponse.json(
      { message: "Failed to create stock transaction", error: error.message },
      { status: 500 }
    );
  }
}
