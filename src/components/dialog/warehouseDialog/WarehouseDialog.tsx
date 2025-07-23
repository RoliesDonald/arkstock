// src/components/dialog/warehouseDialog/_components/WarehouseDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Warehouse } from "@/types/warehouse"; 
import { warehouseFormSchema, WarehouseFormValues } from "@/schemas/warehouse"; 
import { WarehouseType } from "@prisma/client"; 

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

interface WarehouseDialogProps {
  onClose: () => void;
  onSubmit: (values: WarehouseFormValues) => Promise<void>;
  initialData?: Warehouse;
}

export default function WarehouseDialog({
  onClose,
  initialData,
  onSubmit,
}: WarehouseDialogProps) {

  const mapWarehouseToFormValues = (warehouse: Warehouse): WarehouseFormValues => {
    return {
      id: warehouse.id,
      name: warehouse.name,
      location: warehouse.location,
      warehouseType: warehouse.warehouseType,
    };
  };

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: initialData ? mapWarehouseToFormValues(initialData) : {
      name: "",
      location: "",
      warehouseType: WarehouseType.BRANCH_WAREHOUSE, // Default type
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapWarehouseToFormValues(initialData));
    } else {
      form.reset({
        name: "",
        location: "",
        warehouseType: WarehouseType.BRANCH_WAREHOUSE,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: WarehouseFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Gudang" : "Tambahkan Gudang Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail gudang yang sudah ada." : "Isi detail gudang untuk menambah data gudang baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Gudang</FormLabel>
                  <FormControl>
                    <Input placeholder="Gudang Utama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi Gudang</FormLabel>
                  <FormControl>
                    <Input placeholder="Jakarta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Warehouse Type */}
            <FormField
              control={form.control}
              name="warehouseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Gudang</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tipe Gudang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(WarehouseType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
