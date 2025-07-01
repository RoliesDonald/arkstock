// src/components/woDialog/WoDialog.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id } from "date-fns/locale"; // Impor locale Indonesia
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

import { formatWoNumber } from "@/lib/woFromatter";
import { generateInitial } from "@/lib/nameFormatter";

import {
  WorkOrderFormValues,
  workOrderFormSchema,
  WoProgresStatus,
  WoPriorityType,
  WorkOrder, // Import WorkOrder interface
} from "@/types/workOrder";
import { CompanyType } from "@/types/companies";
import { Company } from "@/types/companies";
import { UserRole } from "@/types/user";
import { Vehicle } from "@/types/vehicle";
import { Location } from "@/types/location";

import { companyData } from "@/data/sampleCompanyData";
import { userData } from "@/data/sampleUserData";
import { vehicleData } from "@/data/sampleVehicleData";
import { workOrderData } from "@/data/sampleWorkOrderData"; // Digunakan untuk generate WO number
import { locationData } from "@/data/sampleLocationData";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface WoDialogProps {
  onClose?: () => void;
  initialData?: WorkOrder | null; // <-- Properti baru untuk mode edit
  onSubmitWorkOrder: (values: WorkOrderFormValues) => void; // <-- Properti baru untuk submit
}

const WoDialog: React.FC<WoDialogProps> = ({
  onClose,
  initialData,
  onSubmitWorkOrder,
}) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.workOrders.status);
  const error = useAppSelector((state) => state.workOrders.error);

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
    defaultValues: useMemo(() => {
      // Jika ada initialData, konstruksi objek WorkOrderFormValues secara eksplisit
      if (initialData) {
        // PERBAIKAN: Hanya ambil properti yang ada di WorkOrderFormValues
        const defaultFormValues: WorkOrderFormValues = {
          woNumber: initialData.woNumber,
          woMaster: initialData.woMaster,
          date: initialData.date,
          settledOdo: initialData.settledOdo ?? undefined,
          remark: initialData.remark,
          schedule: initialData.schedule ?? undefined, // Correctly handles null to undefined
          serviceLocation: initialData.serviceLocation,
          notes: initialData.notes ?? undefined,
          vehicleMake: initialData.vehicleMake,
          progresStatus: initialData.progresStatus,
          priorityType: initialData.priorityType,
          vehicleId: initialData.vehicleId,
          customerId: initialData.customerId,
          carUserId: initialData.carUserId,
          vendorId: initialData.vendorId,
          mechanicId: initialData.mechanicId ?? undefined,
          driverId: initialData.driverId ?? undefined,
          driverContact: initialData.driverContact ?? undefined,
          approvedById: initialData.approvedById ?? undefined,
          requestedById: initialData.requestedById ?? undefined,
          locationId: initialData.locationId ?? undefined,
        };
        console.log(
          "WoDialog: Setting defaultValues from initialData:",
          defaultFormValues
        ); // Debugging log
        return defaultFormValues;
      }
      // Default untuk form baru
      const newFormDefaults = {
        woNumber: "",
        woMaster: "",
        date: new Date(),
        settledOdo: undefined,
        remark: "",
        schedule: undefined,
        serviceLocation: "",
        notes: undefined,
        vehicleMake: "",
        progresStatus: WoProgresStatus.DRAFT,
        priorityType: WoPriorityType.NORMAL,
        vehicleId: "",
        customerId: "",
        carUserId: "",
        vendorId: "",
        mechanicId: undefined,
        driverId: undefined,
        driverContact: undefined,
        approvedById: undefined,
        requestedById: undefined,
        locationId: undefined,
      };
      console.log(
        "WoDialog: Setting defaultValues for new form:",
        newFormDefaults
      ); // Debugging log
      return newFormDefaults;
    }, [initialData]), // Re-compute defaultValues jika initialData berubah
  });

  const selectedVendorId = form.watch("vendorId");
  const woDate = form.watch("date");
  const selectedVehicleId = form.watch("vehicleId");
  const currentWoNumber = form.watch("woNumber");

  useEffect(() => {
    // Generate WO number hanya jika ini form baru (tidak ada initialData)
    // atau jika woNumber di initialData kosong (misal, WO lama yang belum punya nomor)
    if (!initialData || !initialData.woNumber) {
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
    }
  }, [selectedVendorId, woDate, vendors, form, initialData]);

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
    if (!values.woNumber) {
      form.setError("woNumber", {
        type: "manual",
        message:
          "Nomor WO wajib diisi. Pastikan Anda memilih Vendor dan Tanggal terlebih dahulu.",
      });
      return;
    }

    console.log("Mengirim Work Order:", values);
    onSubmitWorkOrder(values); // Panggil callback yang diterima dari parent
    onClose?.();
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4"
      >
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
                  <p className="text-sm text-gray-500 mt-1">
                    Pilih Vendor dan Tanggal untuk otomatis mengisi nomor WO.
                  </p>
                )
              )}
            </FormItem>
          )}
        />

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
                    selected={field.value} // <-- Ini sudah benar karena field.value bisa Date atau undefined
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
                    selected={field.value ?? undefined} // <-- PERBAIKAN UTAMA: Pastikan null menjadi undefined
                    onSelect={(date) => field.onChange(date || null)} // <-- Pastikan undefined dari Calendar menjadi null
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

        {/* Vehicle ID (Dropdown) */}
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

        {/* Customer ID (Dropdown) */}
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

        {/* Car User ID (Dropdown) */}
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
            {initialData ? "Simpan Perubahan" : "Buat Work Order"}
            {/* Teks tombol dinamis */}
          </Button>
        </DialogFooter>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </Form>
  );
};

export default WoDialog;
