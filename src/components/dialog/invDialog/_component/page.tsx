// src/components/invDialog/InvDialog.tsx
// Asumsi bahwa file ini digunakan untuk membuat Work Order,
// dan perlu disinkronkan dengan WorkOrderFormValues terbaru.

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

// =======================================================
// Impor fungsi WO Formatter dan Name Formatter
import { formatWoNumber } from "@/lib/woFromatter";
import { generateInitial } from "@/lib/nameFormatter";

// Impor tipe dan data dummy yang sesuai dengan struktur terbaru
import {
  WorkOrderFormValues,
  workOrderFormSchema,
  WoProgresStatus,
  WoPriorityType,
} from "@/types/workOrder";
import { CompanyType } from "@/types/companies";
import { Company } from "@/types/companies";
import { UserRole } from "@/types/user";
import { Vehicle } from "@/types/vehicle";
import { Location } from "@/types/location";

// Import data dummy yang sudah dibuat sebelumnya
import { companyData } from "@/data/sampleCompanyData";
import { userData } from "@/data/sampleUserData";
import { vehicleData } from "@/data/sampleVehicleData";
import { workOrderData } from "@/data/sampleWorkOrderData";
import { locationData } from "@/data/sampleLocationData";

import { createNewWorkOrder } from "@/store/slices/workOrderSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// =======================================================

interface InvDialogProps {
  // Ganti WoDialogProps menjadi InvDialogProps
  onClose?: () => void;
}

const InvDialog: React.FC<InvDialogProps> = ({ onClose }) => {
  // Ganti WoDialog menjadi InvDialog
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.workOrders.status);
  const error = useAppSelector((state) => state.workOrders.error);

  // Filter data dummy untuk dropdown Select
  const vendors = useMemo(() => {
    return companyData.filter(
      (company) =>
        company.companyType === CompanyType.VENDOR ||
        company.companyType === CompanyType.INTERNAL
    );
  }, []);

  const customers = useMemo(() => {
    return companyData.filter(
      (company) => company.companyType === CompanyType.CUSTOMER
    );
  }, []);

  const carUsers = useMemo(() => {
    return companyData.filter(
      (company) =>
        company.companyType === CompanyType.CAR_USER ||
        company.companyType === CompanyType.CUSTOMER
    );
  }, []);

  const mechanics = useMemo(() => {
    return userData.filter((user) => user.role === UserRole.MECHANIC);
  }, []);

  const drivers = useMemo(() => {
    return userData.filter((user) => user.role === UserRole.DRIVER);
  }, []);

  const approvedByUsers = useMemo(() => {
    return userData.filter((user) =>
      [
        UserRole.SERVICE_ADVISOR,
        UserRole.ADMIN,
        UserRole.PIC,
        UserRole.ACCOUNTING_MANAGER,
        UserRole.WAREHOUSE_MANAGER,
        UserRole.PURCHASING_MANAGER,
      ].includes(user.role)
    );
  }, []);

  const requestedByUsers = useMemo(() => {
    return userData.filter((user) =>
      [UserRole.PIC, UserRole.ADMIN].includes(user.role)
    );
  }, []);

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: {
      woNumber: "",
      woMaster: "",
      date: new Date(),
      settledOdo: 0,
      remark: "",
      schedule: undefined, // undefined untuk opsional, bukan null
      serviceLocation: "",
      notes: undefined, // undefined untuk opsional, bukan null
      vehicleMake: "", // Ini bisa diisi otomatis dari vehicleId nanti
      progresStatus: WoProgresStatus.DRAFT, // Sesuaikan dengan enum WoProgresStatus
      priorityType: WoPriorityType.NORMAL,
      vehicleId: "", // Akan dipilih dari dropdown
      customerId: "", // Akan dipilih dari dropdown
      carUserId: "", // Akan dipilih dari dropdown
      vendorId: "", // Akan dipilih dari dropdown
      mechanicId: undefined, // undefined untuk opsional
      driverId: undefined, // undefined untuk opsional
      driverContact: undefined, // undefined untuk opsional
      approvedById: undefined, // undefined untuk opsional
      requestedById: undefined, // undefined untuk opsional
      locationId: undefined, // undefined untuk opsional
    },
  });

  // Watch selected values for auto-generating WO Number
  const selectedVendorId = form.watch("vendorId");
  const woDate = form.watch("date");
  const selectedVehicleId = form.watch("vehicleId");
  const currentWoNumber = form.watch("woNumber");

  // --- LOGIKA GENERATE NOMOR WO SECARA OTOMATIS ---
  useEffect(() => {
    const generateAndSetWoNumber = () => {
      if (selectedVendorId && woDate) {
        const selectedVendor = vendors.find((v) => v.id === selectedVendorId);
        if (selectedVendor) {
          const vendorInitial = generateInitial(selectedVendor.companyName);
          const year = woDate.getFullYear();

          const maxSequenceForVendorAndYear = workOrderData
            .filter((wo) => {
              const woYear = wo.date.getFullYear();
              const woVendorCompany = companyData.find(
                (c) => c.id === wo.vendorId
              );
              return (
                woYear === year && woVendorCompany?.id === selectedVendor.id
              );
            })
            .map((wo) => {
              const parts = wo.woNumber.split("/");
              return parseInt(parts[parts.length - 1], 10);
            })
            .reduce((max, current) => Math.max(max, current), 0);

          const nextWoSequence = maxSequenceForVendorAndYear + 1;

          const formattedWo = formatWoNumber(
            nextWoSequence,
            vendorInitial,
            woDate
          );
          form.setValue("woNumber", formattedWo, { shouldValidate: true });
        } else {
          form.setValue("woNumber", "", { shouldValidate: true });
        }
      } else {
        form.setValue("woNumber", "", { shouldValidate: true });
      }
    };

    generateAndSetWoNumber();
  }, [selectedVendorId, woDate, vendors, form]); // Hapus workOrderData dari dependensi

  // --- LOGIKA AUTO-FILL MERK KENDARAAN BERDASARKAN VEHICLE ID ---
  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = vehicleData.find((v) => v.id === selectedVehicleId);
      if (vehicle) {
        form.setValue("vehicleMake", vehicle.vehicleMake);
      } else {
        form.setValue("vehicleMake", "");
      }
    } else {
      form.setValue("vehicleMake", "");
    }
  }, [selectedVehicleId, form]);

  const onSubmit = async (values: WorkOrderFormValues) => {
    console.log("Mengirim Work Order Baru:", values);
    try {
      const resultAction = await dispatch(createNewWorkOrder(values)).unwrap();
      console.log("Work Order berhasil dibuat:", resultAction);
      alert("Work Order berhasil dibuat!");
      onClose?.(); // Tutup dialog
      form.reset(); // Reset form
    } catch (err: any) {
      console.error("Gagal membuat Work Order:", err);
      // Tampilkan pesan error yang lebih informatif
      alert(
        `Gagal membuat Work Order: ${
          error || err.message || "Terjadi kesalahan"
        }`
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4"
      >
        {/* WO Number (Auto-generated) */}
        <FormField
          control={form.control}
          name="woNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Work Order</FormLabel>
              <FormControl>
                <Input placeholder="WO/BP/VII/2024/005" {...field} disabled />
              </FormControl>
              {form.formState.errors.woNumber && currentWoNumber === "" ? (
                <FormMessage>
                  {form.formState.errors.woNumber.message}
                </FormMessage>
              ) : (
                currentWoNumber === "" &&
                (!selectedVendorId || !woDate) && (
                  <p className="text-sm text-arkBg-500 mt-1">
                    Pilih Vendor dan Tanggal untuk otomatis mengisi WO
                  </p>
                )
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* WO Master */}
        <FormField
          control={form.control}
          name="woMaster"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor WO Master (dari Customer)</FormLabel>
              <FormControl>
                <Input placeholder="WO Master dari Customer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tanggal WO */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal Work Order</FormLabel>
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
                        format(field.value, "dd MMMM yyyy", { locale: id })
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

        {/* Odometer */}
        <FormField
          control={form.control}
          name="settledOdo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Odometer (KM)</FormLabel>
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

        {/* Remark (Keluhan) */}
        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keluhan / Remark</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan keluhan atau masalah kendaraan"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Schedule (Opsional) */}
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal Jadwal (Opsional)</FormLabel>
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
                        format(field.value, "dd MMMM yyyy", { locale: id })
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
                    selected={field.value || undefined}
                    onSelect={(date) => field.onChange(date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Location (BARU/PENTING) */}
        <FormField
          control={form.control}
          name="serviceLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi Servis</FormLabel>
              <FormControl>
                <Input
                  placeholder="Misal: Bengkel Utama, Mobile Service"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes (Opsional) */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tambahkan catatan tambahan"
                  {...field}
                  value={field.value || ""}
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

        {/* Vehicle ID (Dropdown - PENTING) */}
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pilih Kendaraan</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kendaraan..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicleData.map((vehicle: Vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.licensePlate} ({vehicle.vehicleMake}{" "}
                      {vehicle.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Make (Auto-filled, disabled) */}
        <FormField
          control={form.control}
          name="vehicleMake"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merk Kendaraan (Otomatis)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Merk akan terisi otomatis"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Customer ID (Dropdown - PENTING) */}
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer (Pemilik Kendaraan)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih customer..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((company: Company) => (
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

        {/* Car User ID (Dropdown - PENTING) */}
        <FormField
          control={form.control}
          name="carUserId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pengguna Kendaraan</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pengguna kendaraan..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {carUsers.map((company: Company) => (
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

        {/* Vendor ID (Dropdown - PENTING untuk format WO) */}
        <FormField
          control={form.control}
          name="vendorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor (Bengkel)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih vendor bengkel..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vendors.map((company: Company) => (
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

        {/* Mechanic ID (Dropdown - Opsional) */}
        <FormField
          control={form.control}
          name="mechanicId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mekanik (Opsional)</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "__null__" ? null : value)
                }
                value={field.value || "__null__"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mekanik..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__null__">Tidak Ada</SelectItem>
                  {mechanics.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Driver ID (Dropdown - Opsional) */}
        <FormField
          control={form.control}
          name="driverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver (Opsional)</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "__null__" ? null : value)
                }
                value={field.value || "__null__"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih driver..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__null__">Tidak Ada</SelectItem>
                  {drivers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Driver Contact (Opsional) */}
        <FormField
          control={form.control}
          name="driverContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kontak Driver (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="0812xxxx"
                  {...field}
                  value={field.value || ""}
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

        {/* Approved By ID (Dropdown - Opsional) */}
        <FormField
          control={form.control}
          name="approvedById"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disetujui Oleh (Opsional)</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "__null__" ? null : value)
                }
                value={field.value || "__null__"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih penyetuju..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__null__">Tidak Ada</SelectItem>
                  {approvedByUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Requested By ID (Dropdown - Opsional) */}
        <FormField
          control={form.control}
          name="requestedById"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diminta Oleh (Opsional)</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "__null__" ? null : value)
                }
                value={field.value || "__null__"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peminta..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__null__">Tidak Ada</SelectItem>
                  {requestedByUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location ID (Dropdown - Opsional) */}
        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi Kendaraan (Opsional)</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "__null__" ? null : value)
                }
                value={field.value || "__null__"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lokasi..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__null__">Tidak Ada</SelectItem>
                  {locationData.map((loc: Location) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Progress Status */}
        <FormField
          control={form.control}
          name="progresStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Progres</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status progres" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(WoProgresStatus).map((status) => (
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

        {/* Priority Type */}
        <FormField
          control={form.control}
          name="priorityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe Prioritas</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe prioritas" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(WoPriorityType).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={status === "loading"}
          >
            Batal
          </Button>
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Membuat..." : "Buat Work Order"}
          </Button>
        </DialogFooter>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </Form>
  );
};

export default InvDialog;
