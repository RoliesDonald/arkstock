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
import { Separator } from "@/components/ui/separator";

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
      return company ? company.companyName : "Tidak Dikenal Coy";
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

  // Pastikan currentWorkOrder ada sebelum merender detailnya
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
    <div>
      <div className="flex space-x-4 justify-between pr-4 mr-1">
        <h2 className="text-lg text-arkBg-500 font-bold ">
          {currentWorkOrder.woNumber}
        </h2>
        <div className="flex space-x-4">
          <Button variant={"outline"} onClick={handleBackToList}>
            Back
          </Button>
          <Button onClick={handleEditClick}>Edit Work Order</Button>
        </div>
      </div>
      <Card className="w-full shadow-md rounded-md overflow-hidden my-2 p-2">
        <CardHeader className="pb-4 border-b border-arkBlue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-arkBlue-700">
                Logo Customer
              </span>
            </div>
            <CardTitle className="text-2xl font-semibold text-arkBg-100 border px-4 py-2 rounded-2xl bg-arkBlue-600">
              Surat Perintah Kerja
            </CardTitle>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-sm text-arkBg-700 mb-4">
              <p className="font-semibold">{currentWorkOrder.customerId}</p>
              <p>{getCompanyNameById(currentWorkOrder.locationId)}</p>
              <p>JAKARTA 10270</p>
              <p>{getCompanyNameById(currentWorkOrder.driverContact)}</p>
            </div>
            <div className="flex flex-col items-end justify-end">
              <p className="mb-3 items-end bg-arkBlue-100 rounded-lg">
                <span className="p-4 font-semibold ">
                  {currentWorkOrder.priorityType}
                </span>
              </p>

              <div className="flex flex-col items-end border-red-200 border-2 px-2 py-1 rounded-lg">
                <p className="text-sm">
                  No. WO :
                  <span className="font-semibold ">
                    {currentWorkOrder.woNumber}
                  </span>
                </p>
                <p className="text-sm">
                  WO. Customer :
                  <span className="font-semibold ">
                    {currentWorkOrder.woMaster}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Detail Kepada */}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-2 text-arkBg-800">
              Kepada:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-arkBg-700">
              <div className="flex">
                <span className="w-24 font-medium">Nama:</span>
                <span className="text-arkBlue-800 font-semibold">
                  {currentWorkOrder.vendorId}
                </span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">UP:</span>
                <span>{getEmployeeNameById(currentWorkOrder.carUserId)}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Alamat:</span>
                <span>{currentWorkOrder.locationId}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Telp:</span>
                <span>{currentWorkOrder.carUserId}</span>
              </div>
            </div>
          </div>
          {/* Detail Kendaraan*/}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-2 text-arkBg-800">
              Data Kendaraan:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-arkBg-700">
              <div className="flex">
                <span className="w-24 font-medium">No. Polisi:</span>
                <span>{}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Merk / Type:</span>
                <span>{currentWorkOrder.vehicleMake}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Tahun / Warna:</span>
                <span></span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">No. Rangka:</span>
                <span></span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">No. Mesin:</span>
                <span></span>
              </div>
              <div className="flex">
                <span className="w-24 font-medium">Actual KM:</span>
                <span>{currentWorkOrder.settledOdo ?? "N/A"}</span>
              </div>
            </div>
          </div>
          <div className="mb-6 border-b pb-4 text-sm text-arkBg-700">
            <p>
              Remark: <span>{currentWorkOrder.remark}</span>
            </p>

            <p>
              Request pengerjaan pada tanggal:{" "}
              <span className="font-semibold">
                {format(currentWorkOrder.schedule ?? new Date(), "dd/MM/yyyy", {
                  locale: localeId,
                })}
              </span>
            </p>
          </div>

          {/* Daftar Jasa */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-arkBg-800">Jasa:</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-arkBg-200 rounded-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left text-xs font-medium text-arkBg-500 uppercase tracking-wider border-b">
                      No
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-arkBg-500 uppercase tracking-wider border-b">
                      Jasa
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-arkBg-500 uppercase tracking-wider border-b">
                      Quantity
                    </th>
                  </tr>
                </thead>
                {/* <tbody className="divide-y divide-gray-200">
                  {currentWorkOrder.services.length > 0 ? (
                    workOrder.services.map((service, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                          {service.name}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                          {service.quantity}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-4 px-4 text-center text-sm text-gray-500"
                      >
                        Tidak ada jasa yang terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody> */}
              </table>
            </div>
          </div>

          {/* Daftar Item (Suku Cadang) */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Item (Suku Cadang):
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      No
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Item
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Quantity
                    </th>
                  </tr>
                </thead>
                {/* <tbody className="divide-y divide-gray-200">
                  {workOrder.items.length > 0 ? (
                    workOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                          {item.name}
                        </td>
                        <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-800">
                          {item.quantity}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-4 px-4 text-center text-sm text-gray-500"
                      >
                        Tidak ada item suku cadang yang terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody> */}
              </table>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm text-gray-700">
            <div>
              <p className="font-medium">SPK NO:</p>
              <p>{}</p>
            </div>
            <div>
              <p className="font-medium">Cabang:</p>
              <p>{}</p>
            </div>
            <div>
              <p className="font-medium">Tanggal:</p>
              <p>
                {format(currentWorkOrder.date, "dd/MM/yyyy", {
                  locale: localeId,
                })}
              </p>
            </div>
          </div>

          {/* Catatan */}
          <div className="mb-6 text-sm text-gray-700">
            <p className="font-semibold mb-2">Catatan:</p>
            <p className="italic text-gray-600">{}</p>
          </div>

          {/* Catatan Invoice Penagihan */}
          <div className="mb-6 text-sm text-gray-700">
            <p className="font-semibold mb-2">Catatan Invoice Penagihan:</p>
            <p className="italic text-gray-600">{}</p>
          </div>

          {/* Tanda Tangan */}
          <div className="text-right mt-8">
            <p className="font-semibold text-gray-800">PT. DIPO STAR FINANCE</p>
            <div className="mt-12 mb-2">
              <p className="font-bold text-gray-800">{}</p>
              <p className="text-sm text-gray-600">()</p>
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
