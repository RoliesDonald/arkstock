// lib/sidebar-data.ts
import {
  LayoutDashboard,
  Users,
  Building,
  Car,
  ClipboardList,
  Package,
  Receipt,
  FileText,
  Warehouse,
  Settings,
  User,
  ChartBar,
  PlusCircle,
  Tag, // Untuk faktur (tag)
  Truck, // Untuk armada/kendaraan
  Factory, // Untuk supplier/vendor
  BriefcaseBusiness, // General Affair
  Scale, // Tax
  Handshake,
  UsersRound, // Customers (jika bukan users)
} from "lucide-react"; // Import ikon dari Lucide Icons

// Jika Anda menggunakan enum dari Prisma atau sejenisnya, import di sini:
// import { CompanyType, EmployeeRole } from "@prisma/client";

import { MenuItem } from "@/types/sidebar"; // Import type MenuItem yang baru

export const sidebarMenuItems: MenuItem[] = [
  // ======================================
  // Bagian Umum & Dashboard
  // ======================================
  {
    title: "Dashboard",
    groupTitle: true,
    children: [
      {
        title: "Dashboard",
        href: "/app-dashboard", // Ini adalah dashboard generik untuk semua authenticated user
        icon: LayoutDashboard,
        roles: [
          "SuperAdmin",
          "AdminUser",
          "FLEET_PIC",
          "SERVICE_ADVISOR",
          "MECHANIC",
          "WAREHOUSE_STAFF",
          "FINANCE_STAFF",
          "SALES_STAFF",
        ],
        notification: 2,
      },
      {
        title: "Super Admin Dashboard", // Dashboard khusus SuperAdmin
        href: "/admin-dashboard",
        icon: LayoutDashboard,
        roles: ["SuperAdmin"],
        notification: 88,
      },
    ],
  },
  {
    separator: true,
    title: "",
  },
  // ======================================
  // Manajemen Utama (Operasional)
  // ======================================
  {
    title: "Operational",
    groupTitle: true,
    children: [
      {
        title: "Customer", // Ganti "Customers"
        groupTitle: false,
        // href: "/companies?type=CUSTOMER", // Asumsi Anda bisa memfilter berdasarkan type
        href: "/companies",
        icon: Handshake,
        roles: ["SuperAdmin", "AdminUser", "SALES_STAFF"],
        companyTypes: [
          "INTERNAL",
          "RENTAL_COMPANY",
          "FLEET_COMPANY",
          "SERVICE_MAINTENANCE",
        ], // Jika ada filter berdasarkan companyType
        notification: 0,
      },
      {
        title: "Manajemen Kendaraan", // Ganti "Armada"
        href: "",
        icon: Car,
        roles: ["SuperAdmin", "AdminUser", "FLEET_PIC", "SERVICE_ADVISOR"],
        companyTypes: [
          "FLEET_COMPANY",
          "RENTAL_COMPANY",
          "SERVICE_MAINTENANCE",
        ], // Hanya jika perusahaan adalah Fleet atau Rental
        children: [
          {
            title: "Daftar Kendaraan",
            href: "/vehicles",
            icon: Truck,
          },
        ],
      },
      {
        title: "Operational", // Ganti "SPK"
        href: "",
        icon: ClipboardList,
        roles: [
          "SuperAdmin",
          "AdminUser",
          "SERVICE_ADVISOR",
          "MECHANIC",
          "FLEET_PIC",
        ], // PIC juga mungkin perlu melihat
        companyTypes: [
          "INTERNAL",
          "RENTAL_COMPANY",
          "FLEET_COMPANY",
          "SERVICE_MAINTENANCE",
        ],
        notification: 2, // Contoh dari SPK Anda
        children: [
          {
            title: "Daftar Work Order",
            href: "/work-orders",
            icon: ClipboardList,
          },
          {
            title: "List Mekanik",
            href: "/vendors/[vendorId]/employees", // src\app\(main)\work-orders\mechanics\page.tsx
            icon: UsersRound,
          },
        ],
      },
      {
        title: "General Affair", // Jika ini adalah modul terpisah
        href: "/general-affair", // Sesuaikan dengan route yang benar
        icon: BriefcaseBusiness,
        roles: ["SuperAdmin", "AdminUser"], // Atur peran yang relevan
      },
    ],
  },
  {
    separator: true,
    title: "",
  },
  // ======================================
  // Manajemen Keuangan
  // ======================================
  {
    title: "Keuangan & Faktur",
    groupTitle: true,
    children: [
      {
        title: "Summary",
        href: "/finance/overview", // Jika ada overview
        icon: ChartBar,
        roles: ["SuperAdmin", "FINANCE_STAFF"],
        notification: 2, // Contoh dari Finance Dashboard Anda
      },
      {
        title: "Estimasi", // Dari /estimations
        href: "/estimations",
        icon: FileText,
        roles: ["SuperAdmin", "FINANCE_STAFF", "SERVICE_ADVISOR"],
        notification: 0,
      },
      {
        title: "Invoice", // Dari /invoices
        href: "/invoices",
        icon: Receipt,
        roles: ["SuperAdmin", "FINANCE_STAFF", "SALES_STAFF"],
        notification: 2, // Contoh dari Invoice Anda
      },
      {
        title: "Faktur Pembelian", // Ganti "Faktur" di Warehouse/Finance Anda
        href: "/purchase-orders", // Faktur di sini mungkin adalah Purchase Order
        icon: Tag, // BiSolidPurchaseTag diganti dengan Lucide Tag
        roles: ["SuperAdmin", "WAREHOUSE_STAFF", "FINANCE_STAFF"],
        notification: 8, // Contoh dari Faktur Anda
      },
      {
        title: "Manajemen Pajak", // Dari "tax"
        href: "/tax/dashboard", // Asumsi ada dashboard pajak
        icon: Scale,
        roles: ["SuperAdmin", "FINANCE_STAFF"],
        notification: 2,
        children: [
          {
            title: "Laporan PPn",
            href: "/tax/ppn",
            icon: FileText,
          },
          {
            title: "Laporan SPT",
            href: "/tax/spt",
            icon: FileText,
          },
        ],
      },
    ],
  },

  // ======================================
  // Manajemen Inventaris & Supplier
  // ======================================
  {
    title: "Gudang & Mitra",
    groupTitle: true,
    children: [
      {
        title: "Daftar Stok & Spare Part", // Ganti "Stock"
        href: "/spare-parts",
        icon: Package, // FaBoxesStacked diganti dengan Lucide Package
        roles: ["SuperAdmin", "AdminUser", "WAREHOUSE_STAFF", "MECHANIC"],
        notification: 1, // Contoh dari Stock Anda
        children: [
          {
            title: "Daftar Spare Part",
            href: "/spare-parts",
            icon: Package,
          },
          {
            title: "Tambah Spare Part",
            href: "/spare-parts/create",
            icon: PlusCircle,
            roles: ["SuperAdmin", "WAREHOUSE_STAFF"],
          },
        ],
      },
      {
        title: "Gudang", // Jika ada modul terpisah untuk manajemen gudang
        href: "/warehouses",
        icon: Warehouse,
        roles: ["SuperAdmin", "WAREHOUSE_STAFF"],
        children: [
          {
            title: "Daftar Gudang",
            href: "/warehouses",
            icon: Warehouse,
          },
          // Sub-menu detail gudang seperti spare-parts di dalamnya akan diakses dari detail gudang
        ],
      },
      {
        title: "Manajemen Vendor", // Ganti "Supplier" dan "Vendor"
        href: "/vendors",
        icon: Factory, // Mengganti FaBoxesStacked untuk Supplier
        roles: [
          "SuperAdmin",
          "AdminUser",
          "WAREHOUSE_STAFF",
          "FINANCE_STAFF",
          "FLEET_PIC",
        ], // Siapa saja yang berinteraksi dengan vendor
        children: [
          {
            title: "Daftar Vendor",
            href: "/vendors",
            icon: Factory,
          },
          {
            title: "Tambah Vendor",
            href: "/vendors/create",
            icon: PlusCircle,
            roles: ["SuperAdmin"], // Hanya admin yang bisa menambah
          },
        ],
      },
    ],
  },
  {
    separator: true,
    title: "",
  },
  // ======================================
  // Manajemen Pengguna & Sistem
  // ======================================
  {
    title: "Managemen & HRD",
    groupTitle: true,
    children: [
      {
        title: "Manajemen Karyawan", // Ganti "Employee", "PIC", "Staff"
        href: "/admin-dashboard/users", // Rute global untuk semua karyawan
        icon: Users, // FaUserShield diganti dengan Lucide Users
        roles: ["SuperAdmin", "AdminUser"],
        notification: 0,
        children: [
          {
            title: "Daftar Karyawan",
            href: "/admin-dashboard/users",
            icon: Users,
          },
          // Tambah Karyawan tidak perlu di sidebar jika hanya admin yang bisa
          // {
          //   title: "Tambah Karyawan",
          //   href: "/admin-dashboard/users/create",
          //   icon: PlusCircle,
          // },
        ],
      },
      {
        title: "Manajemen Perusahaan", // Mengelola semua perusahaan
        href: "/admin-dashboard/companies",
        icon: Building,
        roles: ["SuperAdmin"],
        notification: 0,
        children: [
          {
            title: "Daftar Perusahaan",
            href: "/admin-dashboard/companies",
            icon: Building,
          },
          {
            title: "Tambah Perusahaan",
            href: "/admin-dashboard/companies/create",
            icon: PlusCircle,
          },
        ],
      },
      {
        title: "Pengaturan Sistem",
        href: "/admin-dashboard/settings",
        icon: Settings,
        roles: ["SuperAdmin"],
      },
    ],
  },
  {
    separator: true,
    title: "",
  },
  // ======================================
  // Profil
  // ======================================
  {
    title: "Akun",
    groupTitle: true,
    children: [
      {
        title: "Profil Saya",
        href: "/profile",
        icon: User,
        roles: [
          "SuperAdmin",
          "AdminUser",
          "FLEET_PIC",
          "SERVICE_ADVISOR",
          "MECHANIC",
          "WAREHOUSE_STAFF",
          "FINANCE_STAFF",
          "SALES_STAFF",
        ],
      },
      // {
      //   title: "Bantuan",
      //   href: "/help",
      //   icon: HelpCircle,
      // },
    ],
  },
];
