"use client";

import React, { useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchServices,
  addService,
  updateService,
  deleteService,
  fetchAvailableSpareParts, // Import thunk baru
} from "@/store/slices/serviceSlice"; // serviceSlice sekarang juga mengelola availableSpareParts
import { Service, ServiceFormValues } from "@/types/services";
import { SparePart } from "@/types/sparepart";
import ServiceList from "@/components/dialog/serviceList/ServiceList";

export default function ServicesPage() {
  const dispatch = useAppDispatch();
  const services = useAppSelector((state) => state.services.services);
  const availableSpareParts = useAppSelector(
    (state) => state.services.availableSpareParts
  ); // Ambil spare parts yang tersedia
  const status = useAppSelector((state) => state.services.status);
  const error = useAppSelector((state) => state.services.error);

  // Ambil data jasa dan spare parts saat komponen dimuat
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchServices());
      dispatch(fetchAvailableSpareParts()); // Ambil daftar spare parts
    }
  }, [dispatch, status]);

  // Handler untuk menambah jasa baru
  const handleAddService = useCallback(
    async (values: ServiceFormValues) => {
      await dispatch(addService(values));
      alert("Jasa berhasil ditambahkan!");
    },
    [dispatch]
  );

  // Handler untuk memperbarui jasa
  const handleUpdateService = useCallback(
    async (values: Service) => {
      await dispatch(updateService(values));
      alert("Jasa berhasil diperbarui!");
    },
    [dispatch]
  );

  // Handler untuk menghapus jasa
  const handleDeleteService = useCallback(
    async (id: string) => {
      await dispatch(deleteService(id));
      alert("Jasa berhasil dihapus!");
    },
    [dispatch]
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Paket Pekerjaan</h1>
      <ServiceList
        services={services}
        onAddService={handleAddService}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
        status={status}
        error={error}
        availableSpareParts={availableSpareParts} // Teruskan spare parts yang tersedia
      />
    </div>
  );
}
