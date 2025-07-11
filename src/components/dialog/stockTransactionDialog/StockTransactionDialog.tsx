// src/components/stockTransactionDialog/StockTransactionDialog.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale"; // Rename id to localeId to avoid conflict
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  StockTransactionFormValues,
  stockTransactionFormSchema,
  TransactionType,
} from "@/types/stockTransaction";

// Data dummy (akan diganti dengan Redux store di masa depan)
import { sparePartData } from "@/data/sampleSparePartData";
import { warehouseData } from "@/data/sampleWarehouseData";

interface StockTransactionDialogProps {
  onClose: () => void;
  onSubmitTransaction: (values: StockTransactionFormValues) => void;
  initialData?: StockTransactionFormValues; // Data awal untuk mode edit
  // Prop tambahan untuk memfilter gudang asal/tujuan jika dialog dibuka dari halaman detail gudang tertentu
  currentWarehouseId?: string;
}

const StockTransactionDialog: React.FC<StockTransactionDialogProps> = ({
  onClose,
  onSubmitTransaction,
  initialData,
  currentWarehouseId,
}) => {
  const form = useForm<StockTransactionFormValues>({
    resolver: zodResolver(stockTransactionFormSchema),
    defaultValues: useMemo(() => {
      // Filter gudang utama (Mess) sebagai default sourceWarehouseId jika ada
      const defaultSourceWarehouse =
        warehouseData.find((wh) => wh.isMainWarehouse) || warehouseData[0];

      return initialData
        ? {
            ...initialData,
            date: new Date(initialData.date), // Pastikan tanggal adalah objek Date
            quantity: initialData.quantity,
            // Pastikan targetWarehouseId adalah null jika tidak ada
            targetWarehouseId: initialData.targetWarehouseId ?? null,
            remark: initialData.remark ?? null,
          }
        : {
            date: new Date(),
            sparePartId: "",
            quantity: 1,
            transactionType: TransactionType.IN, // Default IN
            sourceWarehouseId:
              currentWarehouseId || defaultSourceWarehouse?.id || "", // Default ke currentWarehouseId atau Gudang Mess
            targetWarehouseId: null,
            remark: null,
          };
    }, [initialData, currentWarehouseId]),
  });

  // Watch transactionType untuk menampilkan/menyembunyikan targetWarehouseId
  const watchTransactionType = form.watch("transactionType");
  const watchSourceWarehouseId = form.watch("sourceWarehouseId");

  // Filter spare parts yang tersedia
  const availableSpareParts = useMemo(() => sparePartData, []);
  // Filter gudang yang tersedia
  const availableWarehouses = useMemo(() => warehouseData, []);

  // Filter gudang tujuan: tidak boleh sama dengan gudang asal
  const filteredTargetWarehouses = useMemo(() => {
    return availableWarehouses.filter((wh) => wh.id !== watchSourceWarehouseId);
  }, [availableWarehouses, watchSourceWarehouseId]);

  // Reset targetWarehouseId jika transactionType bukan TRANSFER_OUT
  useEffect(() => {
    if (watchTransactionType !== TransactionType.TRANSFER_OUT) {
      form.setValue("targetWarehouseId", null);
    }
  }, [watchTransactionType, form]);

  const onSubmit = async (values: StockTransactionFormValues) => {
    console.log("Mengirim transaksi stok:", values);
    onSubmitTransaction(values);
    onClose();
    form.reset();
  };

  // Tentukan label untuk Gudang Asal/Penerima
  const sourceWarehouseLabel = useMemo(() => {
    if (
      watchTransactionType === TransactionType.IN ||
      watchTransactionType === TransactionType.TRANSFER_IN
    ) {
      return "Gudang Penerima";
    }
    return "Gudang Asal";
  }, [watchTransactionType]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Detail Transaksi Stok</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Tanggal Transaksi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPPP", { locale: localeId })
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sparePartId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suku Cadang</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih suku cadang..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSpareParts.map((sp) => (
                        <SelectItem key={sp.id} value={sp.id}>
                          {sp.name} ({sp.partNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Jumlah"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis transaksi..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TransactionType).map((type) => (
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

            <FormField
              control={form.control}
              name="sourceWarehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{sourceWarehouseLabel}</FormLabel>{" "}
                  {/* <-- PERUBAHAN LABEL DI SINI */}
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih gudang..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableWarehouses.map((wh) => (
                        <SelectItem key={wh.id} value={wh.id}>
                          {wh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchTransactionType === TransactionType.TRANSFER_OUT && (
              <FormField
                control={form.control}
                name="targetWarehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gudang Tujuan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih gudang tujuan..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredTargetWarehouses.map((wh) => (
                          <SelectItem key={wh.id} value={wh.id}>
                            {wh.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription>
                      Pilih gudang tujuan untuk transaksi transfer.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Catatan / Remark</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contoh: Pembelian dari Toko ABC, Digunakan untuk WO-XYZ"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
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
            {initialData ? "Simpan Perubahan" : "Tambah Transaksi"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default StockTransactionDialog;
