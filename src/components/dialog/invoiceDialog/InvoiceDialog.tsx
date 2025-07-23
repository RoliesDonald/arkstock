"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { Invoice } from "@/types/invoice";
import { InvoiceFormValues, invoiceFormSchema } from "@/schemas/invoice";
import { WorkOrder } from "@/types/workOrder"; // Import WorkOrder type
import { Employee } from "@/types/employee"; // Import Employee type
import { Vehicle } from "@/types/vehicle"; // Import Vehicle type

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceDialogProps {
  onClose: () => void;
  onSubmit: (values: InvoiceFormValues) => Promise<void>;
  initialData?: Invoice;
  workOrders: WorkOrder[]; // Tambahkan prop ini
  employees: Employee[]; // Tambahkan prop ini
  vehicles: Vehicle[]; // Tambahkan prop ini
  workOrdersStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // Tambahkan prop ini
  employeesStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // Tambahkan prop ini
  vehiclesStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // Tambahkan prop ini
}

export default function InvoiceDialog({
  onClose,
  initialData,
  onSubmit,
  workOrders, // Terima prop ini
  employees, // Terima prop ini
  vehicles, // Terima prop ini
  workOrdersStatus, // Terima prop ini
  employeesStatus, // Terima prop ini
  vehiclesStatus, // Terima prop ini
}: InvoiceDialogProps) {
  const mapInvoiceToFormValues = (invoice: Invoice): InvoiceFormValues => {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: format(invoice.invoiceDate, "yyyy-MM-dd'T'HH:mm"),
      requestOdo: invoice.requestOdo,
      actualOdo: invoice.actualOdo,
      remark: invoice.remark || null,
      finishedDate: format(invoice.finishedDate, "yyyy-MM-dd'T'HH:mm"),
      totalAmount: invoice.totalAmount,
      status: invoice.status,
      workOrderId: invoice.workOrderId,
      vehicleId: invoice.vehicleId,
      accountantId: invoice.accountantId || null,
      approvedById: invoice.approvedById || null,
    };
  };

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: initialData
      ? mapInvoiceToFormValues(initialData)
      : {
          invoiceNumber: "",
          invoiceDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          requestOdo: 0,
          actualOdo: 0,
          remark: null,
          finishedDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          totalAmount: 0,
          status: "DRAFT",
          workOrderId: "",
          vehicleId: "",
          accountantId: null,
          approvedById: null,
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapInvoiceToFormValues(initialData));
    } else {
      form.reset({
        invoiceNumber: "",
        invoiceDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        requestOdo: 0,
        actualOdo: 0,
        remark: null,
        finishedDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        totalAmount: 0,
        status: "DRAFT",
        workOrderId: "",
        vehicleId: "",
        accountantId: null,
        approvedById: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: InvoiceFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Invoice" : "Buat Invoice Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail invoice yang sudah ada." : "Isi detail invoice untuk menambah data baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Invoice Number */}
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Invoice</FormLabel>
                  <FormControl>
                    <Input placeholder="INV-2023-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Invoice Date */}
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Invoice</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Work Order (Read-only for existing, Select for new) */}
            <FormField
              control={form.control}
              name="workOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Order</FormLabel>
                  <FormControl>
                    {initialData ? (
                      <Input 
                        value={initialData.workOrder?.workOrderNumber || "N/A"} 
                        readOnly 
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    ) : (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Work Order" />
                        </SelectTrigger>
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
                    )}
                  </FormControl>
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
                      {vehicles.map((vehicle: Vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.licensePlate} ({vehicle.vehicleMake} {vehicle.model})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Input type="number" placeholder="10000" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                    <Input type="number" placeholder="10050" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                <FormItem>
                  <FormLabel>Tanggal Selesai</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Total Amount */}
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Total</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="CANCELED">Canceled</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="SENT">Sent</SelectItem>
                      <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Accountant */}
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
            {/* Field Approved By */}
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
            {/* Field Remark */}
            <FormField
              control={form.control}
              name="remark"
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
