// src/components/dialog/estimationDialog/_components/EstimationDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Estimation } from "@/types/estimation"; 
import { WorkOrder } from "@/types/workOrder"; // Untuk workOrder
import { Vehicle } from "@/types/vehicle"; // Untuk vehicle
import { Employee } from "@/types/employee"; // Untuk mechanic, accountant, approvedBy
import { estimationFormSchema, EstimationFormValues } from "@/schemas/estimation"; 
import { EstimationStatus } from "@prisma/client"; 

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

interface EstimationDialogProps {
  onClose: () => void;
  onSubmit: (values: EstimationFormValues) => Promise<void>;
  initialData?: Estimation;
  workOrders: WorkOrder[];
  vehicles: Vehicle[];
  employees: Employee[];
  workOrdersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  vehiclesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  employeesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function EstimationDialog({
  onClose,
  initialData,
  onSubmit,
  workOrders,
  vehicles,
  employees,
  workOrdersStatus,
  vehiclesStatus,
  employeesStatus,
}: EstimationDialogProps) {

  const mapEstimationToFormValues = (estimation: Estimation): EstimationFormValues => {
    return {
      id: estimation.id,
      estimationNumber: estimation.estimationNumber,
      estimationDate: format(estimation.estimationDate, "yyyy-MM-dd"),
      requestOdo: estimation.requestOdo,
      actualOdo: estimation.actualOdo,
      remark: estimation.remark,
      notes: estimation.notes || null,
      finishedDate: estimation.finishedDate ? format(estimation.finishedDate, "yyyy-MM-dd") : null,
      totalEstimatedAmount: estimation.totalEstimatedAmount,
      status: estimation.status,
      workOrderId: estimation.workOrderId,
      vehicleId: estimation.vehicleId,
      mechanicId: estimation.mechanicId || null,
      accountantId: estimation.accountantId || null,
      approvedById: estimation.approvedById || null,
    };
  };

  const form = useForm<EstimationFormValues>({
    resolver: zodResolver(estimationFormSchema),
    defaultValues: initialData ? mapEstimationToFormValues(initialData) : {
      estimationNumber: "",
      estimationDate: format(new Date(), "yyyy-MM-dd"),
      requestOdo: 0,
      actualOdo: 0,
      remark: "",
      notes: null,
      finishedDate: null,
      totalEstimatedAmount: 0,
      status: EstimationStatus.DRAFT,
      workOrderId: "",
      vehicleId: "",
      mechanicId: null,
      accountantId: null,
      approvedById: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapEstimationToFormValues(initialData));
    } else {
      form.reset({
        estimationNumber: "",
        estimationDate: format(new Date(), "yyyy-MM-dd"),
        requestOdo: 0,
        actualOdo: 0,
        remark: "",
        notes: null,
        finishedDate: null,
        totalEstimatedAmount: 0,
        status: EstimationStatus.DRAFT,
        workOrderId: "",
        vehicleId: "",
        mechanicId: null,
        accountantId: null,
        approvedById: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: EstimationFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Estimasi" : "Tambahkan Estimasi Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail Estimasi yang sudah ada." : "Isi detail Estimasi untuk menambah data Estimasi baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Estimation Number */}
            <FormField
              control={form.control}
              name="estimationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Estimasi</FormLabel>
                  <FormControl>
                    <Input placeholder="EST-202407001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Estimation Date */}
            <FormField
              control={form.control}
              name="estimationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Estimasi</FormLabel>
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
                            <span>Pilih tanggal estimasi</span>
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
            {/* Field Request Odometer */}
            <FormField
              control={form.control}
              name="requestOdo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer Permintaan</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Actual Odometer */}
            <FormField
              control={form.control}
              name="actualOdo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer Aktual</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                    <Input placeholder="Estimasi perbaikan mesin" {...field} />
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
                    <Textarea placeholder="Catatan tambahan untuk estimasi..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Finished Date */}
            <FormField
              control={form.control}
              name="finishedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Selesai (Opsional)</FormLabel>
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
                            <span>Pilih tanggal selesai</span>
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
            {/* Field Total Estimated Amount */}
            <FormField
              control={form.control}
              name="totalEstimatedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Estimasi Jumlah</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
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
                  <FormLabel>Status Estimasi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status Estimasi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(EstimationStatus).map((status) => (
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
            {/* Field Work Order ID */}
            <FormField
              control={form.control}
              name="workOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Order</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Work Order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workOrdersStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat Work Order...
                        </SelectItem>
                      )}
                      {workOrdersStatus === "succeeded" && workOrders.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada Work Order
                        </SelectItem>
                      )}
                      {workOrders.map((wo: WorkOrder) => (
                        <SelectItem key={wo.id} value={wo.id}>
                          {wo.workOrderNumber} ({wo.remark})
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
            {/* Field Accountant ID */}
            <FormField
              control={form.control}
              name="accountantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Akuntan (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Akuntan" />
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
                      {employees.filter(e => e.role === 'ACCOUNTING_STAFF' || e.role === 'ACCOUNTING_MANAGER').map((e: Employee) => (
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
