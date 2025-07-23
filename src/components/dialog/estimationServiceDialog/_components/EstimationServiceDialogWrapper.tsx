"use client";

import { EstimationService } from "@/types/estimationServices";
import { EstimationServiceFormValues } from "@/schemas/estimationService";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchEstimations } from "@/store/slices/estimationSlice";
import { fetchServices } from "@/store/slices/serviceSlice";

import EstimationServiceDialog from "./EstimationServiceDialog";

interface EstimationServiceDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: EstimationServiceFormValues) => Promise<void>;
  initialData?: EstimationService;
}

export default function EstimationServiceDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: EstimationServiceDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const estimations = useAppSelector((state) => state.estimations.estimations);
  const estimationsStatus = useAppSelector((state) => state.estimations.status);
  const services = useAppSelector((state) => state.services.services);
  const servicesStatus = useAppSelector((state) => state.services.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (estimationsStatus === 'idle' || estimationsStatus === 'failed') {
      dispatch(fetchEstimations());
    }
    if (servicesStatus === 'idle' || servicesStatus === 'failed') {
      dispatch(fetchServices());
    }
  }, [dispatch, estimationsStatus, servicesStatus]);

  return (
    <EstimationServiceDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      estimations={estimations}
      services={services}
      estimationsStatus={estimationsStatus}
      servicesStatus={servicesStatus}
    />
  );
}
