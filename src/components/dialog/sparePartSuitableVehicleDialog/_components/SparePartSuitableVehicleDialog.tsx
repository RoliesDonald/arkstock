// src/components/dialog/sparePartSuitableVehicleDialog/_components/SparePartSuitableVehicleDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { SparePartSuitableVehicle } from "@/types/sparePartSuitableVehicles"; 
import { SparePart } from "@/types/sparepart"; // Import SparePart type
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
  initialData?: SparePartSuitableVehicle;
  spareParts: SparePart[]; // Props untuk daftar Spare Part
  sparePartsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status loading Spare Part
}

export default function SparePartSuitableVehicleDialog({
  onClose,
  initialData,
  onSubmit,
  spareParts,
  sparePartsStatus,
}: SparePartSuitableVehicleDialogProps) {

  const mapSparePartSuitableVehicleToFormValues = (spsv: SparePartSuitableVehicle): SparePartSuitableVehicleFormValues => {
    return {
      sparePartId: spsv.sparePartId,
      vehicleMake: spsv.vehicleMake,
      vehicleModel: spsv.vehicleModel,
      trimLevel: spsv.trimLevel,
      modelYear: spsv.modelYear,
    };
  };

  const form = useForm<SparePartSuitableVehicleFormValues>({
    resolver: zodResolver(sparePartSuitableVehicleFormSchema),
    defaultValues: initialData ? mapSparePartSuitableVehicleToFormValues(initialData) : {
      sparePartId: "",
      vehicleMake: "",
      vehicleModel: "",
      trimLevel: null,
      modelYear: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapSparePartSuitableVehicleToFormValues(initialData));
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
        <DialogTitle>{initialData ? "Edit Kendaraan Cocok Spare Part" : "Tambahkan Kendaraan Cocok Spare Part Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail kendaraan yang cocok dengan spare part ini." : "Isi detail kendaraan yang cocok dengan spare part untuk menambah data baru."}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormLabel>Merek Kendaraan</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota" {...field} />
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
                    <Input placeholder="Avanza" {...field} />
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
                  <FormLabel>Level Trim (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="G" {...field} value={field.value || ""} />
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
                    <Input 
                      type="number" 
                      placeholder="2020" 
                      {...field} 
                      value={field.value !== null ? field.value : ''} // Handle null for empty input
                      onChange={e => {
                        const val = e.target.value;
                        field.onChange(val === '' ? null : Number(val));
                      }} 
                    />
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
