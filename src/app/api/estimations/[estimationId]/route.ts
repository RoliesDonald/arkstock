import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail estimasi berdasarkan ID
export async function GET(request: Request, { params }: { params: { estimationId: string } }) {
  const { estimationId } = params;
  try {
    const estimation = await prisma.estimation.findUnique({
      where: { id: estimationId },
      include: {
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
        mechanic: {
          select: {
            id: true,
            name: true,
            position: true,
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

    if (!estimation) {
      return NextResponse.json({ message: "Estimation not found" }, { status: 404 });
    }
    return NextResponse.json(estimation, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching estimation:", error);
    return NextResponse.json(
      { message: "Failed to fetch estimation", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui estimasi
export async function PUT(request: Request, { params }: { params: { estimationId: string } }) {
  const { estimationId } = params;
  try {
    const body = await request.json();
    const {
      estimationNumber,
      estimationDate,
      requestOdo,
      actualOdo,
      remark,
      notes,
      finishedDate,
      totalEstimatedAmount,
      status,
      workOrderId,
      vehicleId,
      mechanicId,
      accountantId,
      approvedById,
    } = body;

    const updatedEstimation = await prisma.estimation.update({
      where: { id: estimationId },
      data: {
        estimationNumber,
        estimationDate: new Date(estimationDate),
        requestOdo: parseInt(requestOdo),
        actualOdo: parseInt(actualOdo),
        remark,
        notes,
        finishedDate: finishedDate ? new Date(finishedDate) : null,
        totalEstimatedAmount: parseFloat(totalEstimatedAmount),
        status,
        workOrder: { connect: { id: workOrderId } }, // workOrderId adalah @unique, jadi harus tetap terhubung
        vehicle: { connect: { id: vehicleId } },
        mechanic: mechanicId ? { connect: { id: mechanicId } } : { disconnect: true },
        accountant: accountantId ? { connect: { id: accountantId } } : { disconnect: true },
        approvedBy: approvedById ? { connect: { id: approvedById } } : { disconnect: true },
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
        mechanic: {
          select: {
            id: true,
            name: true,
            position: true,
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
    return NextResponse.json(updatedEstimation, { status: 200 });
  } catch (error: any) {
    console.error("Error updating estimation:", error);
    return NextResponse.json(
      { message: "Failed to update estimation", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus estimasi
export async function DELETE(request: Request, { params }: { params: { estimationId: string } }) {
  const { estimationId } = params;
  try {
    await prisma.estimation.delete({
      where: { id: estimationId },
    });
    return NextResponse.json({ message: "Estimation deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting estimation:", error);
    return NextResponse.json(
      { message: "Failed to delete estimation", error: error.message },
      { status: 500 }
    );
  }
}
