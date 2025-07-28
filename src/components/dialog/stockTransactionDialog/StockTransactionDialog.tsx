"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { StockTransaction } from "@/types/stockTransaction"; 
import { SparePart } from "@/types/sparepart"; 
import { Warehouse } from "@/types/warehouse"; 
import { Employee } from "@/types/employee"; 
import { stockTransactionFormSchema, StockTransactionFormValues } from "@/schemas/stockTransaction"; 
import { StockTransactionType, EmployeeRole } from "@prisma/client"; 

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

interface StockTransactionDialogProps {
  onClose: () => void;
  onSubmit: (values: StockTransactionFormValues) => Promise<void>;
  initialData?: StockTransaction;
  spareParts: SparePart[];
  warehouses: Warehouse[];
  employees: Employee[];
  sparePartsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  warehousesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  employeesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export default function StockTransactionDialog({
  onClose,
  initialData,
  onSubmit,
  spareParts,
  warehouses,
  employees,
  sparePartsStatus,
  warehousesStatus,
  employeesStatus,
}: StockTransactionDialogProps) {

  const mapStockTransactionToFormValues = (st: StockTransaction): StockTransactionFormValues => {
    return {
      id: st.id,
      transactionNumber: st.transactionNumber,
      transactionDate: format(st.transactionDate, "yyyy-MM-dd"),
      type: st.type,
      sparePartId: st.sparePartId,
      sourceWarehouseId: st.sourceWarehouseId, // Perubahan
      targetWarehouseId: st.targetWarehouseId || null, // Perubahan
      quantity: st.quantity,
      notes: st.notes || null,
      processedById: st.processedById || null,
    };
  };

  const form = useForm<StockTransactionFormValues>({
    resolver: zodResolver(stockTransactionFormSchema),
    defaultValues: initialData ? mapStockTransactionToFormValues(initialData) : {
      transactionNumber: "",
      transactionDate: format(new Date(), "yyyy-MM-dd"),
      type: StockTransactionType.IN, 
      sparePartId: "",
      sourceWarehouseId: "", // Default
      targetWarehouseId: null, // Default
      quantity: 1,
      notes: null,
      processedById: null,
    },
  });

  // Watch for changes in the 'type' field to conditionally render targetWarehouseId
  const transactionType = form.watch("type");

  useEffect(() => {
    if (initialData) {
      form.reset(mapStockTransactionToFormValues(initialData));
    } else {
      form.reset({
        transactionNumber: "",
        transactionDate: format(new Date(), "yyyy-MM-dd"),
        type: StockTransactionType.IN,
        sparePartId: "",
        sourceWarehouseId: "",
        targetWarehouseId: null,
        quantity: 1,
        notes: null,
        processedById: null,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: StockTransactionFormValues) => {
    await onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Transaksi Stok" : "Tambahkan Transaksi Stok Baru"}</DialogTitle>
        <DialogDescription>
          {initialData ? "Edit detail transaksi stok yang sudah ada." : "Isi detail transaksi stok untuk menambah data transaksi stok baru ke sistem."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Transaction Number */}
            <FormField
              control={form.control}
              name="transactionNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Transaksi</FormLabel>
                  <FormControl>
                    <Input placeholder="TRX-202407001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Transaction Date */}
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Transaksi</FormLabel>
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
                            <span>Pilih tanggal transaksi</span>
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
            {/* Field Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tipe Transaksi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(StockTransactionType).map((type) => (
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
            {/* Field Spare Part ID */}
            <FormField
              control={form.control}
              name="sparePartId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spare Part</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Spare Part" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sparePartsStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat spare part...
                        </SelectItem>
                      )}
                      {sparePartsStatus === "succeeded" && spareParts.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada spare part
                        </SelectItem>
                      )}
                      {spareParts.map((part: SparePart) => (
                        <SelectItem key={part.id} value={part.id}>
                          {part.partName} ({part.partNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Source Warehouse ID */}
            <FormField
              control={form.control}
              name="sourceWarehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gudang Sumber</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Gudang Sumber" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehousesStatus === "loading" && (
                        <SelectItem value="" disabled>
                          Memuat gudang...
                        </SelectItem>
                      )}
                      {warehousesStatus === "succeeded" && warehouses.length === 0 && (
                        <SelectItem value="" disabled>
                          Tidak ada gudang
                        </SelectItem>
                      )}
                      {warehouses.map((wh: Warehouse) => (
                        <SelectItem key={wh.id} value={wh.id}>
                          {wh.name} ({wh.location})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Target Warehouse ID (Conditional) */}
            {transactionType === StockTransactionType.TRANSFER && (
              <FormField
                control={form.control}
                name="targetWarehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gudang Tujuan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Gudang Tujuan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Tidak Ada</SelectItem> {/* Allow null/empty for optional */}
                        {warehousesStatus === "loading" && (
                          <SelectItem value="" disabled>
                            Memuat gudang...
                          </SelectItem>
                        )}
                        {warehousesStatus === "succeeded" && warehouses.length === 0 && (
                          <SelectItem value="" disabled>
                            Tidak ada gudang
                          </SelectItem>
                        )}
                        {warehouses.map((wh: Warehouse) => (
                          <SelectItem key={wh.id} value={wh.id}>
                            {wh.name} ({wh.location})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Field Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                    <Textarea placeholder="Catatan transaksi..." {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Field Processed By ID */}
            <FormField
              control={form.control}
              name="processedById"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diproses Oleh (Opsional)</FormLabel>
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
                      {employees.filter(e => e.role === EmployeeRole.WAREHOUSE_STAFF || e.role === EmployeeRole.WAREHOUSE_MANAGER).map((e: Employee) => (
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
