import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail jasa invoice berdasarkan ID
export async function GET(request: Request, { params }: { params: { invoiceServiceId: string } }) {
  const { invoiceServiceId } = params;
  try {
    const invoiceService = await prisma.invoiceService.findUnique({
      where: { id: invoiceServiceId },
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    if (!invoiceService) {
      return NextResponse.json({ message: "Invoice Service not found" }, { status: 404 });
    }
    return NextResponse.json(invoiceService, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching invoice service:", error);
    return NextResponse.json(
      { message: "Failed to fetch invoice service", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui jasa invoice
export async function PUT(request: Request, { params }: { params: { invoiceServiceId: string } }) {
  const { invoiceServiceId } = params;
  try {
    const body = await request.json();
    const { invoiceId, serviceId, quantity, unitPrice, totalPrice } = body;

    const updatedInvoiceService = await prisma.invoiceService.update({
      where: { id: invoiceServiceId },
      data: {
        invoice: { connect: { id: invoiceId } },
        service: { connect: { id: serviceId } },
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseFloat(totalPrice),
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });
    return NextResponse.json(updatedInvoiceService, { status: 200 });
  } catch (error: any) {
    console.error("Error updating invoice service:", error);
    return NextResponse.json(
      { message: "Failed to update invoice service", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus jasa invoice
export async function DELETE(request: Request, { params }: { params: { invoiceServiceId: string } }) {
  const { invoiceServiceId } = params;
  try {
    await prisma.invoiceService.delete({
      where: { id: invoiceServiceId },
    });
    return NextResponse.json({ message: "Invoice Service deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting invoice service:", error);
    return NextResponse.json(
      { message: "Failed to delete invoice service", error: error.message },
      { status: 500 }
    );
  }
}
