// src/app/(main)/work-orders/[woId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchWorkOrders,
  updateWorkOrder,
} from "@/store/slices/workOrderSlice";
import { fetchCompanies } from "@/store/slices/companySlice";
import { fetchVehicles } from "@/store/slices/vehicleSlice";
import { fetchEmployees } from "@/store/slices/employeeSlice";
import {
  WorkOrder,
  WorkOrderFormValues,
  WoProgresStatus,
  WoPriorityType,
} from "@/types/workOrder";
import { Company } from "@/types/companies";
import { Vehicle } from "@/types/vehicle";
import { Employee } from "@/types/employee";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import WoDialog from "@/components/dialog/woDialog/_components/WoDialog";

export default function WorkOrderDetailPage() {
  const params = useParams();
  const woId = params.woId as string;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const allWorkOrders = useAppSelector((state) => state.workOrders.workOrders);
  const woStatus = useAppSelector((state) => state.workOrders.status);
  const woError = useAppSelector((state) => state.workOrders.error);

  // Data tambahan untuk lookup
  const allCompanies = useAppSelector((state) => state.companies.companies);
  const companyStatus = useAppSelector((state) => state.companies.status);
  const allVehicles = useAppSelector((state) => state.vehicles.vehicles);
  const vehicleStatus = useAppSelector((state) => state.vehicles.status);
  const allEmployees = useAppSelector((state) => state.employee.employees);
  const employeeStatus = useAppSelector((state) => state.employee.status);

  const [isWoDialogOpen, setIsWoDialogOpen] = useState<boolean>(false);
  const [editWoData, setEditWoData] = useState<WorkOrder | undefined>(
    undefined
  );

  const currentWorkOrder = allWorkOrders.find((wo) => wo.id === woId);

  useEffect(() => {
    // Fetch Work Orders
    if (woStatus === "idle" || allWorkOrders.length === 0) {
      dispatch(fetchWorkOrders());
    }
    // Fetch Companies
    if (companyStatus === "idle") {
      dispatch(fetchCompanies());
    }
    // Fetch Vehicles
    if (vehicleStatus === "idle") {
      dispatch(fetchVehicles());
    }
    // Fetch Employees (for mechanic, driver, approvedBy, requestedBy names)
    if (employeeStatus === "idle") {
      dispatch(fetchEmployees());
    }
  }, [
    dispatch,
    woStatus,
    allWorkOrders.length,
    companyStatus,
    vehicleStatus,
    employeeStatus,
  ]);

  // Helper untuk mendapatkan nama perusahaan berdasarkan ID
  const getCompanyNameById = useCallback(
    (companyId: string | null | undefined) => {
      if (!companyId) return "N/A";
      const company = allCompanies.find((c: Company) => c.id === companyId);
      return company ? company.companyName : "Tidak Dikenal";
    },
    [allCompanies]
  );

  // Helper untuk mendapatkan plat nomor kendaraan berdasarkan ID
  const getLicensePlateById = useCallback(
    (vehicleId: string | null | undefined) => {
      if (!vehicleId) return "N/A";
      const vehicle = allVehicles.find((v: Vehicle) => v.id === vehicleId);
      return vehicle ? vehicle.licensePlate : "Tidak Dikenal";
    },
    [allVehicles]
  );

  // Helper untuk mendapatkan nama employee berdasarkan ID
  const getEmployeeNameById = useCallback(
    (employeeId: string | null | undefined) => {
      if (!employeeId) return "N/A";
      const employee = allEmployees.find((e: Employee) => e.id === employeeId);
      return employee ? employee.name : "Tidak Dikenal";
    },
    [allEmployees]
  );

  const handleEditClick = useCallback(() => {
    if (currentWorkOrder) {
      setEditWoData(currentWorkOrder);
      setIsWoDialogOpen(true);
    }
  }, [currentWorkOrder]);

  const handleBackToList = useCallback(() => {
    router.back();
  }, [router]);

  const handleSaveWo = useCallback(
    async (values: WorkOrderFormValues) => {
      if (currentWorkOrder) {
        const updatedWo: WorkOrder = {
          ...currentWorkOrder,
          ...values,
          settledOdo: values.settledOdo ?? null,
          schedule: values.schedule ?? undefined,
          notes: values.notes ?? null,
          mechanicId: values.mechanicId ?? null,
          driverId: values.driverId ?? null,
          driverContact: values.driverContact ?? null,
          approvedById: values.approvedById ?? null,
          requestedById: values.requestedById ?? null,
          locationId: values.locationId ?? null,
          updatedAt: new Date(),
          woMaster: values.woMaster ?? null,
          progresStatus: values.progresStatus ?? WoProgresStatus.DRAFT,
          priorityType: values.priorityType ?? WoPriorityType.NORMAL,
          vendorId: values.vendorId ?? null,
          customerId: values.customerId ?? null,
          carUserId: values.carUserId ?? null,
          vehicleId: values.vehicleId ?? null,
          date: values.date ?? new Date(),
          remark: values.remark ?? null,
          serviceLocation: values.serviceLocation ?? null,
          vehicleMake: values.vehicleMake ?? null,
        };
        await dispatch(updateWorkOrder(updatedWo));
        alert("Work Order berhasil diperbarui!");
      }
      setIsWoDialogOpen(false);
      setEditWoData(undefined);
    },
    [dispatch, currentWorkOrder]
  );

  const handleDialogClose = useCallback(() => {
    setIsWoDialogOpen(false);
    setEditWoData(undefined);
  }, []);

  // Kondisi loading untuk semua data yang dibutuhkan
  if (
    woStatus === "loading" ||
    companyStatus === "loading" ||
    vehicleStatus === "loading" ||
    employeeStatus === "loading"
  ) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Memuat detail Work Order...</p>
      </div>
    );
  }

  // Kondisi error fetching WO
  if (woStatus === "failed") {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-red-500">Error: {woError}</p>
      </div>
    );
  }

  // PERBAIKAN RUNTIME ERROR: Pastikan currentWorkOrder ada sebelum merender detailnya
  if (!currentWorkOrder) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">
          Work Order tidak ditemukan. Pastikan ID Work Order di URL benar.
        </p>
      </div>
    );
  }

  // Jika sampai sini, currentWorkOrder dijamin ada
  return (
    <div className="container mx-auto py-8 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            {/* Tidak perlu lagi '!' karena sudah dipastikan di atas */}
            <CardTitle className="text-3xl font-bold">
              {currentWorkOrder.woNumber}
            </CardTitle>
            <CardDescription className="text-gray-600">
              Detail Lengkap Work Order
            </CardDescription>
          </div>
          <div className="flex space-x-4">
            <Button variant={"outline"} onClick={handleBackToList}>
              Back
            </Button>
            <Button onClick={handleEditClick}>Edit Work Order</Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
          {/* Kolom Kiri */}
          <div className="space-y-3 p-4 ">
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Nomor WO</p>
              <p>: {currentWorkOrder.woNumber}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">WO Master</p>
              <p>: {currentWorkOrder.woMaster}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Tanggal WO</p>
              <p>
                :
                {format(currentWorkOrder.date, "dd MMMM yyyy", {
                  locale: localeId,
                })}
              </p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Odometer</p>
              <p>: {currentWorkOrder.settledOdo ?? "N/A"} KM</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Keluhan</p>
              <p>: {currentWorkOrder.remark}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Jadwal</p>
              <p>
                :{" "}
                {currentWorkOrder.schedule
                  ? format(currentWorkOrder.schedule, "dd MMMM yyyy", {
                      locale: localeId,
                    })
                  : "N/A"}
              </p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Lokasi Servis</p>
              <p>: {currentWorkOrder.serviceLocation}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Catatan</p>
              <p>: {currentWorkOrder.notes || "N/A"}</p>
            </div>
          </div>
          {/* Kolom Kanan */}
          <div className="space-y-3 p-4 ">
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Plat Nomor Kendaraan</p>
              <p>: {getLicensePlateById(currentWorkOrder.vehicleId)}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Merk Kendaraan</p>
              <p>: {currentWorkOrder.vehicleMake}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Customer</p>
              <p>: {getCompanyNameById(currentWorkOrder.customerId)}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Pengguna Kendaraan</p>
              <p>: {getCompanyNameById(currentWorkOrder.carUserId)}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Vendor (Bengkel)</p>
              <p>: {getCompanyNameById(currentWorkOrder.vendorId)}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Mekanik</p>
              <p>: {getEmployeeNameById(currentWorkOrder.mechanicId)}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Driver</p>
              <p>: {getEmployeeNameById(currentWorkOrder.driverId)}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Kontak Driver</p>
              <p>: {currentWorkOrder.driverContact || "N/A"}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Disetujui Oleh</p>
              <p>: {getEmployeeNameById(currentWorkOrder.approvedById)}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Diminta Oleh</p>
              <p>: {getEmployeeNameById(currentWorkOrder.requestedById)}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Lokasi Kendaraan</p>
              <p>: {currentWorkOrder.locationId || "N/A"}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Status Progres</p>
              <p>: {currentWorkOrder.progresStatus.replace(/_/g, " ")}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Tipe Prioritas</p>
              <p>: {currentWorkOrder.priorityType.replace(/_/g, " ")}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Dibuat Pada</p>
              <p>
                :{" "}
                {format(currentWorkOrder.createdAt, "dd MMMM yyyy HH:mm", {
                  locale: localeId,
                })}
              </p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Terakhir Diperbarui</p>
              <p>
                :{" "}
                {format(currentWorkOrder.updatedAt, "dd MMMM yyyy HH:mm", {
                  locale: localeId,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog untuk Edit Work Order */}
      <Card className="shadow-none border-none">
        <CardContent>
          {isWoDialogOpen && (
            <WoDialog
              onSubmitWorkOrder={handleSaveWo}
              onClose={handleDialogClose}
              initialData={editWoData}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
