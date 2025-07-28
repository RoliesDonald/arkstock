import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail transaksi stok berdasarkan ID
export async function GET(request: Request, { params }: { params: { stockTransactionId: string } }) {
  const { stockTransactionId } = params;
  try {
    const stockTransaction = await prisma.stockTransaction.findUnique({
      where: { id: stockTransactionId },
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
    });

    if (!stockTransaction) {
      return NextResponse.json({ message: "Stock Transaction not found" }, { status: 404 });
    }
    return NextResponse.json(stockTransaction, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching stock transaction:", error);
    return NextResponse.json(
      { message: "Failed to fetch stock transaction", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui transaksi stok
export async function PUT(request: Request, { params }: { params: { stockTransactionId: string } }) {
  const { stockTransactionId } = params;
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

    const updatedStockTransaction = await prisma.stockTransaction.update({
      where: { id: stockTransactionId },
      data: {
        transactionNumber,
        transactionDate: new Date(transactionDate),
        type,
        sparePart: { connect: { id: sparePartId } },
        sourceWarehouse: { connect: { id: sourceWarehouseId } },
        targetWarehouse: targetWarehouseId ? { connect: { id: targetWarehouseId } } : { disconnect: true },
        quantity: parseInt(quantity),
        notes,
        processedBy: processedById ? { connect: { id: processedById } } : { disconnect: true },
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        sparePart: {
          select: {
            id: true,
            partNumber: true,
            partName: true,
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
    return NextResponse.json(updatedStockTransaction, { status: 200 });
  } catch (error: any) {
    console.error("Error updating stock transaction:", error);
    return NextResponse.json(
      { message: "Failed to update stock transaction", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus transaksi stok
export async function DELETE(request: Request, { params }: { params: { stockTransactionId: string } }) {
  const { stockTransactionId } = params;
  try {
    await prisma.stockTransaction.delete({
      where: { id: stockTransactionId },
    });
    return NextResponse.json({ message: "Stock Transaction deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting stock transaction:", error);
    return NextResponse.json(
      { message: "Failed to delete stock transaction", error: error.message },
      { status: 500 }
    );
  }
}
