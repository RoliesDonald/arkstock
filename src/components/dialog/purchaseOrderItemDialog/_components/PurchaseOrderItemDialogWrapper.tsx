"use client";

import { PurchaseOrderItem } from "@/types/purchaseOrderItems";
import { PurchaseOrderItemFormValues } from "@/schemas/purchaseOrderItem";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchPurchaseOrders } from "@/store/slices/purchaseOrderSlice";
import { fetchSpareParts } from "@/store/slices/sparePartSlice";

import PurchaseOrderItemDialog from "./PurchaseOrderItemDialog";

interface PurchaseOrderItemDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: PurchaseOrderItemFormValues) => Promise<void>;
  initialData?: PurchaseOrderItem;
}

export default function PurchaseOrderItemDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: PurchaseOrderItemDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const purchaseOrders = useAppSelector((state) => state.purchaseOrders.purchaseOrders);
  const purchaseOrdersStatus = useAppSelector((state) => state.purchaseOrders.status);
  const spareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartsStatus = useAppSelector((state) => state.spareParts.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (purchaseOrdersStatus === 'idle' || purchaseOrdersStatus === 'failed') {
      dispatch(fetchPurchaseOrders());
    }
    if (sparePartsStatus === 'idle' || sparePartsStatus === 'failed') {
      dispatch(fetchSpareParts());
    }
  }, [dispatch, purchaseOrdersStatus, sparePartsStatus]);

  return (
    <PurchaseOrderItemDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      purchaseOrders={purchaseOrders}
      spareParts={spareParts}
      purchaseOrdersStatus={purchaseOrdersStatus}
      sparePartsStatus={sparePartsStatus}
    />
  );
}
