"use client";

import { ServiceRequiredSparePart } from "@/types/serviceRequiredSpareParts";
import { ServiceRequiredSparePartFormValues } from "@/schemas/serviceRequiredSparePart";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchServices } from "@/store/slices/serviceSlice";
import { fetchSpareParts } from "@/store/slices/sparePartSlice";

import ServiceRequiredSparePartDialog from "./ServiceRequiredSparePartDialog";

interface ServiceRequiredSparePartDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: ServiceRequiredSparePartFormValues) => Promise<void>;
  initialData?: ServiceRequiredSparePart;
}

export default function ServiceRequiredSparePartDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: ServiceRequiredSparePartDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const services = useAppSelector((state) => state.services.services);
  const servicesStatus = useAppSelector((state) => state.services.status);
  const spareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartsStatus = useAppSelector((state) => state.spareParts.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (servicesStatus === 'idle' || servicesStatus === 'failed') {
      dispatch(fetchServices());
    }
    if (sparePartsStatus === 'idle' || sparePartsStatus === 'failed') {
      dispatch(fetchSpareParts());
    }
  }, [dispatch, servicesStatus, sparePartsStatus]);

  return (
    <ServiceRequiredSparePartDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      services={services}
      spareParts={spareParts}
      servicesStatus={servicesStatus}
      sparePartsStatus={sparePartsStatus}
    />
  );
}
