// src/components/sparePartDialog/SparePartDialog.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
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
import { DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import tipe dan skema SparePart
import {
  SparePartFormValues,
  sparePartFormSchema,
  PartVariant,
  SparePartCompatibility,
} from "@/types/sparepart";

// Import data kendaraan untuk dropdown kompatibilitas
import {
  getUniqueVehicleMake,
  getModelsByMake,
} from "@/data/sampleVehicleData";
import { generateSku } from "@/lib/skuFormatter";

interface SparePartDialogProps {
  onClose: () => void;
  onSubmitSparePart: (values: SparePartFormValues) => void;
  initialData?: SparePartFormValues; // Untuk mode edit
}

const SparePartDialog: React.FC<SparePartDialogProps> = ({
  onClose,
  onSubmitSparePart,
  initialData,
}) => {
  const form = useForm<SparePartFormValues>({
    resolver: zodResolver(sparePartFormSchema),
    defaultValues: useMemo(() => {
      // Pastikan nilai default untuk trimLevel dan modelYear di compatibility
      const defaultCompatibility =
        initialData?.compatibility?.map((comp) => ({
          ...comp,
          // Pastikan ada atau null untuk properti baru
          trimLevel: comp.trimLevel ?? null,
          modelYear: comp.modelYear ?? null,
        })) || [];

      return initialData
        ? {
            ...initialData,
            compatibility: defaultCompatibility,
          }
        : {
            sku: "",
            name: "",
            partNumber: "",
            description: "",
            unit: "Pcs",
            initialStock: 0,
            minStock: 0,
            price: 0,
            variant: PartVariant.AFTERMARKET,
            brand: "", // Inisialisasi properti brand
            manufacturer: "", // Inisialisasi properti manufacturer
            compatibility: [],
          };
    }, [initialData]),
  });

  const {
    fields: compatibilityFields,
    append: appendCompatibility,
    remove: removeCompatibility,
  } = useFieldArray({
    control: form.control,
    name: "compatibility",
  });

  const uniqueVehicleMakes = useMemo(() => getUniqueVehicleMake(), []);

  // Watch partNumber, brand, dan variant untuk auto-generate SKU
  const watchedPartNumber = form.watch("partNumber");
  const watchedVariant = form.watch("variant");
  const watchedBrand = form.watch("brand"); // Mengamati brand juga

  // useEffect untuk auto-generate SKU
  useEffect(() => {
    // Pastikan partNumber, brand, dan variant tersedia sebelum generate SKU
    // Gunakan '!' untuk memastikan bahwa brand bukan undefined atau null saat diteruskan ke generateSku
    if (
      watchedPartNumber &&
      watchedVariant &&
      watchedBrand !== undefined &&
      watchedBrand !== null
    ) {
      // PERBAIKAN: Secara eksplisit mengubah 'null' menjadi 'undefined' sebelum diteruskan.
      // Ini adalah workaround untuk masalah TypeScript yang aneh.
      const newSku = generateSku(
        watchedPartNumber,
        watchedVariant,
        watchedBrand
      );
      form.setValue("sku", newSku, { shouldValidate: false }); // Set SKU tanpa validasi langsung
    } else {
      form.setValue("sku", "", { shouldValidate: false }); // Kosongkan SKU jika data belum lengkap
    }
  }, [watchedPartNumber, watchedVariant, watchedBrand, form]); // Tambahkan watchedBrand ke dependensi

  const onSubmit = async (values: SparePartFormValues) => {
    if (!values.sku) {
      form.setError("sku", {
        type: "manual",
        message:
          "SKU wajib diisi. Pastikan Nomor Part, Merek, dan Varian telah dipilih.",
      });
      return;
    }
    console.log("Mengirim Data Suku Cadang:", values);
    onSubmitSparePart(values);
    onClose();
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4"
      >
        {/* Informasi Dasar Suku Cadang */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar Suku Cadang</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field SKU (Auto-generated dan Disabled) */}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SKU akan otomatis terisi"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  {form.formState.errors.sku && !field.value ? (
                    <FormMessage>
                      {form.formState.errors.sku.message}
                    </FormMessage>
                  ) : (
                    !field.value &&
                    (!watchedPartNumber ||
                      !watchedVariant ||
                      !watchedBrand) && ( // Sesuaikan kondisi panduan
                      <p className="text-sm text-gray-500 mt-1">
                        SKU akan terisi otomatis setelah mengisi Nomor Part,
                        Merek, dan Varian.
                      </p>
                    )
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Suku Cadang</FormLabel>
                  <FormControl>
                    <Input placeholder="Kampas Rem Depan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Part</FormLabel>
                  <FormControl>
                    <Input placeholder="BRK-PAD-FRT-AVZ001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Brand (Merek) - BARU */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merek (Brand)</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Denso, Akebono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Manufacturer (Produsen) - BARU */}
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produsen</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: PT. Astra Otoparts, Bosch"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detail suku cadang..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Satuan</FormLabel>
                  <FormControl>
                    <Input placeholder="Pcs, Set, Liter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initialStock" // PERBAIKAN TYPO
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Awal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...{ ...field, value: field.value ?? "" }}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value)
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
              name="minStock" // PERBAIKAN TYPO
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Minimum (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...{ ...field, value: field.value ?? "" }}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value)
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Satuan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...{ ...field, value: field.value ?? "" }}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value)
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
              name="variant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varian</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih varian..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PartVariant).map((variant) => (
                        <SelectItem key={variant} value={variant}>
                          {variant.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Kompatibilitas Kendaraan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kompatibilitas Kendaraan</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              // PERBAIKAN: Sertakan trimLevel dan modelYear sebagai null/undefined saat menambah baru
              onClick={() =>
                appendCompatibility({
                  vehicleMake: "",
                  model: "",
                  trimLevel: null,
                  modelYear: null,
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kompatibilitas
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {compatibilityFields.length === 0 && (
              <p className="text-center text-muted-foreground text-sm">
                Belum ada kompatibilitas ditambahkan.
              </p>
            )}
            {compatibilityFields.map((field, index) => (
              // PERBAIKAN: Tambahkan grid-cols untuk trimLevel dan modelYear
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end border-b pb-4"
              >
                <FormField
                  control={form.control}
                  name={`compatibility.${index}.vehicleMake`}
                  render={({ field: makeField }) => (
                    <FormItem>
                      <FormLabel>Merek Kendaraan</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          makeField.onChange(value);
                          form.setValue(`compatibility.${index}.model`, "");
                          // PERBAIKAN: Reset juga trimLevel dan modelYear saat merek berubah
                          form.setValue(
                            `compatibility.${index}.trimLevel`,
                            null
                          );
                          form.setValue(
                            `compatibility.${index}.modelYear`,
                            null
                          );
                        }}
                        value={makeField.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih merek..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uniqueVehicleMakes.map((make) => (
                            <SelectItem key={make} value={make}>
                              {make}
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
                  name={`compatibility.${index}.model`}
                  render={({ field: modelField }) => {
                    const selectedMake = form.watch(
                      `compatibility.${index}.vehicleMake`
                    );
                    const availableModels = selectedMake
                      ? getModelsByMake(selectedMake)
                      : [];
                    return (
                      <FormItem>
                        <FormLabel>Model Kendaraan</FormLabel>
                        <Select
                          onValueChange={modelField.onChange}
                          value={modelField.value}
                          disabled={!selectedMake}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih model..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableModels.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {/* BARU: Field untuk Trim Level */}
                <FormField
                  control={form.control}
                  name={`compatibility.${index}.trimLevel`}
                  render={({ field: trimField }) => (
                    <FormItem>
                      <FormLabel>Varian (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: G, E, RS"
                          {...trimField}
                          value={trimField.value ?? ""} // Handle null/undefined
                          onChange={(e) =>
                            trimField.onChange(
                              e.target.value === "" ? null : e.target.value
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* BARU: Field untuk Model Year */}
                <FormField
                  control={form.control}
                  name={`compatibility.${index}.modelYear`}
                  render={({ field: yearField }) => (
                    <FormItem>
                      <FormLabel>Tahun Model (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Contoh: 2020"
                          {...{ ...yearField, value: yearField.value ?? "" }} // Handle null/undefined
                          onChange={(e) =>
                            yearField.onChange(
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
                <div className="col-span-1 flex justify-end items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCompatibility(index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">
            {initialData ? "Simpan Perubahan" : "Tambah Suku Cadang"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default SparePartDialog;
