// D:\arkstok\src\components\woDialog\WoDialog.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // Masih perlu z
import { format } from "date-fns";
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
// Impor dari file tipe Anda

import { createNewWorkOrder } from "@/store/slices/workOrderSlice";
// import { WoPriorityType, WoProgressStatus } from "@/types/work-order";

import {
  WoPriorityType,
  WoProgressStatus,
  workOrderFormSchema,
  WorkOrderFormValues,
} from "@/types/work-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
// =======================================================

interface WoDialogProps {
  onClose?: () => void;
}

const WoDialog: React.FC<WoDialogProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.workOrders.status);
  const error = useAppSelector((state) => state.workOrders.error);

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderFormSchema), // Gunakan workOrderFormSchema
    defaultValues: {
      woNumber: "",
      woMaster: "",
      date: undefined,
      vehicleMake: "",
      model: "",
      trimLevel: null,
      licensePlate: "",
      vinNum: "",
      engineNum: "",
      settledOdo: 0,
      customer: "",
      carUser: "",
      vendor: "",
      remark: "",
      mechanic: "",
      schedule: undefined,
      vehicleLocation: "",
      notes: null,
      driver: null,
      driverContact: null,
      approvedBy: null,
      custPicContact: null,
      requestBy: null,
      // progresStatus: WoProgressStatus.NEW,
      // priorityType: WoPriorityType.NORMAL,
    },
  });

  // ... (sisanya dari kode WoDialog.tsx Anda) ...
  const onSubmit = async (values: WorkOrderFormValues) => {
    console.log("Mengirim Work Order Baru:", values);
    try {
      const resultAction = await dispatch(createNewWorkOrder(values)).unwrap();
      console.log("Work Order berhasil dibuat:", resultAction);
      alert("Work Order berhasil dibuat!");
      onClose?.();
      form.reset();
    } catch (err: any) {
      console.error("Gagal membuat Work Order:", err);
      alert(`Gagal membuat Work Order: ${error || "Terjadi kesalahan"}`);
    }
  };

  return (
    // ... (render form Anda) ...
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4"
      >
        {/* ... (Semua field form Anda) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="woNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WO</FormLabel>
                <FormControl>
                  <Input placeholder="WO 2025/xxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="woMaster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WO Master</FormLabel>
                <FormControl>
                  <Input placeholder="WO 2025/xxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Baris 2: Request Date & Schedule Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Request</FormLabel>
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
                          format(field.value, "PPP")
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
                      onSelect={(date) => field.onChange(date || undefined)}
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
            name="schedule"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Jadwal</FormLabel>
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
                          format(field.value, "PPP")
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
                      onSelect={(date) => field.onChange(date || undefined)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Baris 3: Vehicle Make, Model, Trim Level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="vehicleMake"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merk Kendaraan</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota, Honda, dll." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Camry, Civic, dll." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trimLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trim Level (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Premium, RS, dll."
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
        </div>

        {/* Baris 4: License Plate, VIN, Engine Num */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plat Nomor</FormLabel>
                <FormControl>
                  <Input placeholder="B 1234 ABC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vinNum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor VIN</FormLabel>
                <FormControl>
                  <Input placeholder="MHF123..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="engineNum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Mesin</FormLabel>
                <FormControl>
                  <Input placeholder="3ZR-FE001..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Baris 5: Odometer */}
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
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? 0 : Number(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Baris 6: Customer, Car User, Vendor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <FormControl>
                  <Input placeholder="PT. Dipo Star Finance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pengguna Mobil</FormLabel>
                <FormControl>
                  <Input placeholder="PT. SPX express" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vendor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <FormControl>
                  <Input placeholder="PT. Lawak Abadi Sejahtera" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Baris 7: Remark (Complaint) */}
        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan / Keluhan</FormLabel>
              <FormControl>
                <Textarea placeholder="Mesin tidak mau starter..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Baris 8: Mechanic & Vehicle Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mechanic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mekanik</FormLabel>
                <FormControl>
                  <Input placeholder="Arip Wong Sabar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi Kendaraan</FormLabel>
                <FormControl>
                  <Input placeholder="DC Shopee Rungkut" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Baris 9: Notes (Optional) */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Disarankan mengganti shock absorber depan..."
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

        {/* Baris 10: Driver & Driver Contact (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="driver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Driver (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cak Cuk"
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
          <FormField
            control={form.control}
            name="driverContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kontak Driver (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="081543239483"
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
        </div>

        {/* Baris 11: Approved By & Cust PIC Contact & Request By (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="approvedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disetujui Oleh (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="PIC Vendor"
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
          <FormField
            control={form.control}
            name="custPicContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kontak PIC Customer (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="081543239483"
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
          <FormField
            control={form.control}
            name="requestBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diminta Oleh (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="PIC Customer"
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
        </div>

        {/* Baris 12: Progress Status & Priority Type (Enum Select) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="progresStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Progres</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status progres" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(WoProgressStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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
            name="priorityType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Prioritas</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe prioritas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(WoPriorityType).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

export default WoDialog;
