// src/components/dialog/purchaseOrderDialog/_components/PurchaseOrderDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { PurchaseOrder } from "@/types/purchaseOrder"; 
import { Company } from "@/types/companies"; // Untuk supplier
import { Employee } from "@/types/employee"; // Untuk requestedBy, approvedBy
import { purchaseOrderFormSchema, PurchaseOrderFormValues } from "@/schemas/purchaseOrder"; 
import { PurchaseOrderStatus, CompanyType, EmployeeRole } from "@prisma/client"; 

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

interface PurchaseOrderDialogProps {
  onClose: () => void;
  onSubmit: (values: PurchaseOrderFormValues) => Promise<void>;
  initialData?: PurchaseOrder;
  companies: Company[];
  employees: Employee[];
  companiesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  employeesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function PurchaseOrderDialog({
  onClose,
  initialData,
  onSubmit,
  companies,
  employees,
  companiesStatus,
  employeesStatus,
}: PurchaseOrderDialogProps) {

  const mapPurchaseOrderToFormValues = (po: PurchaseOrder): PurchaseOrderFormValues => {
    return {
      id: po.id,
      poNumber: po.poNumber,
      poDate: format(po.poDate, "yyyy-MM-dd"),
      supplierId: po.supplierId,
      deliveryAddress: po.deliveryAddress || null,
      subtotal: po.subtotal,
      tax: po.tax,
      totalAmount: po.totalAmount,
      deliveryDate: po.deliveryDate ? format(po.deliveryDate, "yyyy-MM-dd") : null,
      status: po.status,
      requestedById: po.requestedById || null,
      approvedById: po.approvedById || null,
      remark: po.remark || null,
      rejectionReason: po.rejectionReason || null,
    };
  };

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: initialData ? mapPurchaseOrderToFormValues(initialData) : {
      poNumber: "",
      poDate: format(new Date(), "yyyy-MM-dd"),
      supplierId: "",
      deliveryAddress: null,
      subtotal: 0,
      tax: 0,
      totalAmount: 0,
      deliveryDate: null,
      status: PurchaseOrderStatus.DRAFT,
      requestedById: null,
      approvedById: null,
      remark: null,
      rejectionReason: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(mapPurchaseOrderToFormValues(initialData));
    } else {
      form.reset({
        poNumber: "",
        poDate: format(new Date(), "yyyy-MM-dd"),
        supplierId: "",
        deliveryAddress: null,
        subtotal: 0,
        tax: 0,
        totalAmount: 0,
        deliveryDate: null,
        status: PurchaseOrderStatus.DRAFT,
        requestedById: null,
        approvedById: null,
        remark: null,
        rejectionReason: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: PurchaseOrderFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Purchase Order" : "Tambahkan Purchase Order Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail Purchase Order yang sudah ada." : "Isi detail Purchase Order untuk menambah data Purchase Order baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field PO Number */}
            <FormField
              control={form.control}
              name="poNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor PO</FormLabel>
                  <FormControl>
                    <Input placeholder="PO-202407001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field PO Date */}
            <FormField
              control={form.control}
              name="poDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal PO</FormLabel>
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
                            <span>Pilih tanggal PO</span>
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
            {/* Field Supplier ID */}
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Supplier" />
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
                      {companies.filter(c => c.companyType === CompanyType.SUPPLIER || c.companyType === CompanyType.VENDOR).map((c: Company) => (
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
            {/* Field Delivery Address */}
            <FormField
              control={form.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Pengiriman (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Jl. Contoh No. 123" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Subtotal */}
            <FormField
              control={form.control}
              name="subtotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtotal</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Tax */}
            <FormField
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pajak</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Delivery Date */}
            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Pengiriman (Opsional)</FormLabel>
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
                            <span>Pilih tanggal pengiriman</span>
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
            {/* Field Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status PO</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status PO" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PurchaseOrderStatus).map((status) => (
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
                      {employees.filter(e => e.role === EmployeeRole.PURCHASING_STAFF || e.role === EmployeeRole.PURCHASING_MANAGER).map((e: Employee) => (
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
                      {employees.filter(e => e.role === EmployeeRole.PURCHASING_MANAGER || e.role === EmployeeRole.ADMIN || e.role === EmployeeRole.SUPER_ADMIN).map((e: Employee) => (
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
            {/* Field Remark */}
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Catatan tambahan untuk PO..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Rejection Reason */}
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan Penolakan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Alasan jika PO ditolak..." {...field} value={field.value || ""} />
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
