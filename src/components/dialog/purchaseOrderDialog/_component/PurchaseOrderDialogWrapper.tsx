// src/components/dialog/purchaseOrderDialog/_components/PurchaseOrderDialogWrapper.tsx
"use client";

import { PurchaseOrder } from "@/types/purchaseOrder";
import { PurchaseOrderFormValues } from "@/schemas/purchaseOrder";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

// Import fetch thunks untuk data dropdown
import { fetchEmployees } from "@/store/slices/employeeSlice";

import PurchaseOrderDialog from "./PurchaseOrderDialog";
import { fetchCompanies } from "@/store/slices/companySlice";

interface PurchaseOrderDialogWrapperProps {
  onClose: () => void;
  onSubmit: (values: PurchaseOrderFormValues) => Promise<void>;
  initialData?: PurchaseOrder;
}

export default function PurchaseOrderDialogWrapper({
  onClose,
  onSubmit,
  initialData,
}: PurchaseOrderDialogWrapperProps) {
  const dispatch = useAppDispatch();

  // Ambil data dari Redux store untuk dropdown
  const companies = useAppSelector((state) => state.companies.companies);
  const companiesStatus = useAppSelector((state) => state.companies.status);
  const employees = useAppSelector((state) => state.employee.employees);
  const employeesStatus = useAppSelector((state) => state.employee.status);

  useEffect(() => {
    // Fetch data yang dibutuhkan untuk dropdown jika belum dimuat atau gagal
    if (companiesStatus === 'idle' || companiesStatus === 'failed') {
      dispatch(fetchCompanies());
    }
    if (employeesStatus === 'idle' || employeesStatus === 'failed') {
      dispatch(fetchEmployees());
    }
  }, [dispatch, companiesStatus, employeesStatus]);

  return (
    <PurchaseOrderDialog
      onClose={onClose}
      initialData={initialData}
      onSubmit={onSubmit}
      companies={companies}
      employees={employees}
      companiesStatus={companiesStatus}
      employeesStatus={employeesStatus}
    />
  );
}
