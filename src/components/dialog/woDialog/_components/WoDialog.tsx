// src/components/dialog/workOrderDialog/_components/WorkOrderDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { WorkOrder } from "@/types/workOrder"; 
import { Company } from "@/types/companies"; // Untuk customer, carUser, vendor
import { Vehicle } from "@/types/vehicle"; // Untuk vehicle
import { Employee } from "@/types/employee"; // Untuk mechanic, driver, approvedBy, requestedBy
import { Location } from "@/types/location"; // Asumsi ada types/locations.ts
import { workOrderFormSchema, WorkOrderFormValues } from "@/schemas/workOrder"; 
import { WoProgresStatus, WoPriorityType } from "@prisma/client"; 

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

interface WorkOrderDialogProps {
  onClose: () => void;
  onSubmit: (values: WorkOrderFormValues) => Promise<void>;
  initialData?: WorkOrder;
  companies: Company[];
  vehicles: Vehicle[];
  employees: Employee[];
  locations: Location[]; // Asumsi Anda akan membuat file types/locations.ts dan slice/locationSlice.ts
  companiesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  vehiclesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  employeesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  locationsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function WorkOrderDialog({
  onClose,
  initialData,
  onSubmit,
  companies,
  vehicles,
  employees,
  locations,
  companiesStatus,
  vehiclesStatus,
  employeesStatus,
  locationsStatus,
}: WorkOrderDialogProps) {

  const mapWorkOrderToFormValues = (workOrder: WorkOrder): WorkOrderFormValues => {
    return {
      id: workOrder.id,
      workOrderNumber: workOrder.workOrderNumber,
      workOrderMaster: workOrder.workOrderMaster,
      date: format(workOrder.date, "yyyy-MM-dd"),
      settledOdo: workOrder.settledOdo || null,
      remark: workOrder.remark,
      schedule: workOrder.schedule ? format(workOrder.schedule, "yyyy-MM-dd") : null,
      serviceLocation: workOrder.serviceLocation,
      notes: workOrder.notes || null,
      vehicleMake: workOrder.vehicleMake,
      progresStatus: workOrder.progresStatus,
      priorityType: workOrder.priorityType,
      vehicleId: workOrder.vehicleId,
      customerId: workOrder.customerId,
      carUserId: workOrder.carUserId,
      vendorId: workOrder.vendorId,
      mechanicId: workOrder.mechanicId || null,
      driverId: workOrder.driverId || null,
      driverContact: workOrder.driverContact || null,
      approvedById: workOrder.approvedById || null,
      requestedById: workOrder.requestedById || null,
      locationId: workOrder.locationId || null,
    };
  };

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: initialData ? mapWorkOrderToFormValues(initialData) : {
      workOrderNumber: "",
      workOrderMaster: "",
      date: format(new Date(), "yyyy-MM-dd"),
      settledOdo: null,
      remark: "",
      schedule: null,
      serviceLocation: "",
      notes: null,
      vehicleMake: "",
      progresStatus: WoProgresStatus.DRAFT,
      priorityType: WoPriorityType.NORMAL,
      vehicleId: "",
      customerId: "",
      carUserId: "",
      vendorId: "",
      mechanicId: null,
      driverId: null,
      driverContact: null,
      approvedById: null,
      requestedById: null,
      locationId: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapWorkOrderToFormValues(initialData));
    } else {
      form.reset({
        workOrderNumber: "",
        workOrderMaster: "",
        date: format(new Date(), "yyyy-MM-dd"),
        settledOdo: null,
        remark: "",
        schedule: null,
        serviceLocation: "",
        notes: null,
        vehicleMake: "",
        progresStatus: WoProgresStatus.DRAFT,
        priorityType: WoPriorityType.NORMAL,
        vehicleId: "",
        customerId: "",
        carUserId: "",
        vendorId: "",
        mechanicId: null,
        driverId: null,
        driverContact: null,
        approvedById: null,
        requestedById: null,
        locationId: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: WorkOrderFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Work Order" : "Tambahkan Work Order Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail Work Order yang sudah ada." : "Isi detail Work Order untuk menambah data Work Order baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Work Order Number */}
            <FormField
              control={form.control}
              name="workOrderNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Work Order</FormLabel>
                  <FormControl>
                    <Input placeholder="WO-202407001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Work Order Master */}
            <FormField
              control={form.control}
              name="workOrderMaster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Master Work Order</FormLabel>
                  <FormControl>
                    <Input placeholder="WO Master" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal WO</FormLabel>
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
                            <span>Pilih tanggal WO</span>
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
            {/* Field Schedule */}
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
                            format(parseISO(field.value), "PPP", { locale: localeId })
                          ) : (
                            <span>Pilih tanggal jadwal</span>
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
                          date < new Date("1900-01-01")
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
            {/* Field Settled Odo */}
            <FormField
              control={form.control}
              name="settledOdo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer Terselesaikan (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Remark */}
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Input placeholder="Perbaikan umum" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Service Location */}
            <FormField
              control={form.control}
              name="serviceLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi Servis</FormLabel>
                  <FormControl>
                    <Input placeholder="Bengkel Pusat" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="Catatan tambahan untuk WO..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Vehicle Make (redundant but in schema) */}
            <FormField
              control={form.control}
              name="vehicleMake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merk Kendaraan (Manual)</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Progress Status */}
            <FormField
              control={form.control}
              name="progresStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Progres</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status Progres" />
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
            {/* Field Priority Type */}
            <FormField
              control={form.control}
              name="priorityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Prioritas</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tipe Prioritas" />
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
            {/* Field Vehicle ID */}
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kendaraan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kendaraan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehiclesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat kendaraan...
                        </SelectItem>
                      )}
                      {vehiclesStatus === "succeeded" && vehicles.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada kendaraan
                        </SelectItem>
                      )}
                      {vehicles.map((v: Vehicle) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.licensePlate} ({v.vehicleMake} {v.model})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Customer ID */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companiesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat perusahaan...
                        </SelectItem>
                      )}
                      {companiesStatus === "succeeded" && companies.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada perusahaan
                        </SelectItem>
                      )}
                      {companies.filter(c => c.companyType === 'CUSTOMER').map((c: Company) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Car User ID */}
            <FormField
              control={form.control}
              name="carUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pengguna Kendaraan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Pengguna Kendaraan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companiesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat perusahaan...
                        </SelectItem>
                      )}
                      {companiesStatus === "succeeded" && companies.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada perusahaan
                        </SelectItem>
                      )}
                      {companies.filter(c => c.companyType === 'CAR_USER').map((c: Company) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Vendor ID */}
            <FormField
              control={form.control}
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Vendor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companiesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat perusahaan...
                        </SelectItem>
                      )}
                      {companiesStatus === "succeeded" && companies.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada perusahaan
                        </SelectItem>
                      )}
                      {companies.filter(c => c.companyType === 'VENDOR').map((c: Company) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Mechanic ID */}
            <FormField
              control={form.control}
              name="mechanicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mekanik (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Mekanik" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Tidak Ada</SelectItem>
                      {employeesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat karyawan...
                        </SelectItem>
                      )}
                      {employeesStatus === "succeeded" && employees.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada karyawan
                        </SelectItem>
                      )}
                      {employees.filter(e => e.role === 'MECHANIC').map((e: Employee) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Driver ID */}
            <FormField
              control={form.control}
              name="driverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Driver" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Tidak Ada</SelectItem>
                      {employeesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat karyawan...
                        </SelectItem>
                      )}
                      {employeesStatus === "succeeded" && employees.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada karyawan
                        </SelectItem>
                      )}
                      {employees.filter(e => e.role === 'DRIVER').map((e: Employee) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Driver Contact */}
            <FormField
              control={form.control}
              name="driverContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontak Driver (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="081234567890" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Approved By ID */}
            <FormField
              control={form.control}
              name="approvedById"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disetujui Oleh (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Karyawan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Tidak Ada</SelectItem>
                      {employeesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat karyawan...
                        </SelectItem>
                      )}
                      {employeesStatus === "succeeded" && employees.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada karyawan
                        </SelectItem>
                      )}
                      {employees.map((e: Employee) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name} ({e.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Requested By ID */}
            <FormField
              control={form.control}
              name="requestedById"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diminta Oleh (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Karyawan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Tidak Ada</SelectItem>
                      {employeesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat karyawan...
                        </SelectItem>
                      )}
                      {employeesStatus === "succeeded" && employees.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada karyawan
                        </SelectItem>
                      )}
                      {employees.map((e: Employee) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name} ({e.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Location ID */}
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Lokasi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Tidak Ada</SelectItem>
                      {locationsStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat lokasi...
                        </SelectItem>
                      )}
                      {locationsStatus === "succeeded" && locations.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada lokasi
                        </SelectItem>
                      )}
                      {locations.map((loc: Location) => (
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
