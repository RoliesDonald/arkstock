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
  Tag,
  Truck,
  Factory,
  BriefcaseBusiness,
  Scale,
  Handshake,
  HelpCircle,
  LucideIcon,
  PencilRuler,
  FileKey2, // Menambahkan HelpCircle jika ingin menggunakannya
} from "lucide-react"; // Import ikon dari Lucide Icons
import { title } from "process";

// Definisikan interface MenuItem agar sesuai dengan struktur Anda
// Asumsikan MenuItem sudah didefinisikan di '@/types/sidebar'
export interface MenuItem {
  title: string;
  href?: string; // Opsional jika groupTitle true atau hanya memiliki children
  icon?: LucideIcon;
  roles?: string[]; // Peran pengguna yang diizinkan melihat item ini
  companyTypes?: string[]; // Tipe perusahaan yang diizinkan melihat item ini (jika ada)
  notification?: number; // Jumlah notifikasi
  groupTitle?: boolean; // Menandakan ini adalah judul grup
  separator?: boolean; // Menandakan ini adalah pemisah
  children?: MenuItem[]; // Item menu bersarang
}

export const sidebarMenuItems: MenuItem[] = [
  // ======================================
  // Bagian Umum & Dashboard
  // ======================================
  {
    title: "Main",
    groupTitle: true,
    children: [
      {
        title: "Dashboard Umum", // Ganti menjadi lebih spesifik
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
        title: "Admin Dashboard", // Dashboard khusus SuperAdmin
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
    title: "Operasional",
    groupTitle: true,
    children: [
      {
        title: "Customer", // Ganti dari "Customer" ke "Company" untuk lebih umum
        groupTitle: false,
        href: "/companies", // Sesuai dengan src/app/(main)/companies/page.tsx
        icon: Handshake,
        roles: ["SuperAdmin", "AdminUser", "SALES_STAFF", "FINANCE_STAFF"], // Tambahkan peran yang relevan
        notification: 0,
        children: [
          // Tambahkan sub-menu untuk perusahaan
          {
            title: "List Perusahaan",
            href: "/companies",
            icon: Building,
          },
          // {
          //   title: "Tambah Perusahaan",
          //   href: "/companies/create",
          //   icon: PlusCircle,
          //   roles: ["SuperAdmin", "AdminUser"], // Hanya admin yang bisa menambah
          // },
        ],
      },
      {
        title: "Kendaraan", // Ganti "Armada"
        href: "",
        icon: Car,
        roles: ["SuperAdmin", "AdminUser", "FLEET_PIC", "SERVICE_ADVISOR"],
        children: [
          {
            title: "List Kendaraan",
            href: "/vehicles",
            icon: Truck, // Menggunakan Truck untuk daftar kendaraan
          },
          // {
          //   title: "Tambah Kendaraan",
          //   href: "/vehicles/create", // Sesuai dengan src/app/(main)/vehicles/create/page.tsx
          //   icon: PlusCircle,
          // },
        ],
      },
      {
        title: "Work Order", // Ganti dari "Operational" ke "Manajemen Work Order"
        href: "", // Sesuai dengan src/app/(main)/work-orders/page.tsx
        icon: ClipboardList,
        roles: [
          "SuperAdmin",
          "AdminUser",
          "SERVICE_ADVISOR",
          "MECHANIC",
          "FLEET_PIC",
        ],
        notification: 2,
        children: [
          {
            title: "Work Order",
            href: "/work-orders",
            icon: ClipboardList,
          },
          // {
          //   title: "Buat Work Order",
          //   href: "/work-orders/create", // Sesuai dengan src/app/(main)/work-orders/create/page.tsx
          //   icon: PlusCircle,
          // },
        ],
      },
      {
        title: "General Affair",
        href: "/general-affair", // Sesuaikan dengan route yang benar jika ini ada
        icon: BriefcaseBusiness,
        roles: ["SuperAdmin", "AdminUser"],
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
        title: "Ringkasan Keuangan",
        href: "/finance/overview", // Asumsi ada route ini
        icon: ChartBar,
        roles: ["SuperAdmin", "FINANCE_STAFF", "ACCOUNTING_MANAGER"], // Menambahkan role manager
        notification: 2,
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
        notification: 2,
      },
      {
        title: "Faktur Pembelian", // Purchase Orders
        href: "/purchase-orders",
        icon: Tag,
        roles: [
          "SuperAdmin",
          "WAREHOUSE_STAFF",
          "FINANCE_STAFF",
          "PURCHASING_STAFF",
        ], // Menambahkan purchasing staff
        notification: 8,
      },
      {
        title: "Pajak",
        href: "/tax/dashboard", // Asumsi ada dashboard pajak
        icon: Scale,
        roles: ["SuperAdmin", "FINANCE_STAFF", "ACCOUNTING_MANAGER"],
        notification: 2,
        children: [
          {
            title: "Laporan PPn",
            href: "/tax/ppn", // Asumsi ada route ini
            icon: FileText,
          },
          {
            title: "Laporan SPT",
            href: "/tax/spt", // Asumsi ada route ini
            icon: FileText,
          },
        ],
      },
    ],
  },

  // ======================================
  // Manajemen Inventaris & Mitra
  // ======================================
  {
    title: "Inventaris & Mitra",
    groupTitle: true,
    children: [
      {
        title: "Gudang",
        href: "", // Sesuai dengan src/app/(main)/warehouses/page.tsx
        icon: Warehouse,
        roles: ["SuperAdmin", "WAREHOUSE_STAFF", "WAREHOUSE_MANAGER"], // Menambahkan role manager
        children: [
          {
            title: "List Gudang",
            href: "/warehouse",
            icon: Warehouse,
          },
          // Jika ada fitur tambah gudang melalui halaman terpisah
          // {
          //   title: "Tambah Gudang",
          //   href: "/warehouse/create", // Asumsi ada route ini
          //   icon: PlusCircle,
          //   roles: ["SuperAdmin", "WAREHOUSE_MANAGER"],
          // },
          {
            title: "List Spare Part",
            href: "/spare-parts",
            icon: Package,
          },
          // {
          //   title: "Tambah Spare Part",
          //   href: "/spare-parts/create", // Sesuai dengan src/app/(main)/spare-parts/create/page.tsx
          //   icon: PlusCircle,
          //   roles: ["SuperAdmin", "WAREHOUSE_STAFF"],
          // },
        ],
      },
      {
        title: "Vendor",
        href: "/vendors", // Sesuai dengan src/app/(main)/vendors/page.tsx
        icon: Factory,
        roles: [
          "SuperAdmin",
          "AdminUser",
          "WAREHOUSE_STAFF",
          "FINANCE_STAFF",
          "FLEET_PIC",
          "PURCHASING_STAFF", // Menambahkan purchasing staff
        ],
        children: [
          {
            title: "Daftar Vendor",
            href: "/vendors",
            icon: Factory,
          },
          // {
          //   title: "Tambah Vendor",
          //   href: "/vendors/create", // Sesuai dengan src/app/(main)/vendors/create/page.tsx
          //   icon: PlusCircle,
          //   roles: ["SuperAdmin", "PURCHASING_STAFF"], // Hanya admin dan purchasing staff yang bisa menambah
          // },
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
    title: "Administrasi",
    groupTitle: true,
    children: [
      {
        title: "Karyawan", // Mengacu pada daftar karyawan GLOBAL
        href: "/employees", // Sesuai dengan src/app/(main)/employees/page.tsx
        icon: Users,
        roles: ["SuperAdmin", "AdminUser"],
        notification: 0,
        children: [
          {
            title: "Daftar Karyawan",
            href: "/employees",
            icon: Users,
          },
          // {
          //   title: "Tambah Karyawan", // Menambahkan opsi tambah karyawan di sidebar admin
          //   href: "/employees/create", // Sesuai dengan src/app/(main)/employees/create/page.tsx
          //   icon: PlusCircle,
          // },
        ],
      },
      {
        title: "Pengaturan Sistem",
        href: "/admin-dashboard/settings", // Sesuai dengan src/app/(main)/admin-dashboard/settings/page.tsx
        icon: Settings,
        roles: ["SuperAdmin"],
        children: [
          { title: "Unit", href: "/units", icon: PencilRuler },
          { title: "Paket Service", href: "/services", icon: FileKey2 },
        ],
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
    title: "Personal",
    groupTitle: true,
    children: [
      {
        title: "Profil",
        href: "", // Sesuai dengan src/app/(main)/profile/page.tsx
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
          "ACCOUNTING_STAFF",
          "ACCOUNTING_MANAGER",
          "PURCHASING_STAFF",
          "PURCHASING_MANAGER",
        ],
      },
      {
        title: "Bantuan",
        href: "/help", // Jika ada halaman bantuan
        icon: HelpCircle,
        roles: [
          "SuperAdmin",
          "AdminUser",
          "FLEET_PIC",
          "SERVICE_ADVISOR",
          "MECHANIC",
          "WAREHOUSE_STAFF",
          "FINANCE_STAFF",
          "SALES_STAFF",
          "ACCOUNTING_STAFF",
          "ACCOUNTING_MANAGER",
          "PURCHASING_STAFF",
          "PURCHASING_MANAGER",
        ],
      },
    ],
  },
];
