"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchSpareParts,
  updateSparePart,
  deleteSparePart,
} from "@/store/slices/sparePartSlice";
import { SparePart, SparePartFormValues } from "@/types/sparepart";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Import dialog edit
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SparePartDialog from "@/components/dialog/sparePartDialog/SparePartDialog";

// Data dummy untuk lookup (jika ada relasi ke data lain yang tidak di Redux)
// import { vehicleData } from "@/data/sampleVehicleData"; // Jika perlu menampilkan detail kendaraan yang kompatibel

export default function SparePartDetailPage() {
  const params = useParams();
  const sparePartId = params.sparePartId as string;
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Ambil data spare part dari Redux store
  const allSpareParts = useAppSelector((state) => state.spareParts.spareParts);
  const sparePartStatus = useAppSelector((state) => state.spareParts.status);
  const sparePartError = useAppSelector((state) => state.spareParts.error);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editInitialData, setEditInitialData] = useState<
    SparePartFormValues | undefined
  >(undefined);

  // Fetch spare parts jika belum dimuat
  useEffect(() => {
    if (sparePartStatus === "idle") {
      dispatch(fetchSpareParts());
    }
  }, [dispatch, sparePartStatus]);

  const handleBackToList = useCallback(() => {
    router.back();
  }, [router]);

  // Temukan spare part yang sedang dilihat
  const currentSparePart = useMemo(() => {
    return allSpareParts.find((sp) => sp.id === sparePartId);
  }, [allSpareParts, sparePartId]);

  // Handler untuk membuka dialog edit
  const handleOpenEditDialog = useCallback(() => {
    if (currentSparePart) {
      // Konversi SparePart ke SparePartFormValues
      setEditInitialData({
        id: currentSparePart.id,
        sku: currentSparePart.sku,
        name: currentSparePart.name,
        partNumber: currentSparePart.partNumber,
        description: currentSparePart.description ?? undefined,
        unit: currentSparePart.unit,
        initialStock: 0, // initialStock tidak relevan di sini, karena ini current stock.
        // Jika Anda ingin menampilkan initialStock asli, Anda perlu menyimpannya di SparePart.
        // Untuk saat ini, kita set 0 atau bisa diabaikan jika tidak digunakan di form edit.
        minStock: currentSparePart.minStock,
        price: currentSparePart.price,
        variant: currentSparePart.variant,
        brand: currentSparePart.brand,
        manufacturer: currentSparePart.manufacturer,
        compatibility: currentSparePart.compatibility,
      });
      setIsEditDialogOpen(true);
    }
  }, [currentSparePart]);

  // Handler untuk menyimpan perubahan dari dialog edit
  const handleSaveSparePart = useCallback(
    async (values: SparePartFormValues) => {
      if (values.id) {
        const existingSparePart = allSpareParts.find(
          (sp) => sp.id === values.id
        );
        if (existingSparePart) {
          const fullUpdatedSparePart: SparePart = {
            ...existingSparePart,
            ...values,
            updatedAt: new Date(),
          };
          await dispatch(updateSparePart(fullUpdatedSparePart));
          alert("Suku cadang berhasil diperbarui!");
        }
      }
      setIsEditDialogOpen(false);
      setEditInitialData(undefined);
    },
    [dispatch, allSpareParts]
  );

  // Handler untuk menghapus spare part
  const handleDeleteSparePart = useCallback(async () => {
    if (
      currentSparePart &&
      window.confirm(
        `Apakah Anda yakin ingin menghapus suku cadang "${currentSparePart.name}"?`
      )
    ) {
      await dispatch(deleteSparePart(currentSparePart.id));
      alert("Suku cadang berhasil dihapus!");
      // Redirect ke halaman daftar spare part setelah penghapusan
      window.location.href = "/spare-parts";
    }
  }, [dispatch, currentSparePart]);

  if (sparePartStatus === "loading") {
    return <div className="text-center py-8">Memuat detail suku cadang...</div>;
  }

  if (sparePartStatus === "failed") {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {sparePartError}
      </div>
    );
  }

  if (!currentSparePart) {
    return (
      <div className="text-center py-8 text-red-500">
        Suku cadang tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        Detail Suku Cadang: {currentSparePart.name}
      </h1>

      <div className="flex justify-end gap-2 mb-6">
        <Button variant={"outline"} onClick={handleBackToList}>
          Back
        </Button>
        <Button onClick={handleOpenEditDialog}>Edit Suku Cadang</Button>
        <Button variant="destructive" onClick={handleDeleteSparePart}>
          Hapus Suku Cadang
        </Button>
      </div>

      {/* Informasi Umum Suku Cadang */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Informasi Umum</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">SKU:</p>
            <p className="font-medium">{currentSparePart.sku || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nama Suku Cadang:</p>
            <p className="font-medium">{currentSparePart.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nomor Part:</p>
            <p className="font-medium">{currentSparePart.partNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Merek (Brand):</p>
            <p className="font-medium">{currentSparePart.brand}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Produsen:</p>
            <p className="font-medium">{currentSparePart.manufacturer}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Satuan:</p>
            <p className="font-medium">{currentSparePart.unit}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Harga (Satuan):</p>
            <p className="font-medium">
              Rp{currentSparePart.price.toLocaleString("id-ID")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Varian:</p>
            <p className="font-medium">{currentSparePart.variant}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stok Minimum:</p>
            <p className="font-medium">{currentSparePart.minStock ?? "-"}</p>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <p className="text-sm text-muted-foreground">Deskripsi:</p>
            <p className="font-medium">{currentSparePart.description || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dibuat Pada:</p>
            <p className="font-medium">
              {format(currentSparePart.createdAt, "dd-MM-yyyy HH:mm", {
                locale: localeId,
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Diperbarui Pada:</p>
            <p className="font-medium">
              {format(currentSparePart.updatedAt, "dd-MM-yyyy HH:mm", {
                locale: localeId,
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Kompatibilitas Kendaraan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Kompatibilitas Kendaraan</CardTitle>
        </CardHeader>
        <CardContent>
          {currentSparePart.compatibility &&
          currentSparePart.compatibility.length > 0 ? (
            <div className="space-y-4">
              {currentSparePart.compatibility.map((compat, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-2 border-b pb-2 last:border-b-0"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Merek:</p>
                    <p className="font-medium">{compat.vehicleMake}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model:</p>
                    <p className="font-medium">{compat.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Varian:</p>
                    <p className="font-medium">{compat.trimLevel || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tahun Model:
                    </p>
                    <p className="font-medium">{compat.modelYear || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Tidak ada informasi kompatibilitas kendaraan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dialog Edit Spare Part */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Suku Cadang</DialogTitle>
            <DialogDescription>
              Ubah detail suku cadang ini. Klik simpan saat Anda selesai.
            </DialogDescription>
          </DialogHeader>
          <SparePartDialog
            onClose={() => setIsEditDialogOpen(false)}
            onSubmitSparePart={handleSaveSparePart}
            initialData={editInitialData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
