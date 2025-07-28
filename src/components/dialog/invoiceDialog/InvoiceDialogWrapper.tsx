"use client";

import { Invoice } from "@/types/invoice";
import { InvoiceFormValues } from "@/schemas/invoice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";
import { fetchEmployees } from "@/store/slices/employeeSlice";
import { fetchVehicles } from "@/store/slices/vehicleSlice";

import InvoiceDialog from "./InvoiceDialog";

interface InvoiceDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: InvoiceFormValues) => Promise<void>;
  initialData?: Invoice;
}

export default function InvoiceDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: InvoiceDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const workOrders = useAppSelector((state) => state.workOrders.workOrders);
  const workOrdersStatus = useAppSelector((state) => state.workOrders.status);
  const employees = useAppSelector((state) => state.employee.employees);
  const employeesStatus = useAppSelector((state) => state.employee.status);
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);
  const vehiclesStatus = useAppSelector((state) => state.vehicles.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (workOrdersStatus === 'idle' || workOrdersStatus === 'failed') {
      dispatch(fetchWorkOrders());
    }
    if (employeesStatus === 'idle' || employeesStatus === 'failed') {
      dispatch(fetchEmployees());
    }
    if (vehiclesStatus === 'idle' || vehiclesStatus === 'failed') {
      dispatch(fetchVehicles());
    }
  }, [dispatch, workOrdersStatus, employeesStatus, vehiclesStatus]);

  return (
    <InvoiceDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      workOrders={workOrders}
      employees={employees}
      vehicles={vehicles}
      workOrdersStatus={workOrdersStatus}
      employeesStatus={employeesStatus}
      vehiclesStatus={vehiclesStatus}
    />
  );
}
