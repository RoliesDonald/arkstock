"use client";

import { WorkOrderSparePart } from "@/types/workOrderSpareParts";
import { WorkOrderSparePartFormValues } from "@/schemas/workOrderSparePart";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";
import { fetchSpareParts } from "@/store/slices/sparePartSlice";

import WorkOrderSparePartDialog from "./WorkOrderSparePartDialog";

interface WorkOrderSparePartDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: WorkOrderSparePartFormValues) => Promise<void>;
  initialData?: WorkOrderSparePart;
}

export default function WorkOrderSparePartDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: WorkOrderSparePartDialogWrapperProps) {
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
    <WorkOrderSparePartDialog
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
