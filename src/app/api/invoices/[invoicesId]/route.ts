import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi untuk mengambil detail Invoice berdasarkan ID
export async function GET(request: Request, { params }: { params: { invoiceId: string } }) {
  const { invoiceId } = params;
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        workOrder: {
          // Sertakan WorkOrder
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        vehicle: {
          // Sertakan Vehicle
          select: {
            id: true,
            licensePlate: true,
            vehicleMake: true,
            model: true,
          },
        },
        accountant: {
          // Sertakan Accountant (Employee)
          select: {
            id: true,
            name: true,
            position: true, // Pastikan 'position' disertakan
          },
        },
        approvedBy: {
          // Sertakan ApprovedBy (Employee)
          select: {
            id: true,
            name: true,
            position: true, // Pastikan 'position' disertakan
          },
        },
        // Anda bisa menyertakan invoiceItems dan invoiceServices di sini jika ingin
      },
    });

    if (!invoice) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(invoice, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ message: "Failed to fetch invoice", error: error.message }, { status: 500 });
  }
}

// Fungsi untuk memperbarui Invoice
export async function PUT(request: Request, { params }: { params: { invoiceId: string } }) {
  const { invoiceId } = params;
  try {
    const body = await request.json();
    const {
      invoiceNumber,
      invoiceDate,
      requestOdo,
      actualOdo,
      remark,
      finishedDate,
      totalAmount,
      status,
      workOrderId, // workOrderId mungkin tidak perlu diupdate jika sudah unik
      vehicleId,
      accountantId,
      approvedById,
    } = body;

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        invoiceNumber,
        invoiceDate: new Date(invoiceDate),
        requestOdo,
        actualOdo,
        remark,
        finishedDate: new Date(finishedDate),
        totalAmount: parseFloat(totalAmount),
        status,
        // workOrderId tidak diupdate karena @unique, diasumsikan tidak berubah
        vehicle: { connect: { id: vehicleId } },
        accountant: accountantId ? { connect: { id: accountantId } } : { disconnect: true }, // Handle null/undefined
        approvedBy: approvedById ? { connect: { id: approvedById } } : { disconnect: true }, // Handle null/undefined
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            licensePlate: true,
            vehicleMake: true,
            model: true,
          },
        },
        accountant: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
      },
    });
    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error: any) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ message: "Failed to update invoice", error: error.message }, { status: 500 });
  }
}

// Fungsi untuk menghapus Invoice
export async function DELETE(request: Request, { params }: { params: { invoiceId: string } }) {
  const { invoiceId } = params;
  try {
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });
    return NextResponse.json({ message: "Invoice deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ message: "Failed to delete invoice", error: error.message }, { status: 500 });
  }
}
