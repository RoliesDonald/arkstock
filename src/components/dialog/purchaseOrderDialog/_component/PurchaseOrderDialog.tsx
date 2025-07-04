// src/components/purchaseOrderDialog/PurchaseOrderDialog.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
  PurchaseOrderFormValues,
  purchaseOrderFormSchema,
  PurchaseOrderStatus,
} from "@/types/purchaseOrder";
import { SparePart } from "@/types/sparepart";
import { Company, CompanyType } from "@/types/companies";
import { Employee, EmployeeRole } from "@/types/employee";

// Data dummy (akan diganti dengan Redux store di masa depan)
import { sparePartData } from "@/data/sampleSparePartData";
import { companyData, getCompaniesByType } from "@/data/sampleCompanyData";
import { employeeData } from "@/data/sampleEmployeeData";
import { purchaseOrderData } from "@/data/samplePurchaseOrderData";
import { formatPoNumber } from "@/lib/poFormatter";

interface PurchaseOrderDialogProps {
  onClose: () => void;
  onSubmitPurchaseOrder: (values: PurchaseOrderFormValues) => void;
  initialData?: PurchaseOrderFormValues;
}

const PurchaseOrderDialog: React.FC<PurchaseOrderDialogProps> = ({
  onClose,
  onSubmitPurchaseOrder,
  initialData,
}) => {
  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: useMemo(() => {
      return initialData
        ? {
            ...initialData,
            date: new Date(initialData.date),
            approvedById: initialData.approvedById ?? null,
            rejectionReason: initialData.rejectionReason ?? null,
            remark: initialData.remark ?? null,
            items: initialData.items.map((item) => ({
              ...item,
              id: item.id || undefined,
            })),
          }
        : {
            poNumber: "",
            date: new Date(),
            vendorId: "",
            requestedById: "",
            approvedById: null,
            rejectionReason: null,
            status: PurchaseOrderStatus.DRAFT,
            remark: null,
            // Default satu item kosong dengan itemName, partNumber, dan unit kosong
            items: [
              {
                sparePartId: "",
                itemName: "",
                partNumber: "",
                quantity: 1,
                unit: "",
                unitPrice: 0,
              },
            ],
          };
    }, [initialData]),
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedDate = form.watch("date");
  const watchedVendorId = form.watch("vendorId");
  const watchedItems = form.watch("items");
  const watchedStatus = form.watch("status");

  const availableVendors = useMemo(
    () => getCompaniesByType(CompanyType.VENDOR),
    []
  );
  const warehouseStaffs = useMemo(
    () =>
      employeeData.filter((emp) => emp.role === EmployeeRole.WAREHOUSE_STAFF),
    []
  );
  const warehouseManagers = useMemo(
    () =>
      employeeData.filter((emp) => emp.role === EmployeeRole.WAREHOUSE_MANAGER),
    []
  );

  // Effect untuk generate PO Number
  useEffect(() => {
    const generateAndSetPoNumber = () => {
      if (!initialData && watchedDate) {
        const year = watchedDate.getFullYear();
        const month = watchedDate.getMonth() + 1;

        const maxSequenceForMonth = purchaseOrderData
          .filter((po) => {
            const poDate = new Date(po.date);
            return (
              poDate.getFullYear() === year && poDate.getMonth() + 1 === month
            );
          })
          .map((po) => {
            const parts = po.poNumber.split("/");
            const lastPart = parts[parts.length - 1];
            return /^\d+$/.test(lastPart) ? parseInt(lastPart, 10) : 0;
          })
          .reduce((max, current) => Math.max(max, current), 0);

        const nextPoSequence = maxSequenceForMonth + 1;
        const newPoNumber = formatPoNumber(nextPoSequence, watchedDate);
        form.setValue("poNumber", newPoNumber, { shouldValidate: true });
      } else if (initialData) {
        form.setValue("poNumber", initialData.poNumber, {
          shouldValidate: true,
        });
      } else {
        form.setValue("poNumber", "", { shouldValidate: true });
      }
    };

    generateAndSetPoNumber();
  }, [watchedDate, initialData, form]);

  // Helper untuk mendapatkan detail spare part
  const getSparePartDetails = (id: string | undefined) => {
    return sparePartData.find((s) => s.id === id);
  };

  const onSubmit = async (values: PurchaseOrderFormValues) => {
    const totalAmount = values.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    const fullPoValues = {
      ...values,
      totalAmount: totalAmount,
      items: values.items.map((item) => ({
        ...item,
        totalPrice: item.quantity * item.unitPrice,
      })),
    };

    console.log("Mengirim Purchase Order:", fullPoValues);
    onSubmitPurchaseOrder(fullPoValues);
    onClose();
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Detail Purchase Order</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="poNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor PO</FormLabel>
                  <FormControl>
                    <Input placeholder="PO/YYYY/MM/XXXXX" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                  {!initialData && !field.value && (
                    <FormDescription>
                      Nomor PO akan otomatis terisi setelah memilih Tanggal.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
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
                            format(field.value, "PPPP", { locale: localeId })
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
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih vendor..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.companyName}
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
              name="requestedById"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diminta Oleh (Staff Gudang)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih staff gudang..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouseStaffs.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Field untuk Approved By (hanya muncul jika status bukan DRAFT) */}
            {watchedStatus !== PurchaseOrderStatus.DRAFT && (
              <FormField
                control={form.control}
                name="approvedById"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disetujui Oleh (Manajer Gudang)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih manajer gudang..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Tidak Ada</SelectItem>
                        {warehouseManagers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Field Status PO (untuk mode edit atau jika perlu diubah manual) */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status PO</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status PO..." />
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

            {/* Field Rejection Reason (hanya muncul jika status REJECTED) */}
            {watchedStatus === PurchaseOrderStatus.CANCELED && (
              <FormField
                control={form.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Alasan Penolakan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan alasan mengapa PO ditolak..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Catatan / Remark</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Catatan tambahan untuk Purchase Order..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Daftar Item Suku Cadang */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daftar Item Suku Cadang</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendItem({
                  sparePartId: "",
                  itemName: "",
                  partNumber: "",
                  quantity: 1,
                  unit: "",
                  unitPrice: 0,
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {itemFields.map((field, index) => {
              const selectedSparePartId = form.watch(
                `items.${index}.sparePartId`
              );

              useEffect(() => {
                const spDetails = getSparePartDetails(selectedSparePartId);
                if (spDetails) {
                  form.setValue(`items.${index}.itemName`, spDetails.name, {
                    shouldValidate: true,
                  });
                  form.setValue(
                    `items.${index}.partNumber`,
                    spDetails.partNumber,
                    { shouldValidate: true }
                  );
                  form.setValue(`items.${index}.unit`, spDetails.unit, {
                    shouldValidate: true,
                  }); // <-- Mengisi unit
                  if (
                    form.getValues(`items.${index}.unitPrice`) === 0 ||
                    form.getValues(`items.${index}.unitPrice`) === undefined ||
                    form.getValues(`items.${index}.unitPrice`) === null
                  ) {
                    form.setValue(`items.${index}.unitPrice`, spDetails.price, {
                      shouldValidate: true,
                    });
                  }
                } else {
                  form.setValue(`items.${index}.itemName`, "", {
                    shouldValidate: true,
                  });
                  form.setValue(`items.${index}.partNumber`, "", {
                    shouldValidate: true,
                  });
                  form.setValue(`items.${index}.unit`, "", {
                    shouldValidate: true,
                  }); // <-- Mengosongkan unit
                  form.setValue(`items.${index}.unitPrice`, 0, {
                    shouldValidate: true,
                  });
                }
              }, [selectedSparePartId, index]);

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end border-b pb-4"
                >
                  {" "}
                  {/* Grid 6 kolom */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.sparePartId`}
                    render={({ field: itemField }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Suku Cadang</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            itemField.onChange(value);
                            const price =
                              getSparePartDetails(value)?.price || 0;
                            form.setValue(`items.${index}.unitPrice`, price);
                          }}
                          value={itemField.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih suku cadang..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sparePartData.map((sp) => (
                              <SelectItem key={sp.id} value={sp.id}>
                                {sp.name} ({sp.partNumber})
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
                    name={`items.${index}.quantity`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Kuantitas</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...{ ...itemField, value: itemField.value ?? "" }}
                            onChange={(e) =>
                              itemField.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unit`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Satuan</FormLabel>
                        <FormControl>
                          <Input {...itemField} disabled />{" "}
                          {/* <-- Disabled input untuk unit */}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Harga Satuan</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...{ ...itemField, value: itemField.value ?? "" }}
                            onChange={(e) =>
                              itemField.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-1 flex justify-end items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Tampilkan Nama Item dan Part Number di bawah select */}
                  <div className="col-span-2 text-xs text-muted-foreground">
                    Nama: {form.watch(`items.${index}.itemName`) || "-"} <br />
                    Part No: {form.watch(`items.${index}.partNumber`) || "-"}
                  </div>
                  <div className="col-span-3 text-right font-semibold text-sm">
                    Total Item: Rp
                    {(
                      form.watch(`items.${index}.quantity`) *
                      form.watch(`items.${index}.unitPrice`)
                    ).toLocaleString("id-ID")}
                  </div>
                </div>
              );
            })}
            {itemFields.length === 0 && (
              <p className="text-center text-muted-foreground text-sm">
                Belum ada item suku cadang ditambahkan.
              </p>
            )}
          </CardContent>
        </Card>

        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">
            {initialData ? "Simpan Perubahan" : "Buat Purchase Order"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default PurchaseOrderDialog;
