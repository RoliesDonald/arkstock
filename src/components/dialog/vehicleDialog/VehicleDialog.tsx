// src/components/vehicleDialog/VehicleDialog.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
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
  VehicleFormValues,
  vehicleFormSchema,
  VehicleType,
  VehicleCategory,
  VehicleFuelType,
  VehicleTransmissionType,
  VehicleStatus,
} from "@/types/vehicle";

import { companyData, getCompaniesByType } from "@/data/sampleCompanyData";
import { CompanyType } from "@/types/companies";
interface VehicleDialogProps {
  onClose: () => void;
  onSubmitVehicle: (values: VehicleFormValues) => void;
  initialData?: VehicleFormValues;
}

const VehicleDialog: React.FC<VehicleDialogProps> = ({
  onClose,
  onSubmitVehicle,
  initialData,
}) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: useMemo(() => {
      const defaults = initialData
        ? {
            ...initialData,
            trimLevel: initialData.trimLevel ?? null,
            vinNum: initialData.vinNum ?? null,
            engineNum: initialData.engineNum ?? null,
            chassisNum: initialData.chassisNum ?? null,
            notes: initialData.notes ?? null,
            carUserId: initialData.carUserId ?? null,
            ownerId: initialData.ownerId,
            status: initialData.status,
          }
        : {
            licensePlate: "",
            vehicleMake: "",
            model: "",
            trimLevel: null,
            vinNum: null,
            engineNum: null,
            chassisNum: null,
            yearMade: new Date().getFullYear(),
            color: "",
            vehicleType: VehicleType.PASSENGER,
            vehicleCategory: VehicleCategory.BOX_TRUCK,
            fuelType: VehicleFuelType.GASOLINE,
            transmissionType: VehicleTransmissionType.AUTOMATIC,
            lastOdometer: 0,
            lastServiceDate: new Date(),
            ownerId: "",
            carUserId: null,
            status: VehicleStatus.ACTIVE,
            notes: null,
          };
      console.log("Default Form Values (VehicleDialog):", defaults);
      return defaults;
    }, [initialData]),
  });

  const onSubmit = async (values: VehicleFormValues) => {
    if (values.ownerId === "") {
      form.setError("ownerId", {
        type: "manual",
        message: "Pemilik (Perusahaan Rental) wajib diisi.",
      });
      return;
    }

    console.log("Mengirim Data Kendaraan:", values);
    onSubmitVehicle(values);
    onClose();
    form.reset();
  };

  const rentalCompanies = useMemo(
    () => getCompaniesByType(CompanyType.RENTAL_COMPANY),
    []
  );
  const customers = useMemo(() => getCompaniesByType(CompanyType.CAR_USER), []);

  useEffect(() => {
    console.log(
      "Rental Companies (Memoized):",
      JSON.stringify(rentalCompanies, null, 2)
    );
    console.log("Customers (Memoized):", JSON.stringify(customers, null, 2));
  }, [rentalCompanies, customers]);

  const watchedOwnerId = form.watch("ownerId");

  useEffect(() => {
    console.log(
      `Aggressive Debugging: ownerId from form watch is "${watchedOwnerId}" (type: ${typeof watchedOwnerId})`
    );
  }, [watchedOwnerId]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4"
      >
        {/* Informasi Dasar Kendaraan */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar Kendaraan</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plat Nomor</FormLabel>
                  <FormControl>
                    <Input placeholder="B 1234 ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleMake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merek Kendaraan</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota, Honda, dll." {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Avanza, Civic, dll." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trimLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varian (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="G, E, RS, dll."
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : e.target.value
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
              name="yearMade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun Pembuatan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2020"
                      {...field}
                      value={field.value ?? ""}
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
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warna</FormLabel>
                  <FormControl>
                    <Input placeholder="Hitam, Putih, Silver" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastOdometer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer Terakhir (KM)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50000"
                      {...field}
                      value={field.value ?? ""}
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
              name="lastServiceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Servis Terakhir</FormLabel>
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

            <FormField
              control={form.control}
              name="vinNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Rangka (VIN) (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABCDEFG1234567890"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : e.target.value
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
              name="engineNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Mesin (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="XYZ123456789"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : e.target.value
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
              name="chassisNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Sasis (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CHASSIS123456789"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : e.target.value
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informasi tambahan..."
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : e.target.value
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipe Kendaraan */}
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Kendaraan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe kendaraan..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleType).map((type) => (
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
            {/* Kategori Kendaraan */}
            <FormField
              control={form.control}
              name="vehicleCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Kendaraan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori kendaraan..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Tipe Bahan Bakar */}
            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Bahan Bakar</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe bahan bakar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleFuelType).map((type) => (
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
            {/* Tipe Transmisi */}
            <FormField
              control={form.control}
              name="transmissionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Transmisi</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe transmisi..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleTransmissionType).map((type) => (
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
            {/* Status Kendaraan */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Kendaraan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status kendaraan..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleStatus).map((status) => (
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

            {/* Pemilik (Owner) - Perusahaan Rental,
             saat unit di input oleh user dari perusahaan rental 
             nama perusahaan ini harus default ikut nama dari perusahaan user tersebut
             dan secara UI tampilannya jadi disable atau tidak bisa di dropdown */}
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => {
                console.log(
                  "OwnerId Field Value (inside render):",
                  field.value
                );
                console.log(
                  "Rental Companies Array (inside render):",
                  JSON.stringify(rentalCompanies, null, 2)
                );

                return (
                  <FormItem>
                    <FormLabel>Pemilik (Perusahaan Rental)</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(
                          value === "empty-owner-option" ? "" : value
                        );
                      }}
                      value={
                        field.value === "" ? "empty-owner-option" : field.value
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih perusahaan pemilik..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="empty-owner-option">
                          Pilih perusahaan pemilik...
                        </SelectItem>
                        {rentalCompanies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {/* Pengguna Kendaraan (Car User) - Pelanggan/Penyewa (Opsional) */}
            <FormField
              control={form.control}
              name="carUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pengguna Kendaraan (Penyewa/Opsional)</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(
                        value === "null-caruser-option" ? null : value
                      )
                    }
                    value={
                      field.value === null ? "null-caruser-option" : field.value
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pengguna kendaraan..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null-caruser-option">
                        Tidak Ada / Kosongkan
                      </SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.companyName}
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

        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">
            {initialData ? "Simpan Perubahan" : "Tambah Kendaraan"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default VehicleDialog;
