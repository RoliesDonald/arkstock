// src/components/dialog/estimationItemDialog/_components/EstimationItemDialogWrapper.tsx
"use client";

import { EstimationItem } from "@/types/estimationItems";
import { EstimationItemFormValues } from "@/schemas/estimationItem";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchEstimations } from "@/store/slices/estimationSlice";
import { fetchSpareParts } from "@/store/slices/sparePartSlice";

import EstimationItemDialog from "./EstimationItemDialog";

interface EstimationItemDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: EstimationItemFormValues) => Promise<void>;
  initialData?: EstimationItem;
}

export default function EstimationItemDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: EstimationItemDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const estimations = useAppSelector((state) => state.estimations.estimations);
  const estimationsStatus = useAppSelector((state) => state.estimations.status);
  const spareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartsStatus = useAppSelector((state) => state.spareParts.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (estimationsStatus === 'idle' || estimationsStatus === 'failed') {
      dispatch(fetchEstimations());
    }
    if (sparePartsStatus === 'idle' || sparePartsStatus === 'failed') {
      dispatch(fetchSpareParts());
    }
  }, [dispatch, estimationsStatus, sparePartsStatus]);

  return (
    <EstimationItemDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      estimations={estimations}
      spareParts={spareParts}
      estimationsStatus={estimationsStatus}
      sparePartsStatus={sparePartsStatus}
    />
  );
}
