"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormDescription } from "@/components/ui/form"; // Pastikan ini diimpor

import { WarehouseFormValues, warehouseFormSchema } from "@/types/warehouse";

interface WarehouseDialogProps {
  onClose: () => void;
  onSubmitWarehouse: (values: WarehouseFormValues) => void;
  initialData?: WarehouseFormValues; // Data awal untuk mode edit
}

const WarehouseDialog: React.FC<WarehouseDialogProps> = ({
  onClose,
  onSubmitWarehouse,
  initialData,
}) => {
  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: useMemo(() => {
      return initialData
        ? {
            ...initialData,
            isMainWarehouse: initialData.isMainWarehouse ?? false,
          }
        : {
            name: "",
            location: "",
            isMainWarehouse: false,
          };
    }, [initialData]),
  });

  const onSubmit = async (values: WarehouseFormValues) => {
    console.log("Mengirim data gudang:", values);
    onSubmitWarehouse(values);
    onClose();
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Informasi Gudang</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Gudang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Gudang Mess, Gudang BM-14"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Kantor Pusat, Cabang Surabaya"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isMainWarehouse"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-1 md:col-span-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Gudang Utama</FormLabel>
                    <FormDescription>
                      Centang jika ini adalah gudang utama (misal: Gudang Mess).
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">
            {initialData ? "Simpan Perubahan" : "Tambah Gudang"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default WarehouseDialog;
