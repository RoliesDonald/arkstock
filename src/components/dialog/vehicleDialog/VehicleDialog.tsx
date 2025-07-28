"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Vehicle } from "@/types/vehicle"; // Import Vehicle type
import { Company } from "@/types/companies"; // Import Company type for dropdowns
import { vehicleFormSchema, VehicleFormValues } from "@/schemas/vehicle"; // Import VehicleFormValues from schemas
import {
  VehicleType,
  VehicleCategory,
  VehicleFuelType,
  VehicleTransmissionType,
  VehicleStatus,
} from "@prisma/client"; // Import Enums dari Prisma

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface VehicleDialogProps {
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  initialData?: Vehicle;
  allCompanies: Company[]; // Prop untuk daftar perusahaan (pemilik/pengguna)
  companiesStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // Status loading perusahaan
}

export default function VehicleDialog({
  onClose,
  initialData,
  onSubmit,
  allCompanies,
  companiesStatus,
}: VehicleDialogProps) {

  const mapVehicleToFormValues = (vehicle: Vehicle): VehicleFormValues => {
    return {
      id: vehicle.id,
      licensePlate: vehicle.licensePlate,
      vehicleMake: vehicle.vehicleMake,
      model: vehicle.model,
      trimLevel: vehicle.trimLevel || null,
      vinNum: vehicle.vinNum || null,
      engineNum: vehicle.engineNum || null,
      chassisNum: vehicle.chassisNum || null,
      yearMade: vehicle.yearMade,
      color: vehicle.color,
      vehicleType: vehicle.vehicleType,
      vehicleCategory: vehicle.vehicleCategory,
      fuelType: vehicle.fuelType,
      transmissionType: vehicle.transmissionType,
      lastOdometer: vehicle.lastOdometer,
      lastServiceDate: format(vehicle.lastServiceDate, "yyyy-MM-dd"), // Format Date ke string
      status: vehicle.status,
      notes: vehicle.notes || null,
      ownerId: vehicle.ownerId,
      carUserId: vehicle.carUserId || null,
    };
  };

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: initialData ? mapVehicleToFormValues(initialData) : {
      licensePlate: "",
      vehicleMake: "",
      model: "",
      trimLevel: null,
      vinNum: null,
      engineNum: null,
      chassisNum: null,
      yearMade: new Date().getFullYear(), // Default ke tahun sekarang
      color: "",
      vehicleType: VehicleType.PASSENGER,
      vehicleCategory: VehicleCategory.SEDAN,
      fuelType: VehicleFuelType.GASOLINE,
      transmissionType: VehicleTransmissionType.MANUAL,
      lastOdometer: 0,
      lastServiceDate: format(new Date(), "yyyy-MM-dd"), // Default ke tanggal sekarang
      status: VehicleStatus.ACTIVE,
      notes: null,
      ownerId: "", // Harus diisi
      carUserId: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapVehicleToFormValues(initialData));
    } else {
      form.reset({
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
        vehicleCategory: VehicleCategory.SEDAN,
        fuelType: VehicleFuelType.GASOLINE,
        transmissionType: VehicleTransmissionType.MANUAL,
        lastOdometer: 0,
        lastServiceDate: format(new Date(), "yyyy-MM-dd"),
        status: VehicleStatus.ACTIVE,
        notes: null,
        ownerId: "",
        carUserId: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: VehicleFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Kendaraan" : "Tambahkan Kendaraan Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail kendaraan yang sudah ada." : "Isi detail kendaraan untuk menambah data kendaraan baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field License Plate */}
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Plat</FormLabel>
                  <FormControl>
                    <Input placeholder="B 1234 ABC" {...field} />
                  </FormControl>
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
                  <FormLabel>Merk Kendaraan</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Model */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
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
            {/* Field VIN Num */}
            <FormField
              control={form.control}
              name="vinNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor VIN (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="VIN1234567890" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Engine Num */}
            <FormField
              control={form.control}
              name="engineNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Mesin (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="ENG1234567890" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Chassis Num */}
            <FormField
              control={form.control}
              name="chassisNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Rangka (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="CHS1234567890" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Year Made */}
            <FormField
              control={form.control}
              name="yearMade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun Pembuatan</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2020" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warna</FormLabel>
                  <FormControl>
                    <Input placeholder="Hitam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Vehicle Type */}
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Kendaraan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tipe Kendaraan" />
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
            {/* Field Vehicle Category */}
            <FormField
              control={form.control}
              name="vehicleCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Kendaraan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kategori Kendaraan" />
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
            {/* Field Fuel Type */}
            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Bahan Bakar</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tipe Bahan Bakar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleFuelType).map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {fuel.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Transmission Type */}
            <FormField
              control={form.control}
              name="transmissionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Transmisi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tipe Transmisi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleTransmissionType).map((trans) => (
                        <SelectItem key={trans} value={trans}>
                          {trans.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Last Odometer */}
            <FormField
              control={form.control}
              name="lastOdometer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer Terakhir</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Last Service Date */}
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
                            format(parseISO(field.value), "PPP", { locale: localeId })
                          ) : (
                            <span>Pilih tanggal servis</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? parseISO(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : null)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={localeId}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Kendaraan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status Kendaraan" />
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
            {/* Field Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Catatan tambahan..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Owner ID (Company) */}
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pemilik (Perusahaan)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Pemilik Perusahaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companiesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat perusahaan...
                        </SelectItem>
                      )}
                      {companiesStatus === "succeeded" && allCompanies.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada perusahaan
                        </SelectItem>
                      )}
                      {allCompanies.map((company: Company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Car User ID (Company) */}
            <FormField
              control={form.control}
              name="carUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pengguna (Perusahaan - Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Pengguna Perusahaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Tidak Ada</SelectItem> {/* Opsi untuk tidak memilih pengguna */}
                      {companiesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat perusahaan...
                        </SelectItem>
                      )}
                      {companiesStatus === "succeeded" && allCompanies.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada perusahaan
                        </SelectItem>
                      )}
                      {allCompanies.map((company: Company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.companyName}
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
