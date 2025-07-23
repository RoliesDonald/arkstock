// src/components/dialog/warehouseStockDialog/_components/WarehouseStockDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { WarehouseStock } from "@/types/warehouseStok"; 
import { Warehouse } from "@/types/warehouse"; 
import { SparePart } from "@/types/sparepart"; 
import { warehouseStockFormSchema, WarehouseStockFormValues } from "@/schemas/warehouseStock"; 

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

interface WarehouseStockDialogProps {
  onClose: () => void;
  onSubmit: (values: WarehouseStockFormValues) => Promise<void>;
  initialData?: WarehouseStock;
  warehouses: Warehouse[];
  spareParts: SparePart[];
  warehousesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  sparePartsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function WarehouseStockDialog({
  onClose,
  initialData,
  onSubmit,
  warehouses,
  spareParts,
  warehousesStatus,
  sparePartsStatus,
}: WarehouseStockDialogProps) {

  const mapWarehouseStockToFormValues = (ws: WarehouseStock): WarehouseStockFormValues => {
    return {
      id: ws.id,
      sparePartId: ws.sparePartId,
      warehouseId: ws.warehouseId,
      currentStock: ws.currentStock,
    };
  };

  const form = useForm<WarehouseStockFormValues>({
    resolver: zodResolver(warehouseStockFormSchema),
    defaultValues: initialData ? mapWarehouseStockToFormValues(initialData) : {
      sparePartId: "",
      warehouseId: "",
      currentStock: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapWarehouseStockToFormValues(initialData));
    } else {
      form.reset({
        sparePartId: "",
        warehouseId: "",
        currentStock: 0,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: WarehouseStockFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Stok Gudang" : "Tambahkan Stok Gudang Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail stok gudang yang sudah ada." : "Isi detail stok gudang untuk menambah data baru ke sistem."}
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
            {/* Field Warehouse ID */}
            <FormField
              control={form.control}
              name="warehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gudang</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialData}> {/* Disable if editing */}
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Gudang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehousesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat gudang...
                        </SelectItem>
                      )}
                      {warehousesStatus === "succeeded" && warehouses.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada gudang
                        </SelectItem>
                      )}
                      {warehouses.map((warehouse: Warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} ({warehouse.location})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Current Stock */}
            <FormField
              control={form.control}
              name="currentStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Saat Ini</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
