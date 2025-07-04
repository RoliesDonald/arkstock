"use client";
import TableMain from "@/components/common/table/TableMain";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// IMPOR KOMPONEN DIALOG WO (InvDialog)
// import InvDialog from "@/components/invDialog/InvDialog";

import {
  WorkOrder,
  WoProgresStatus,
  WorkOrderFormValues,
} from "@/types/workOrder";
import {
  workOrderData as initialWorkOrderData,
  workOrderData,
} from "@/data/sampleWorkOrderData";

// IMPOR KOMPONEN DIALOG INVOICE BARU DAN TIPE TERKAIT
import InvoiceDialog from "@/components/dialog/invoiceDialog/InvoiceDialog"; // <-- IMPORT DIALOG INVOICE BARU
import {
  Invoice,
  InvoiceFormValues,
  InvoiceItem,
  InvoiceService,
  InvoiceStatus,
} from "@/types/invoice";
import { sparePartData } from "@/data/sampleSparePartData"; // Untuk lookup spare part
import { serviceData } from "@/data/sampleServiceData"; // Untuk lookup service
import { companyData } from "@/data/sampleCompanyData"; // Untuk lookup company
import { vehicleData } from "@/data/sampleVehicleData"; // Untuk lookup vehicle
import { userData } from "@/data/sampleUserData"; // Untuk lookup user

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";

export default function WorkOrderPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const allWorkOrders = useAppSelector((state) => state.workOrders.workOrders);
  const workOrderStatus = useAppSelector((state) => state.workOrders.status);
  const workOrderError = useAppSelector((state) => state.workOrders.error);
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isWoDialogOpen, setIsWoDialogOpen] = useState<boolean>(false);
  const [editWorkOrderData, setEditWorkOrderData] = useState<
    WorkOrder | undefined
  >(undefined);

  const [allWorkOrders, setAllWorkOrders] =
    useState<WorkOrder[]>(initialWorkOrderData);

  useEffect(() => {
    if (workOrderStatus === "idle") {
      dispatch(fetchWorkOrders());
    }
    console.log(
      "Sample Work Order Data Loaded",
      JSON.stringify(workOrderData, null, 2)
    );
  }, [dispatch, workOrderStatus]);

  const handleDetailWorkOrder = useCallback(
    (workOrder: WorkOrder) => {
      router.push(`/work-orders/${workOrder.id}`);
    },
    [router]
  );

  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [selectedWoForInvoice, setSelectedWoForInvoice] =
    useState<WorkOrder | null>(null);

  // State untuk menyimpan daftar Invoice (opsional, tergantung di mana Anda ingin menyimpan invoice)
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]); // Dimulai kosong, karena akan dibuat dari WO

  // Definisi kolom untuk Work Order
  const woColumns: ColumnDef<WorkOrder>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      { accessorKey: "woNumber", header: "Nomor WO" },
      { accessorKey: "woMaster", header: "WO Master" },
      {
        accessorKey: "date",
        header: "Tanggal WO",
        cell: ({ row }) =>
          format(row.original.date, "dd MMM yyyy", { locale: id }),
      },
      { accessorKey: "settledOdo", header: "Odometer (KM)" },
      { accessorKey: "remark", header: "Keluhan" },
      {
        accessorKey: "progresStatus",
        header: "Status Progres",
        cell: ({ row }) => {
          const status = row.original.progresStatus;
          let statusColor = "";
          switch (status) {
            case WoProgresStatus.DRAFT:
              statusColor = "bg-gray-100 text-gray-800";
              break;
            case WoProgresStatus.PENDING:
              statusColor = "bg-yellow-100 text-yellow-800";
              break;
            case WoProgresStatus.ON_PROCESS:
              statusColor = "bg-blue-100 text-blue-800";
              break;
            case WoProgresStatus.WAITING_APPROVAL:
              statusColor = "bg-purple-100 text-purple-800";
              break;
            case WoProgresStatus.WAITING_PART:
              statusColor = "bg-orange-100 text-orange-800";
              break;
            case WoProgresStatus.FINISHED:
              statusColor = "bg-green-100 text-green-800";
              break;
            case WoProgresStatus.CANCELED:
              statusColor = "bg-red-100 text-red-800";
              break;
            case WoProgresStatus.INVOICE_CREATED: // <-- Status baru
              statusColor = "bg-indigo-100 text-indigo-800";
              break;
            default:
              statusColor = "bg-gray-100 text-gray-700";
          }
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
            >
              {status.replace(/_/g, " ")}
            </span>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const workOrder = row.original;

          const handleCreateInvoiceClick = () => {
            // Hanya izinkan membuat invoice jika WO belum memiliki status INVOICE_CREATED
            if (workOrder.progresStatus === WoProgresStatus.INVOICE_CREATED) {
              alert(
                `Invoice sudah dibuat untuk Work Order ${workOrder.woNumber}.`
              );
              return;
            }
            setSelectedWoForInvoice(workOrder); // Set Work Order yang dipilih
            setIsInvoiceDialogOpen(true); // Buka dialog Invoice
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open Menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={handleCreateInvoiceClick}
                  // disable item jika invoice sudah dibuat
                  disabled={
                    workOrder.progresStatus === WoProgresStatus.INVOICE_CREATED
                  }
                >
                  Create new Invoice from this WO
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDetailWorkOrder(workOrder)}
                  // onClick={() => alert(`Lihat detail WO ${workOrder.woNumber}`)}
                >
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDetailWorkOrder(workOrder)}
                >
                  Edit Work Order
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert(`Hapus WO ${workOrder.woNumber}`)}
                  className="text-red-600"
                >
                  Hapus Work Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDetailWorkOrder]
  );

  const filteredWorkOrders = useMemo(() => {
    let currentWorkOrders = allWorkOrders;
    if (activeTab !== "all") {
      currentWorkOrders = currentWorkOrders.filter((wo) => {
        const activeStatus = activeTab.toUpperCase().replace(/ /g, "_");
        if (
          Object.values(WoProgresStatus).includes(
            activeStatus as WoProgresStatus
          )
        ) {
          return wo.progresStatus === (activeStatus as WoProgresStatus);
        }
        return true;
      });
    }
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentWorkOrders = currentWorkOrders.filter((wo) =>
        Object.values(wo).some(
          (value) =>
            (typeof value === "string" &&
              value.toLowerCase().includes(lowerCaseQuery)) ||
            (value instanceof Date &&
              format(value, "dd-MM-yyyy").includes(lowerCaseQuery)) ||
            (typeof value === "number" &&
              value.toString().includes(lowerCaseQuery))
        )
      );
    }
    return currentWorkOrders;
  }, [allWorkOrders, activeTab, searchQuery]);

  const woTabItems = useMemo(() => {
    const allCount = allWorkOrders.length;
    const tabItems = [{ value: "all", label: "All", count: allCount }];

    Object.values(WoProgresStatus).forEach((status) => {
      tabItems.push({
        value: status.toLowerCase().replace(/_/g, " "),
        label: status.replace(/_/g, " "),
        count: allWorkOrders.filter((wo) => wo.progresStatus === status).length,
      });
    });

    return tabItems;
  }, [allWorkOrders]);

  // Fungsi untuk menangani submit Work Order baru (jika masih ada tombol "Tambah Baru" WO)
  const handleAddWoSubmit = (values: WorkOrderFormValues) => {
    const newWo: WorkOrder = {
      id: uuidv4(),
      ...values,
      createdAt: new Date(),
      updatedAt: new Date(),
      woNumber: values.woNumber!,
      schedule: values.schedule,
      notes: values.notes || null,
      mechanicId: values.mechanicId || null,
      driverId: values.driverId || null,
      driverContact: values.driverContact || null,
      approvedById: values.approvedById || null,
      requestedById: values.requestedById || null,
      locationId: values.locationId || null,
      settledOdo: values.settledOdo ?? null,
    };
    setAllWorkOrders((prev) => [...prev, newWo]);
    setIsWoDialogOpen(false);
    alert("Work Order berhasil ditambahkan!");
  };

  // Fungsi untuk menangani submit Invoice baru dari InvoiceDialog
  const handleAddInvoiceSubmit = (values: InvoiceFormValues) => {
    if (!selectedWoForInvoice) {
      console.error("Tidak ada Work Order yang dipilih untuk membuat Invoice.");
      return;
    }

    // Lookup data terkait dari Work Order yang dipilih
    const vehicle = vehicleData.find(
      (v) => v.id === selectedWoForInvoice.vehicleId
    );
    const customerCompany = companyData.find(
      (c) => c.id === selectedWoForInvoice.customerId
    );
    const carUserCompany = companyData.find(
      (c) => c.id === selectedWoForInvoice.carUserId
    );
    const mechanicUser = userData.find(
      (u) => u.id === selectedWoForInvoice.mechanicId
    );
    const approvedByUser = userData.find(
      (u) => u.id === selectedWoForInvoice.approvedById
    );

    // Transform partItems dari form values ke InvoiceItem[]
    const transformedPartItems: InvoiceItem[] =
      values.partItems?.map((item) => {
        const sparePart = sparePartData.find(
          (sp) => sp.id === item.sparePartId
        );
        return {
          id: uuidv4(),
          invoiceId: "", // Akan diisi saat disimpan ke DB
          sparePartId: item.sparePartId,
          itemName: item.itemName,
          partNumber: item.partNumber,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          createdAt: new Date(),
          updatedAt: new Date(),
          sparePart: sparePart, // Sertakan detail spare part untuk tampilan
        };
      }) || [];

    // Transform serviceItems dari form values ke InvoiceService[]
    const transformedServiceItems: InvoiceService[] =
      values.serviceItems?.map((item) => {
        const service = serviceData.find((s) => s.id === item.serviceId);
        return {
          id: uuidv4(),
          invoiceId: "", // Akan diisi saat disimpan ke DB
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          description: item.description ?? null,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          createdAt: new Date(),
          updatedAt: new Date(),
          service: service, // Sertakan detail service untuk tampilan
        };
      }) || [];

    // 1. Buat objek Invoice baru
    const newInvoice: Invoice = {
      id: uuidv4(), // Generate ID unik untuk Invoice
      invNum:
        values.invNum ||
        `INV-${new Date().getFullYear()}-${(new Date().getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${uuidv4().substring(0, 5).toUpperCase()}`,
      date: values.date,
      requestOdo: values.requestOdo ?? null,
      actualOdo: values.actualOdo ?? null,
      remark: values.remark,
      finished: values.finished,
      totalAmount: values.totalAmount || 0,
      woId: selectedWoForInvoice.id, // Link ke Work Order yang dipilih

      // Properti yang diambil dari Work Order untuk tampilan di Invoice
      woMaster: selectedWoForInvoice.woMaster,
      vehicleMake: vehicle?.vehicleMake || "",
      model: vehicle?.model || "",
      licensePlate: vehicle?.licensePlate || "",
      vinNum: vehicle?.vinNum || null,
      engineNum: vehicle?.engineNum || null,
      customer: customerCompany?.companyName || "",
      carUser: carUserCompany?.companyName || "",
      mechanic: mechanicUser?.name || null,
      approvedBy: approvedByUser?.name || null,

      status: values.status || InvoiceStatus.DRAFT,
      invoiceItems: transformedPartItems, // Gunakan transformed items
      invoiceServices: transformedServiceItems, // Gunakan transformed services
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Invoice baru ditambahkan:", newInvoice);

    // 2. Tambahkan invoice baru ke state (contoh: allInvoices)
    setAllInvoices((prev: Invoice[]) => [...prev, newInvoice]);

    // 3. Update status Work Order yang terkait
    setAllWorkOrders((prevWorkOrders: WorkOrder[]) =>
      prevWorkOrders.map((wo) =>
        wo.id === selectedWoForInvoice.id
          ? { ...wo, progresStatus: WoProgresStatus.INVOICE_CREATED }
          : wo
      )
    );

    // 4. Tutup dialog Invoice dan reset state
    setIsInvoiceDialogOpen(false);
    setSelectedWoForInvoice(null);
    alert("Invoice berhasil dibuat dan status Work Order diperbarui!");
  };

  const handleWoDialogClose = () => {
    setIsWoDialogOpen(false);
  };

  const handleInvoiceDialogClose = () => {
    setIsInvoiceDialogOpen(false);
    setSelectedWoForInvoice(null); // Penting: Reset selectedWoForInvoice
  };

  return (
    <>
      <TableMain<WorkOrder>
        searchQuery={searchQuery}
        data={filteredWorkOrders}
        columns={woColumns}
        tabItems={woTabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showAddButton={false}
        showDownloadPrintButtons={true}
        emptyMessage="Tidak ada Work Order ditemukan."
        // Properti dialog untuk WO (bisa dipertahankan jika ada flow edit WO atau tambah manual dari halaman lain)
        isDialogOpen={isWoDialogOpen}
        onOpenChange={setIsWoDialogOpen}
        // dialogContent={<InvDialog onClose={handleWoDialogClose} />}
        dialogTitle="Buat Work Order Baru (Manual)"
        // extraButtonLabel="Buat WO Baru"
        dialogDescription="Isi detail Work Order secara manual."
      />

      {/* Dialog untuk membuat Invoice dari WO yang dipilih */}
      {isInvoiceDialogOpen &&
        selectedWoForInvoice && ( // Render hanya jika dialog terbuka dan ada WO yang dipilih
          <TableMain // Re-use TableMain's Dialog wrapper capabilities
            isDialogOpen={isInvoiceDialogOpen}
            onOpenChange={setIsInvoiceDialogOpen}
            dialogContent={
              <InvoiceDialog
                initialWoData={selectedWoForInvoice} // Teruskan data WO yang dipilih
                onSubmitInvoice={handleAddInvoiceSubmit}
                onClose={handleInvoiceDialogClose}
              />
            }
            dialogTitle={`Buat Invoice dari WO: ${
              selectedWoForInvoice?.woNumber || "N/A"
            }`}
            dialogDescription="Isi detail invoice berdasarkan Work Order yang dipilih."
            // Props ini tidak digunakan oleh TableMain jika hanya sebagai wrapper Dialog,
            // tetapi harus ada agar tidak ada error TypeScript jika TableMain mengharapkan semua props ini.
            searchQuery={""}
            data={[]}
            columns={[]}
            tabItems={[]}
            activeTab={""}
            onTabChange={() => {}}
          />
        )}
    </>
  );
}
