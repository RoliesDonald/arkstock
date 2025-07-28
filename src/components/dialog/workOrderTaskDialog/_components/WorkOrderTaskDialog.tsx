"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { format } from "date-fns";

import { WorkOrderTask } from "@/types/workOrderTasks"; 
import { WorkOrder } from "@/types/workOrder"; 
import { Employee } from "@/types/employee"; 
import { workOrderTaskFormSchema, WorkOrderTaskFormValues } from "@/schemas/workOrderTask"; 

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

interface WorkOrderTaskDialogProps {
  onClose: () => void;
  onSubmit: (values: WorkOrderTaskFormValues) => Promise<void>;
  initialData?: WorkOrderTask;
  workOrders: WorkOrder[];
  employees: Employee[];
  workOrdersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  employeesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function WorkOrderTaskDialog({
  onClose,
  initialData,
  onSubmit,
  workOrders,
  employees,
  workOrdersStatus,
  employeesStatus,
}: WorkOrderTaskDialogProps) {

  const mapWorkOrderTaskToFormValues = (wot: WorkOrderTask): WorkOrderTaskFormValues => {
    return {
      id: wot.id,
      workOrderId: wot.workOrderId,
      taskName: wot.taskName,
      description: wot.description,
      status: wot.status,
      assignedToId: wot.assignedToId,
      startTime: wot.startTime ? format(wot.startTime, "yyyy-MM-dd'T'HH:mm") : null,
      endTime: wot.endTime ? format(wot.endTime, "yyyy-MM-dd'T'HH:mm") : null,
      notes: wot.description,
    };
  };

  const form = useForm<WorkOrderTaskFormValues>({
    resolver: zodResolver(workOrderTaskFormSchema),
    defaultValues: initialData ? mapWorkOrderTaskToFormValues(initialData) : {
      workOrderId: "",
      taskName: "",
      description: null,
      status: "PENDING",
      assignedToId: null,
      startTime: null,
      endTime: null,
      notes: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapWorkOrderTaskToFormValues(initialData));
    } else {
      form.reset({
        workOrderId: "",
        taskName: "",
        description: null,
        status: "PENDING",
        assignedToId: null,
        startTime: null,
        endTime: null,
        notes: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: WorkOrderTaskFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Tugas Work Order" : "Tambahkan Tugas Work Order Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail tugas work order yang sudah ada." : "Isi detail tugas work order untuk menambah data baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          {wo.workOrderNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Task Name */}
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Tugas</FormLabel>
                  <FormControl>
                    <Input placeholder="Ganti Oli" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detail tugas..." {...field} value={field.value || ""} />
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
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">Dalam Proses</SelectItem>
                      <SelectItem value="COMPLETED">Selesai</SelectItem>
                      <SelectItem value="FAILED">Gagal</SelectItem>
                      <SelectItem value="CANCELED">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Assigned To */}
            <FormField
              control={form.control}
              name="assignedToId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ditugaskan Kepada (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Karyawan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Tidak Ditugaskan</SelectItem>
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
                      {employees.map((employee: Employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} ({employee.position || 'N/A'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Start Time */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Mulai (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field End Time */}
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Selesai (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} value={field.value || ""} />
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
                    <Textarea placeholder="Catatan tambahan..." {...field} value={field.value || ""} />
                  </FormControl>
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
