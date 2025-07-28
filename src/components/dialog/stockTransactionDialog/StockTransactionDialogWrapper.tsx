"use client";

import { StockTransaction } from "@/types/stockTransaction";
import { StockTransactionFormValues } from "@/schemas/stockTransaction";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchSpareParts } from "@/store/slices/sparePartSlice";
import { fetchWarehouses } from "@/store/slices/warehouseSlice";
import { fetchEmployees } from "@/store/slices/employeeSlice";

import StockTransactionDialog from "./StockTransactionDialog";

interface StockTransactionDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: StockTransactionFormValues) => Promise<void>;
  initialData?: StockTransaction;
}

export default function StockTransactionDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: StockTransactionDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const spareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartsStatus = useAppSelector((state) => state.spareParts.status);
  const warehouses = useAppSelector((state) => state.warehouses.warehouses);
  const warehousesStatus = useAppSelector((state) => state.warehouses.status);
  const employees = useAppSelector((state) => state.employee.employees);
  const employeesStatus = useAppSelector((state) => state.employee.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (sparePartsStatus === 'idle' || sparePartsStatus === 'failed') {
      dispatch(fetchSpareParts());
    }
    if (warehousesStatus === 'idle' || warehousesStatus === 'failed') {
      dispatch(fetchWarehouses());
    }
    if (employeesStatus === 'idle' || employeesStatus === 'failed') {
      dispatch(fetchEmployees());
    }
  }, [dispatch, sparePartsStatus, warehousesStatus, employeesStatus]);

  return (
    <StockTransactionDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      spareParts={spareParts}
      warehouses={warehouses}
      employees={employees}
      sparePartsStatus={sparePartsStatus}
      warehousesStatus={warehousesStatus}
      employeesStatus={employeesStatus}
    />
  );
}
