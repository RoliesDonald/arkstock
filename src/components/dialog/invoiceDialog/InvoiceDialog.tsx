"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

// Import tipe dan skema Invoice yang sudah direvisi
import {
  InvoiceFormValues,
  invoiceFormSchema,
  InvoiceStatus,
} from "@/types/invoice";
// Import WorkOrder untuk prop initial data
import { WorkOrder } from "@/types/workOrder";
// Import SparePart dan Service master data
import { SparePart, TransactionPartDetails } from "@/types/sparepart";
import { Service, TransactionServiceDetails } from "@/types/service";
import { sparePartData } from "@/data/sampleSparePartData";
import { serviceData } from "@/data/sampleServiceData";

// Import data dummy dan tipe terkait untuk auto-fill data
import { companyData } from "@/data/sampleCompanyData";
import { userData } from "@/data/sampleUserData";
import { vehicleData } from "@/data/sampleVehicleData";
import { v4 as uuidv4 } from "uuid"; // Untuk generate ID Invoice

interface InvoiceDialogProps {
  onClose: () => void;
  initialWoData: WorkOrder; // Work Order data untuk pre-fill, sekarang WAJIB
  onSubmitInvoice: (values: InvoiceFormValues) => void; // Callback untuk submit invoice
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  onClose,
  initialWoData,
  onSubmitInvoice,
}) => {
  const defaultValues: InvoiceFormValues = useMemo(() => {
    const generatedInvNum = `INV/${new Date().getFullYear()}/${(
      new Date().getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${uuidv4().substring(0, 5).toUpperCase()}`;
    return {
      invNum: generatedInvNum,
      woId: initialWoData.id,
      date: new Date(),
      requestOdo: initialWoData.settledOdo ?? null, // Menggunakan null untuk konsistensi dengan skema
      actualOdo: initialWoData.settledOdo ?? null, // Menggunakan null untuk konsistensi dengan skema
      remark: initialWoData.remark ?? "",
      finished: new Date(),
      totalAmount: 0, // Ini akan dihitung, tapi default awal adalah 0
      status: InvoiceStatus.DRAFT,
      partItems: [],
      serviceItems: [],
    };
  }, [initialWoData]);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: defaultValues,
    mode: "onChange", // Validasi saat ada perubahan
  });

  const {
    fields: sparePartFields,
    append: appendSparePart,
    remove: removeSparePart,
  } = useFieldArray({
    control: form.control,
    name: "partItems",
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: form.control,
    name: "serviceItems",
  });

  // Watch seluruh array untuk menghitung total
  const watchSparePartList = useWatch({
    control: form.control,
    name: "partItems",
  });
  const watchServicesList = useWatch({
    control: form.control,
    name: "serviceItems",
  });

  // Callback untuk menghitung total amount
  const calculateTotalAmount = useCallback(() => {
    let total = 0;
    watchSparePartList?.forEach((item) => {
      total += (item.quantity ?? 0) * (item.unitPrice ?? 0); // Gunakan ?? 0 untuk handle undefined/null
    });
    watchServicesList?.forEach((service) => {
      total += (service.quantity ?? 0) * (service.price ?? 0); // Gunakan ?? 0 untuk handle undefined/null
    });
    form.setValue("totalAmount", total, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [watchSparePartList, watchServicesList, form]);

  // Panggil perhitungan total saat daftar item berubah
  useEffect(() => {
    calculateTotalAmount();
  }, [calculateTotalAmount]);

  const onSubmit = async (values: InvoiceFormValues) => {
    console.log("Mengirim Invoice Baru dari Dialog:", values);
    onSubmitInvoice(values);
    onClose?.();
    form.reset();
  };

  const availableSpareParts = useMemo(() => sparePartData, []);
  const availableServices = useMemo(() => serviceData, []);

  const vehicle = vehicleData.find((v) => v.id === initialWoData.vehicleId);
  const customerCompany = companyData.find(
    (c) => c.id === initialWoData.customerId
  );
  const carUserCompany = companyData.find(
    (c) => c.id === initialWoData.carUserId
  );
  const mechanicUser = userData.find((u) => u.id === initialWoData.mechanicId);
  const approvedByUser = userData.find(
    (u) => u.id === initialWoData.approvedById
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4"
      >
        {/* Info WO/Kendaraan (Read-only, dari initialWoData) */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Work Order & Kendaraan</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>Nomor WO</FormLabel>
              <FormControl>
                <Input value={initialWoData.woNumber} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>WO Master</FormLabel>
              <FormControl>
                <Input value={initialWoData.woMaster} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Plat Nomor</FormLabel>
              <FormControl>
                <Input value={vehicle?.licensePlate || "N/A"} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Merk Kendaraan</FormLabel>
              <FormControl>
                <Input value={vehicle?.vehicleMake || "N/A"} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Model Kendaraan</FormLabel>
              <FormControl>
                <Input value={vehicle?.model || "N/A"} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <FormControl>
                <Input value={customerCompany?.companyName || "N/A"} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Pengguna Kendaraan</FormLabel>
              <FormControl>
                <Input value={carUserCompany?.companyName || "N/A"} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Odometer Awal (KM)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={initialWoData.settledOdo ?? ""}
                  disabled
                />
              </FormControl>
            </FormItem>
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel>Keluhan / Remark WO</FormLabel>
              <FormControl>
                <Textarea value={initialWoData.remark} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Mekanik (dari WO)</FormLabel>
              <FormControl>
                <Input value={mechanicUser?.name || "N/A"} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Disetujui Oleh (dari WO)</FormLabel>
              <FormControl>
                <Input value={approvedByUser?.name || "N/A"} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>No. Rangka (VIN)</FormLabel>
              <FormControl>
                <Input value={vehicle?.vinNum || "N/A"} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>No. Mesin</FormLabel>
              <FormControl>
                <Input value={vehicle?.engineNum || "N/A"} disabled />
              </FormControl>
            </FormItem>
          </CardContent>
        </Card>

        {/* Invoice Number & Date (utama) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="invNum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Invoice (Auto-generate)</FormLabel>
                <FormControl>
                  <Input placeholder="INV/YYYY/MM/XXXXX" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Invoice</FormLabel>
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
                          format(field.value, "PPPP", { locale: id })
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
        </div>

        {/* Actual Odometer & Finished Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="actualOdo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odometer Aktual (KM)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="140000"
                    {...{ ...field, value: field.value ?? "" }}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? null : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="finished"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Selesai Pekerjaan</FormLabel>
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
                          format(field.value, "PPPP", { locale: id })
                        ) : (
                          <span>Pilih tanggal selesai</span>
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
        </div>
        {/* Remark */}
        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan / Remark Invoice</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tambahkan catatan tambahan untuk invoice..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Spare Part List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daftar Suku Cadang</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendSparePart({
                  sparePartId: "",
                  itemName: "",
                  partNumber: "",
                  quantity: 1,
                  unit: "",
                  unitPrice: 0,
                  totalPrice: 0,
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Suku Cadang
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sparePartFields.map((field, index) => (
              <SparePartItemRow
                key={field.id}
                index={index}
                control={form.control}
                availableSpareParts={availableSpareParts}
                remove={removeSparePart}
                setValue={form.setValue}
              />
            ))}
            {sparePartFields.length === 0 && (
              <p className="text-center text-muted-foreground text-sm">
                Belum ada suku cadang ditambahkan.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Services List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daftar Layanan</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendService({
                  serviceId: "",
                  serviceName: "",
                  description: null,
                  price: 0,
                  quantity: 1,
                  totalPrice: 0,
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Layanan
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceFields.map((field, index) => (
              <ServiceItemRow
                key={field.id}
                index={index}
                control={form.control}
                availableServices={availableServices}
                remove={removeService}
                setValue={form.setValue}
              />
            ))}
            {serviceFields.length === 0 && (
              <p className="text-center text-muted-foreground text-sm">
                Belum ada layanan ditambahkan.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Total Amount */}
        <div className="flex justify-end items-center pt-4 pr-2">
          <h3 className="text-lg font-bold">
            Total Invoice: Rp
            {form.watch("totalAmount")?.toLocaleString("id-ID") || 0}
          </h3>
        </div>

        {/* Status Invoice */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Invoice</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status invoice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(InvoiceStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Buat Invoice</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default InvoiceDialog;
