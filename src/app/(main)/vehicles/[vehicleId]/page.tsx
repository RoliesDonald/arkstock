"use client";

import VehicleDialog from "@/components/dialog/vehicleDialog/VehicleDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCompanies } from "@/store/slices/companySlice";
import { fetchVehicles, updateVehicle } from "@/store/slices/vehicleSlice";
import { Company } from "@/types/companies";
import { Vehicle, VehicleFormValues, VehicleStatus } from "@/types/vehicle";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { id as localeId } from "date-fns/locale";
import { format } from "date-fns";

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = params.vehicleId as string;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const allVehicles = useAppSelector((state) => state.vehicles.vehicles);
  const vehicleStatus = useAppSelector((state) => state.vehicles.status);
  const vehicleError = useAppSelector((state) => state.vehicles.error);

  const allCompanies = useAppSelector((state) => state.companies.companies);
  const companyStatus = useAppSelector((state) => state.companies.status);

  const [isVehicleDialogOpen, setIsVehicleDialogOpen] =
    useState<boolean>(false);
  const [editVehicleData, setEditVehicleData] = useState<Vehicle | undefined>(
    undefined
  );

  const handleBackToList = useCallback(() => {
    router.back();
  }, [router]);

  const currentVehicle = allVehicles.find((veh) => veh.id === vehicleId);

  useEffect(() => {
    if (vehicleStatus === "idle" || allVehicles.length === 0) {
      dispatch(fetchVehicles());
    }
    if (companyStatus === "idle") {
      dispatch(fetchCompanies());
    }
  }, [dispatch, vehicleStatus, companyStatus, allVehicles.length]);

  const getCompanyNameById = useCallback(
    (companyId: string | null | undefined) => {
      if (!companyId) {
        return "N/A";
      }
      const company = allCompanies.find((com: Company) => com.id === companyId);
      return company ? company.companyName : "Tidak Dikenal";
    },
    [allCompanies]
  );

  const handleEditVehicle = useCallback(() => {
    if (currentVehicle) {
      setEditVehicleData(currentVehicle);
      setIsVehicleDialogOpen(true);
    }
  }, [currentVehicle]);

  const handelSaveVehicle = useCallback(
    async (values: VehicleFormValues) => {
      if (values.id) {
        const existingVehicle = allVehicles.find((v) => v.id === values.id);
        if (existingVehicle) {
          const fullUpdatedVehicle: Vehicle = {
            ...existingVehicle,
            ...values,
            updatedAt: new Date(),
          };
          await dispatch(updateVehicle(fullUpdatedVehicle));
        }
      }
    },
    [dispatch, allVehicles]
  );

  const handleDialogClose = useCallback(() => {
    setIsVehicleDialogOpen(false);
    setEditVehicleData(undefined);
  }, []);

  if (vehicleStatus === "loading" || companyStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Memuat detail kendaraan</p>
      </div>
    );
  }

  if (vehicleStatus === "failed") {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-arkRed-500">Error : {vehicleError}</p>
      </div>
    );
  }

  if (vehicleStatus === "succeeded" && !currentVehicle) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">
          Kendaraan tidak ditemukan, Pastikan ID kendaraan di URL benar
        </p>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8 space-y-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {currentVehicle?.licensePlate}
            </CardTitle>
            <CardDescription className="text-arkBg-600 pt-2">
              Detail Lengkap kendaraan
            </CardDescription>
          </div>
          <div className="flex space-x-4">
            <Button variant={"outline"} onClick={handleBackToList}>
              Back
            </Button>
            <Button onClick={handleEditVehicle}>Edit Kendaraan</Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
          {/* Kolom Kiri */}
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">No. Pol.</p>
              <p>: {currentVehicle?.licensePlate}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Category</p>
              <p>: {currentVehicle?.vehicleCategory}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Merk</p>
              <p>: {currentVehicle?.vehicleMake}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Model</p>
              <p>: {currentVehicle?.model}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Trim Type</p>
              <p>: {currentVehicle?.trimLevel}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Fuel Type</p>
              <p>: {currentVehicle?.fuelType}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Transmission</p>
              <p>: {currentVehicle?.transmissionType}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Status</p>
              <p>
                :
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ml-1 ${
                    currentVehicle?.status === VehicleStatus.ACTIVE
                      ? "bg-green-100 text-green-800"
                      : currentVehicle?.status === VehicleStatus.AVAILABLE
                      ? "bg-arkBlue-100 text-arkBlue-800"
                      : currentVehicle?.status === VehicleStatus.IN_MAINTENANCE
                      ? "bg-arkOrange-100 text-arkOrange-800"
                      : currentVehicle?.status === VehicleStatus.ON_HOLD
                      ? "bg-arkOrange-100 text-arkOrange-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentVehicle?.status.replace(/_/g, " ")}
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Tahun Produksi </p>
              <p>: {currentVehicle?.yearMade}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">No. Mesin </p>
              <p>: {currentVehicle?.engineNum}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">No. Rangka </p>
              <p>: {currentVehicle?.vinNum || "N/A"}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Odometer </p>
              <p>: {currentVehicle?.lastOdometer}</p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Service Terakhir </p>
              <p>
                :{" "}
                {format(currentVehicle!.lastServiceDate, "dd-MM-yyyy", {
                  locale: localeId,
                })}
              </p>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">Pemilik </p>
              <p>: {getCompanyNameById(currentVehicle?.ownerId)}</p>
            </div>
            {/* Penyewa */}
            <div className="grid grid-cols-[180px_1fr] items-baseline">
              <p className="font-bold">User/Pemakai </p>
              <p>: {getCompanyNameById(currentVehicle?.carUserId)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {isVehicleDialogOpen && (
        <VehicleDialog
          onSubmitVehicle={handelSaveVehicle}
          onClose={handleDialogClose}
          initialData={editVehicleData}
        />
      )}
    </div>
  );
}
