// src/components/dialog/workOrderDialog/_components/WorkOrderDialogWrapper.tsx
"use client";

import { WorkOrder } from "@/types/workOrder";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchCompanies } from "@/store/slices/companySlice";
import { fetchVehicles } from "@/store/slices/vehicleSlice";
import { fetchEmployees } from "@/store/slices/employeeSlice";
import WorkOrderDialog from "./WoDialog";
import { WorkOrderFormValues } from "@/schemas/workOrder";
import { fetchLocations } from "@/store/slices/locationSlice";
// Asumsi Anda akan membuat ini:


interface WorkOrderDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: WorkOrderFormValues) => Promise<void>;
  initialData?: WorkOrder;
}

export default function WorkOrderDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: WorkOrderDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const companies = useAppSelector((state) => state.companies.companies);
  const companiesStatus = useAppSelector((state) => state.companies.status);
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);
  const vehiclesStatus = useAppSelector((state) => state.vehicles.status);
  const employees = useAppSelector((state) => state.employee.employees);
  const employeesStatus = useAppSelector((state) => state.employee.status);
  const locations = useAppSelector((state) => state.location.locations); // <--- ASUMSI: DARI locationSlice
  const locationsStatus = useAppSelector((state) => state.location.status); // <--- ASUMSI: DARI locationSlice

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (companiesStatus === 'idle' || companiesStatus === 'failed') {
      dispatch(fetchCompanies());
    }
    if (vehiclesStatus === 'idle' || vehiclesStatus === 'failed') {
      dispatch(fetchVehicles());
    }
    if (employeesStatus === 'idle' || employeesStatus === 'failed') {
      dispatch(fetchEmployees());
    }
    if (locationsStatus === 'idle' || locationsStatus === 'failed') {
      dispatch(fetchLocations()); // <--- ASUMSI: DISPATCH INI AKAN DIBUAT
    }
  }, [dispatch, companiesStatus, vehiclesStatus, employeesStatus, locationsStatus]);

  return (
    <WorkOrderDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      companies={companies}
      vehicles={vehicles}
      employees={employees}
      locations={locations}
      companiesStatus={companiesStatus}
      vehiclesStatus={vehiclesStatus}
      employeesStatus={employeesStatus}
      locationsStatus={locationsStatus}
    />
  );
}
