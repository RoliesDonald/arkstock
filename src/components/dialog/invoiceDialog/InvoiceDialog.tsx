// src/components/invoiceDialog/InvoiceDialog.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import tipe dan skema Invoice
import { InvoiceFormValues, invoiceFormSchema } from "@/types/invoice";
// Import WorkOrder untuk prop initial data
import { WorkOrder } from "@/types/workOrder";

// Import data dummy dan tipe terkait untuk auto-fill data
import { companyData } from "@/data/sampleCompanyData";
import { userData } from "@/data/sampleUserData";
import { vehicleData } from "@/data/sampleVehicleData";
// import { invoiceData } from "@/data/sampleDataInvoice"; // Tidak perlu import invoiceData jika hanya membuat baru
import { v4 as uuidv4 } from "uuid"; // Untuk generate ID Invoice

interface InvoiceDialogProps {
  onClose?: () => void;
  initialWoData?: WorkOrder | null; // Work Order data untuk pre-fill
  onSubmitInvoice: (values: InvoiceFormValues) => void; // Callback untuk submit invoice
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  onClose,
  initialWoData,
  onSubmitInvoice,
}) => {
  // Memoize defaultValues agar tidak berubah setiap render jika initialWoData sama
  const defaultValues = useMemo(() => {
    if (initialWoData) {
      // Ambil data terkait dari data dummy menggunakan ID
      const vehicle = vehicleData.find((v) => v.id === initialWoData.vehicleId);
      const customerCompany = companyData.find(
        (c) => c.id === initialWoData.customerId
      );
      const carUserCompany = companyData.find(
        (c) => c.id === initialWoData.carUserId
      );
      const mechanicUser = userData.find(
        (u) => u.id === initialWoData.mechanicId
      );
      const approvedByUser = userData.find(
        (u) => u.id === initialWoData.approvedById
      );

      // Pastikan woNumber sudah ada dari WO yang dipilih, karena ini adalah sumber invNum
      const generatedInvNum = `INV/${new Date().getFullYear()}/${(
        new Date().getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${uuidv4().substring(0, 5).toUpperCase()}`; // Contoh generate sederhana

      return {
        invNum: generatedInvNum, // Auto-generate atau bisa juga kosong dan diisi saat submit dari parent
        woMaster: initialWoData.woMaster,
        date: new Date(), // Tanggal invoice default hari ini
        vehicleMake: vehicle?.vehicleMake || "",
        model: vehicle?.model || "",
        licensePlate: vehicle?.licensePlate || "",
        vinNum: vehicle?.vinNum || null,
        engineNum: vehicle?.engineNum || null,
        customer: customerCompany?.companyName || "",
        carUser: carUserCompany?.companyName || "",
        remark: initialWoData.remark,
        requestOdo: initialWoData.settledOdo ?? null, // Menggunakan settledOdo dari WO
        actualdOdo: initialWoData.settledOdo ?? null, // Default sama dengan requestOdo
        mechanic: mechanicUser?.name || null, // Map ID mekanik ke nama
        sparePartList: [], // Awalnya kosong
        servicesList: [], // Awalnya kosong
        finished: new Date(), // Tanggal selesai pekerjaan default hari ini
        approvedBy: approvedByUser?.name || null, // Map ID ke nama
        totalAmount: 0, // Awalnya 0, akan dihitung
        status: "Draft", // Status awal invoice
      };
    }
    // Default kosong jika tidak ada initialWoData (misal kalau ada flow manual)
    return {
      invNum: "",
      woMaster: "",
      date: new Date(),
      vehicleMake: "",
      model: "",
      licensePlate: "",
      requestOdo: null,
      actualdOdo: null,
      remark: "",
      finished: new Date(),
      sparePartList: [],
      servicesList: [],
      totalAmount: 0,
      status: "Draft",
    };
  }, [initialWoData]); // Tergantung pada initialWoData agar re-compute saat berubah

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: defaultValues,
  });

  // Untuk mengelola daftar suku cadang dan layanan
  const {
    fields: sparePartFields,
    append: appendSparePart,
    remove: removeSparePart,
  } = useFieldArray({
    control: form.control,
    name: "sparePartList",
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control: form.control,
    name: "servicesList",
  });

  // Watch nilai-nilai untuk perhitungan totalAmount
  const watchSparePartList = form.watch("sparePartList");
  const watchServicesList = form.watch("servicesList");

  // Hitung totalAmount setiap kali sparePartList atau servicesList berubah
  useEffect(() => {
    let total = 0;
    watchSparePartList?.forEach((item) => {
      total += (item.quantity || 0) * (item.unitPrice || 0);
    });
    watchServicesList?.forEach((service) => {
      total += service.price || 0;
    });
    form.setValue("totalAmount", total);
  }, [watchSparePartList, watchServicesList, form]);

  const onSubmit = async (values: InvoiceFormValues) => {
    console.log("Mengirim Invoice Baru:", values);
    onSubmitInvoice(values); // Panggil callback dari parent
    onClose?.(); // Tutup dialog setelah submit
    form.reset(); // Reset form
  };

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
            <FormField
              control={form.control}
              name="woMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WO Master</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plat Nomor</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleMake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merk Kendaraan</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Kendaraan</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pengguna Kendaraan</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requestOdo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer Awal (KM)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...{ ...field, value: field.value ?? "" }}
                      disabled
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Keluhan / Remark WO</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mechanic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mekanik (dari WO)</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="approvedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disetujui Oleh (dari WO)</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vinNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. Rangka (VIN)</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="engineNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. Mesin</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
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
            name="actualdOdo"
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
                  itemName: "",
                  partNumber: "",
                  quantity: 1,
                  unit: "Pcs",
                  unitPrice: 0,
                })
              }
            >
              {" "}
              {/* Default qty 1, unit Pcs */}
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Suku Cadang
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sparePartFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end border-b pb-4"
              >
                <FormField
                  control={form.control}
                  name={`sparePartList.${index}.itemName`}
                  render={({ field: itemField }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Nama Item</FormLabel>
                      <FormControl>
                        <Input {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`sparePartList.${index}.partNumber`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Part No.</FormLabel>
                      <FormControl>
                        <Input {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`sparePartList.${index}.quantity`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Qty</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...{ ...itemField, value: itemField.value ?? "" }}
                          onChange={(e) =>
                            itemField.onChange(
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`sparePartList.${index}.unit`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Satuan</FormLabel>
                      <FormControl>
                        <Input {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`sparePartList.${index}.unitPrice`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Harga Satuan</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...{ ...itemField, value: itemField.value ?? "" }}
                          onChange={(e) =>
                            itemField.onChange(
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-1 md:col-span-6 flex justify-between items-center">
                  <p className="text-sm font-semibold">
                    Total Item: Rp
                    {(
                      form.getValues(`sparePartList.${index}.quantity`) *
                      form.getValues(`sparePartList.${index}.unitPrice`)
                    ).toLocaleString("id-ID") || 0}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSparePart(index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
              onClick={() => appendService({ serviceName: "", price: 0 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Layanan
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end border-b pb-4"
              >
                <FormField
                  control={form.control}
                  name={`servicesList.${index}.serviceName`}
                  render={({ field: itemField }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Nama Layanan</FormLabel>
                      <FormControl>
                        <Input {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`servicesList.${index}.price`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Harga</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...{ ...itemField, value: itemField.value ?? "" }}
                          onChange={(e) =>
                            itemField.onChange(
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end items-center col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeService(index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
