"use client";

import { InvoiceService } from "@/types/invoiceServices";
import { InvoiceServiceFormValues } from "@/schemas/invoiceService";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchInvoices } from "@/store/slices/invoiceSlice";
import { fetchServices } from "@/store/slices/serviceSlice";

import InvoiceServiceDialog from "./InvoiceServiceDialog";

interface InvoiceServiceDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: InvoiceServiceFormValues) => Promise<void>;
  initialData?: InvoiceService;
}

export default function InvoiceServiceDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: InvoiceServiceDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const invoices = useAppSelector((state) => state.invoices.invoices);
  const invoicesStatus = useAppSelector((state) => state.invoices.status);
  const services = useAppSelector((state) => state.services.services);
  const servicesStatus = useAppSelector((state) => state.services.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (invoicesStatus === 'idle' || invoicesStatus === 'failed') {
      dispatch(fetchInvoices());
    }
    if (servicesStatus === 'idle' || servicesStatus === 'failed') {
      dispatch(fetchServices());
    }
  }, [dispatch, invoicesStatus, servicesStatus]);

  return (
    <InvoiceServiceDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      invoices={invoices}
      services={services}
      invoicesStatus={invoicesStatus}
      servicesStatus={servicesStatus}
    />
  );
}
