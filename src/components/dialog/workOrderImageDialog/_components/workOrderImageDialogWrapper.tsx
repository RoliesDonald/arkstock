"use client";

import { WorkOrderImage } from "@/types/workOrderImages";
import { WorkOrderImageFormValues } from "@/schemas/workOrderImage";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";

import WorkOrderImageDialog from "./WorkOrderImageDialog";

interface WorkOrderImageDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: WorkOrderImageFormValues) => Promise<void>;
  initialData?: WorkOrderImage;
}

export default function WorkOrderImageDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: WorkOrderImageDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const workOrders = useAppSelector((state) => state.workOrders.workOrders);
  const workOrdersStatus = useAppSelector((state) => state.workOrders.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (workOrdersStatus === 'idle' || workOrdersStatus === 'failed') {
      dispatch(fetchWorkOrders());
    }
  }, [dispatch, workOrdersStatus]);

  return (
    <WorkOrderImageDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      workOrders={workOrders}
      workOrdersStatus={workOrdersStatus}
    />
  );
}
