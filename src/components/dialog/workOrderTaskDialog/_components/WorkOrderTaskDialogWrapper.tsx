// src/components/dialog/workOrderTaskDialog/_components/WorkOrderTaskDialogWrapper.tsx
"use client";

import { WorkOrderTask } from "@/types/workOrderTasks";
import { WorkOrderTaskFormValues } from "@/schemas/workOrderTask";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";
import { fetchEmployees } from "@/store/slices/employeeSlice";
import WorkOrderTaskDialog from "./WorkOrderTaskDialog";


interface WorkOrderTaskDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: WorkOrderTaskFormValues) => Promise<void>;
  initialData?: WorkOrderTask;
}

export default function WorkOrderTaskDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: WorkOrderTaskDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const workOrders = useAppSelector((state) => state.workOrders.workOrders);
  const workOrdersStatus = useAppSelector((state) => state.workOrders.status);
  const employees = useAppSelector((state) => state.employee.employees);
  const employeesStatus = useAppSelector((state) => state.employee.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (workOrdersStatus === 'idle' || workOrdersStatus === 'failed') {
      dispatch(fetchWorkOrders());
    }
    if (employeesStatus === 'idle' || employeesStatus === 'failed') {
      dispatch(fetchEmployees());
    }
  }, [dispatch, workOrdersStatus, employeesStatus]);

  return (
    <WorkOrderTaskDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      workOrders={workOrders}
      employees={employees}
      workOrdersStatus={workOrdersStatus}
      employeesStatus={employeesStatus}
    />
  );
}
