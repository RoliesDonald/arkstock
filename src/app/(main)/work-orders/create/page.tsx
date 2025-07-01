// src/app/(main)/work-orders/create/page.tsx
"use client";

import React from "react";
import WoDialog from "@/components/dialog/woDialog/_components/WoDialog";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Reuse Shadcn UI components for styling
import { Button } from "@/components/ui/button"; // Import Button
import { Separator } from "@/components/ui/separator"; // Import Separator
// import { useRouter } from "next/navigation"; // Jika ingin redirect setelah submit

// Jika Anda sudah menyiapkan Redux untuk API call, aktifkan ini:
// import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// import { createNewWorkOrder } from '@/lib/features/workOrders/workOrdersSlice';
// import { WorkOrderFormValues } from '@/components/woDialog/WoDialog';

const CreateWorkOrderPage = () => {
  // Jika Redux sudah diaktifkan, uncomment baris ini
  // const dispatch = useAppDispatch();
  // const woStatus = useAppSelector(state => state.workOrders.status);
  // const woError = useAppSelector(state => state.workOrders.error);
  // const router = useRouter(); // Uncomment jika pakai useRouter

  const handleWoSubmit = async (values: any) => {
    // Ganti `any` dengan `WorkOrderFormValues` jika Redux diaktifkan
    console.log(
      "CreateWorkOrderPage: Submitting new WO (Halaman Biasa)",
      values
    );
    // Logika pengiriman data ke API via Redux Thunk
    // Jika Redux sudah diaktifkan, uncomment bagian ini:
    /*
    try {
      const resultAction = await dispatch(createNewWorkOrder(values)).unwrap();
      console.log('Work Order created successfully:', resultAction);
      alert("Work Order berhasil dibuat!"); // Placeholder
      // router.push('/work-orders'); // Redirect ke halaman tabel setelah sukses
    } catch (err: any) {
      console.error('Failed to create Work Order:', err);
      alert(`Gagal membuat Work Order: ${err}`); // Placeholder
    }
    */
    // Untuk saat ini, simulasi saja:
    alert("Simulasi: Work Order baru berhasil dibuat (halaman biasa)");
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header Halaman Biasa */}
      <div className="text-center md:text-left mb-4">
        {" "}
        {/* Flex atau block sesuai kebutuhan */}
        <h1 className="text-arkBlue-800 text-2xl font-bold mb-2">
          Buat Work Order Baru
        </h1>
        <p className="text-gray-600">
          Isi detail Work Order untuk membuat WO baru di sistem.
        </p>
      </div>

      <Separator className="border border-arkBlue-500 my-6" />

      {/* Konten Form */}
      <WoDialog
      // onFormSubmit={handleWoSubmit} // WoDialog sekarang menangani submit internal
      // isLoading={woStatus === 'loading'}
      // apiError={woError}
      // Tidak perlu onClose di sini karena bukan dialog
      />

      {/* Footer Halaman Biasa (opsional, jika Anda ingin tombol di luar form) */}
      {/* Tombol submit dan cancel sekarang ada di dalam WoDialog itu sendiri */}
    </div>
  );
};

export default CreateWorkOrderPage;
