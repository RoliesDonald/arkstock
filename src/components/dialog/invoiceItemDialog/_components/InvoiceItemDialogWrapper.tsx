"use client";

import { InvoiceItem } from "@/types/invoiceItems";
import { InvoiceItemFormValues } from "@/schemas/invoiceItem";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchInvoices } from "@/store/slices/invoiceSlice";
import { fetchSpareParts } from "@/store/slices/sparePartSlice";

import InvoiceItemDialog from "./InvoiceItemDialog";

interface InvoiceItemDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: InvoiceItemFormValues) => Promise<void>;
  initialData?: InvoiceItem;
}

export default function InvoiceItemDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: InvoiceItemDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const invoices = useAppSelector((state) => state.invoices.invoices);
  const invoicesStatus = useAppSelector((state) => state.invoices.status);
  const spareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartsStatus = useAppSelector((state) => state.spareParts.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (invoicesStatus === 'idle' || invoicesStatus === 'failed') {
      dispatch(fetchInvoices());
    }
    if (sparePartsStatus === 'idle' || sparePartsStatus === 'failed') {
      dispatch(fetchSpareParts());
    }
  }, [dispatch, invoicesStatus, sparePartsStatus]);

  return (
    <InvoiceItemDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      invoices={invoices}
      spareParts={spareParts}
      invoicesStatus={invoicesStatus}
      sparePartsStatus={sparePartsStatus}
    />
  );
}
