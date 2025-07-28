"use client";

import { WorkOrderItem } from "@/types/workOrderItems";
import { WorkOrderItemFormValues } from "@/schemas/workOrderItem";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";
import { fetchSpareParts } from "@/store/slices/sparePartSlice";

import WorkOrderItemDialog from "./WorkOrderItemDialog";

interface WorkOrderItemDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: WorkOrderItemFormValues) => Promise<void>;
  initialData?: WorkOrderItem;
}

export default function WorkOrderItemDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: WorkOrderItemDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const workOrders = useAppSelector((state) => state.workOrders.workOrders);
  const workOrdersStatus = useAppSelector((state) => state.workOrders.status);
  const spareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartsStatus = useAppSelector((state) => state.spareParts.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (workOrdersStatus === 'idle' || workOrdersStatus === 'failed') {
      dispatch(fetchWorkOrders());
    }
    if (sparePartsStatus === 'idle' || sparePartsStatus === 'failed') {
      dispatch(fetchSpareParts());
    }
  }, [dispatch, workOrdersStatus, sparePartsStatus]);

  return (
    <WorkOrderItemDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      workOrders={workOrders}
      spareParts={spareParts}
      workOrdersStatus={workOrdersStatus}
      sparePartsStatus={sparePartsStatus}
    />
  );
}
