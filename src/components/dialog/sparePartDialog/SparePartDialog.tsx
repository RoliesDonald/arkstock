"use client";

import React, { useMemo, useEffect, useCallback } from "react";
import {
  useForm,
  useFieldArray,
  useWatch,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  SparePartFormValues,
  sparePartFormSchema,
  PartVariant,
} from "@/types/sparepart";

// Redux
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchUnits } from "@/store/slices/unitSlice";

// Data dummy (akan diganti dengan Redux store di masa depan)
import { vehicleData } from "@/data/sampleVehicleData";

// Import SKU formatter
import { generateSku } from "@/lib/skuFormatter";

interface SparePartDialogProps {
  onClose: () => void;
  onSubmitSparePart: (values: SparePartFormValues) => void;
  initialData?: SparePartFormValues; // Data awal untuk mode edit
}

const SparePartDialog: React.FC<SparePartDialogProps> = ({
  onClose,
  onSubmitSparePart,
  initialData,
}) => {
  const dispatch = useAppDispatch();
  const availableUnits = useAppSelector((state) => state.units.units);
  const unitStatus = useAppSelector((state) => state.units.status);

  useEffect(() => {
    if (unitStatus === "idle") {
      dispatch(fetchUnits());
    }
  }, [dispatch, unitStatus]);

  const form = useForm<SparePartFormValues>({
    resolver: zodResolver(sparePartFormSchema),
    defaultValues: useMemo(() => {
      return initialData
        ? {
            ...initialData,
            description:
              initialData.description === null ? null : initialData.description,
            minStock:
              initialData.minStock === null ? null : initialData.minStock,
            compatibility: initialData.compatibility || [],
          }
        : {
            sku: "", // Akan diisi otomatis
            name: "",
            partNumber: "",
            description: null,
            unit: "",
            initialStock: 0,
            minStock: null,
            price: 0,
            variant: PartVariant.OEM,
            brand: "",
            manufacturer: "",
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

  // Watch fields for SKU generation
  const watchedPartNumber = form.watch("partNumber");
  const watchedVariant = form.watch("variant");
  const watchedBrand = form.watch("brand");

  // Effect to generate SKU automatically
  useEffect(() => {
    const generatedSku = generateSku(
      watchedPartNumber,
      watchedVariant,
      watchedBrand
    );
    form.setValue("sku", generatedSku, { shouldValidate: true });
  }, [watchedPartNumber, watchedVariant, watchedBrand, form]);

  const availableVehicleMakes = useMemo(() => {
    const makes = new Set<string>();
    vehicleData.forEach((v) => makes.add(v.vehicleMake));
    return Array.from(makes);
  }, []);

  const getModelsByMake = useCallback((make: string) => {
    const models = new Set<string>();
    vehicleData
      .filter((v) => v.vehicleMake === make)
      .forEach((v) => models.add(v.model));
    return Array.from(models);
  }, []);

  const onSubmit: SubmitHandler<SparePartFormValues> = async (values) => {
    console.log("Mengirim data suku cadang:", values);
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
        <Card>
          <CardHeader>
            <CardTitle>Detail Suku Cadang</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Akan otomatis terisi"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    SKU akan otomatis terisi berdasarkan Nomor Part, Varian, dan
                    Merek.
                  </FormDescription>
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
                    <Input placeholder="Contoh: Kampas Rem Depan" {...field} />
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
                    <Input placeholder="Contoh: 45022-TGL-T00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merek (Brand)</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Honda, Brembo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produsen</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: PT Astra Honda Motor"
                      {...field}
                    />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih satuan..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          {unit.name}
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
              name="initialStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Awal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
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
              name="minStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Minimum (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga (Satuan)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
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
              name="variant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varian</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih varian..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PartVariant).map((variant) => (
                        <SelectItem key={variant} value={variant}>
                          {variant}
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
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi lengkap suku cadang..."
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

        {/* Kompatibilitas Kendaraan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kompatibilitas Kendaraan</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
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
            {compatibilityFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end border-b pb-4"
              >
                <FormField
                  control={form.control}
                  name={`compatibility.${index}.vehicleMake`}
                  render={({ field: compatField }) => (
                    <FormItem>
                      <FormLabel>Merek Kendaraan</FormLabel>
                      <Select
                        onValueChange={compatField.onChange}
                        value={compatField.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih merek..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableVehicleMakes.map((make) => (
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
                  render={({ field: compatField }) => (
                    <FormItem>
                      <FormLabel>Model Kendaraan</FormLabel>
                      <Select
                        onValueChange={compatField.onChange}
                        value={compatField.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih model..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getModelsByMake(
                            form.watch(`compatibility.${index}.vehicleMake`)
                          ).map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
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
                  name={`compatibility.${index}.trimLevel`}
                  render={({ field: compatField }) => (
                    <FormItem>
                      <FormLabel>Varian (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: G, E, S"
                          {...compatField}
                          value={compatField.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`compatibility.${index}.modelYear`}
                  render={({ field: compatField }) => (
                    <FormItem>
                      <FormLabel>Tahun Model (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2020"
                          {...{
                            ...compatField,
                            value: compatField.value ?? "",
                          }}
                          onChange={(e) => {
                            const value = e.target.value;
                            compatField.onChange(
                              value === "" ? null : Number(value)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-full flex justify-end">
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
            {compatibilityFields.length === 0 && (
              <p className="text-center text-muted-foreground text-sm">
                Belum ada kompatibilitas ditambahkan.
              </p>
            )}
          </CardContent>
        </Card>

        {/* <-- KOREKSI: Ganti DialogFooter dengan div biasa */}
        <div className="flex justify-end gap-2 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">
            {initialData ? "Simpan Perubahan" : "Tambah Suku Cadang"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SparePartDialog;
