"use client";

import { WorkOrderService } from "@/types/workOrderServices";
import { WorkOrderServiceFormValues } from "@/schemas/workOrderService";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";
import { fetchServices } from "@/store/slices/serviceSlice";

import WorkOrderServiceDialog from "./WorkOrderServiceDialog";

interface WorkOrderServiceDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: WorkOrderServiceFormValues) => Promise<void>;
  initialData?: WorkOrderService;
}

export default function WorkOrderServiceDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: WorkOrderServiceDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const workOrders = useAppSelector((state) => state.workOrders.workOrders);
  const workOrdersStatus = useAppSelector((state) => state.workOrders.status);
  const services = useAppSelector((state) => state.services.services);
  const servicesStatus = useAppSelector((state) => state.services.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (workOrdersStatus === 'idle' || workOrdersStatus === 'failed') {
      dispatch(fetchWorkOrders());
    }
    if (servicesStatus === 'idle' || servicesStatus === 'failed') {
      dispatch(fetchServices());
    }
  }, [dispatch, workOrdersStatus, servicesStatus]);

  return (
    <WorkOrderServiceDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      workOrders={workOrders}
      services={services}
      workOrdersStatus={workOrdersStatus}
      servicesStatus={servicesStatus}
    />
  );
}
