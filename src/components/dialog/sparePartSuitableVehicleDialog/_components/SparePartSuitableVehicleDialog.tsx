"use client"; // Pastikan ini ada di baris paling atas

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { SparePartSuitableVehicle } from "@/types/sparePartSuitableVehicles"; 
import { SparePart } from "@/types/sparepart"; 
import { sparePartSuitableVehicleFormSchema, SparePartSuitableVehicleFormValues } from "@/schemas/sparePartSuitableVehicle"; 

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SparePartSuitableVehicleDialogProps {
  onClose: () => void;
  onSubmit: (values: SparePartSuitableVehicleFormValues) => Promise<void>;
  initialData?: SparePartSuitableVehicle; // Menggunakan SparePartSuitableVehicle sebagai initialData
  spareParts: SparePart[];
  sparePartsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// PASTIKAN ADA 'export default function' DI SINI
export default function SparePartSuitableVehicleDialog({
  onClose,
  initialData,
  onSubmit,
  spareParts,
  sparePartsStatus,
}: SparePartSuitableVehicleDialogProps) {

  // Fungsi untuk memetakan data awal ke nilai form
  const mapSrsvToFormValues = (srsv: SparePartSuitableVehicle): SparePartSuitableVehicleFormValues => {
    return {
      sparePartId: srsv.sparePartId,
      vehicleMake: srsv.vehicleMake,
      vehicleModel: srsv.vehicleModel,
      trimLevel: srsv.trimLevel || null,
      modelYear: srsv.modelYear || null,
    };
  };

  const form = useForm<SparePartSuitableVehicleFormValues>({
    resolver: zodResolver(sparePartSuitableVehicleFormSchema),
    defaultValues: initialData ? mapSrsvToFormValues(initialData) : {
      sparePartId: "",
      vehicleMake: "",
      vehicleModel: "",
      trimLevel: null,
      modelYear: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapSrsvToFormValues(initialData));
    } else {
      form.reset({
        sparePartId: "",
        vehicleMake: "",
        vehicleModel: "",
        trimLevel: null,
        modelYear: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: SparePartSuitableVehicleFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Kendaraan yang Cocok" : "Tambahkan Kendaraan yang Cocok Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail kendaraan yang cocok untuk spare part ini." : "Isi detail kendaraan yang cocok untuk menambah data baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Spare Part ID */}
            <FormField
              control={form.control}
              name="sparePartId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spare Part</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialData}> {/* Disable if editing */}
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Spare Part" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sparePartsStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat spare part...
                        </SelectItem>
                      )}
                      {sparePartsStatus === "succeeded" && spareParts.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada spare part
                        </SelectItem>
                      )}
                      {spareParts.map((part: SparePart) => (
                        <SelectItem key={part.id} value={part.id}>
                          {part.partName} ({part.partNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Vehicle Make */}
            <FormField
              control={form.control}
              name="vehicleMake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merk Kendaraan</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota" {...field} disabled={!!initialData} /> {/* Disable if editing */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Vehicle Model */}
            <FormField
              control={form.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Kendaraan</FormLabel>
                  <FormControl>
                    <Input placeholder="Camry" {...field} disabled={!!initialData} /> {/* Disable if editing */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Trim Level */}
            <FormField
              control={form.control}
              name="trimLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tingkat Trim (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="LE" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Model Year */}
            <FormField
              control={form.control}
              name="modelYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun Model (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2023" {...field} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
