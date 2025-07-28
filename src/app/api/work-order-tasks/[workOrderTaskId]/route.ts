import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil detail tugas work order berdasarkan ID
export async function GET(request: Request, { params }: { params: { workOrderTaskId: string } }) {
  const { workOrderTaskId } = params;
  try {
    const workOrderTask = await prisma.workOrderTask.findUnique({
      where: { id: workOrderTaskId },
      include: {
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
      },
    });

    if (!workOrderTask) {
      return NextResponse.json({ message: "Work Order Task not found" }, { status: 404 });
    }
    return NextResponse.json(workOrderTask, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work order task:", error);
    return NextResponse.json(
      { message: "Failed to fetch work order task", error: error.message },
      { status: 500 }
    );
  }
}

// Memperbarui tugas work order
export async function PUT(request: Request, { params }: { params: { workOrderTaskId: string } }) {
  const { workOrderTaskId } = params;
  try {
    const body = await request.json();
    const { workOrderId, taskName, description, status, assignedToId, startTime, endTime, notes } = body;

    const updatedWorkOrderTask = await prisma.workOrderTask.update({
      where: { id: workOrderTaskId },
      data: {
        workOrder: { connect: { id: workOrderId } },
        taskName,
        description,
        status,
        assignedTo: assignedToId ? { connect: { id: assignedToId } } : { disconnect: true },
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        notes,
      },
      include: {
        // Sertakan relasi yang sama seperti GET untuk konsistensi respons
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            position: true,
          },
        },
      },
    });
    return NextResponse.json(updatedWorkOrderTask, { status: 200 });
  } catch (error: any) {
    console.error("Error updating work order task:", error);
    return NextResponse.json(
      { message: "Failed to update work order task", error: error.message },
      { status: 500 }
    );
  }
}

// Menghapus tugas work order
export async function DELETE(request: Request, { params }: { params: { workOrderTaskId: string } }) {
  const { workOrderTaskId } = params;
  try {
    await prisma.workOrderTask.delete({
      where: { id: workOrderTaskId },
    });
    return NextResponse.json({ message: "Work Order Task deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting work order task:", error);
    return NextResponse.json(
      { message: "Failed to delete work order task", error: error.message },
      { status: 500 }
    );
  }
}
