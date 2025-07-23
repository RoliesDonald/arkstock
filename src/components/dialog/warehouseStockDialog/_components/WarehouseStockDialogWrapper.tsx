"use client";

import { WarehouseStock } from "@/types/warehouseStok";
import { WarehouseStockFormValues } from "@/schemas/warehouseStock";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchWarehouses } from "@/store/slices/warehouseSlice";
import { fetchSpareParts } from "@/store/slices/sparePartSlice";

import WarehouseStockDialog from "./WarehouseStockDialog";

interface WarehouseStockDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: WarehouseStockFormValues) => Promise<void>;
  initialData?: WarehouseStock;
}

export default function WarehouseStockDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: WarehouseStockDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const warehouses = useAppSelector((state) => state.warehouses.warehouses);
  const warehousesStatus = useAppSelector((state) => state.warehouses.status);
  const spareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartsStatus = useAppSelector((state) => state.spareParts.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (warehousesStatus === 'idle' || warehousesStatus === 'failed') {
      dispatch(fetchWarehouses());
    }
    if (sparePartsStatus === 'idle' || sparePartsStatus === 'failed') {
      dispatch(fetchSpareParts());
    }
  }, [dispatch, warehousesStatus, sparePartsStatus]);

  return (
    <WarehouseStockDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      warehouses={warehouses}
      spareParts={spareParts}
      warehousesStatus={warehousesStatus}
      sparePartsStatus={sparePartsStatus}
    />
  );
}
