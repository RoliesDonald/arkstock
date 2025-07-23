// src/components/dialog/estimationDialog/_components/EstimationDialogWrapper.tsx
"use client";

import { Estimation } from "@/types/estimation";
import { EstimationFormValues } from "@/schemas/estimation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";
import { fetchVehicles } from "@/store/slices/vehicleSlice";
import { fetchEmployees } from "@/store/slices/employeeSlice";
import EstimationDialog from "./estimationDialog";


interface EstimationDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: EstimationFormValues) => Promise<void>;
  initialData?: Estimation;
}

export default function EstimationDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: EstimationDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const workOrders = useAppSelector((state) => state.workOrders.workOrders);
  const workOrdersStatus = useAppSelector((state) => state.workOrders.status);
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);
  const vehiclesStatus = useAppSelector((state) => state.vehicles.status);
  const employees = useAppSelector((state) => state.employee.employees);
  const employeesStatus = useAppSelector((state) => state.employee.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (workOrdersStatus === 'idle' || workOrdersStatus === 'failed') {
      dispatch(fetchWorkOrders());
    }
    if (vehiclesStatus === 'idle' || vehiclesStatus === 'failed') {
      dispatch(fetchVehicles());
    }
    if (employeesStatus === 'idle' || employeesStatus === 'failed') {
      dispatch(fetchEmployees());
    }
  }, [dispatch, workOrdersStatus, vehiclesStatus, employeesStatus]);

  return (
    <EstimationDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      workOrders={workOrders}
      vehicles={vehicles}
      employees={employees}
      workOrdersStatus={workOrdersStatus}
      vehiclesStatus={vehiclesStatus}
      employeesStatus={employeesStatus}
    />
  );
}
