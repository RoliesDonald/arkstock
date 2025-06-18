// src/config/sidebar.ts
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
  UsersRound,
  HelpCircle, // Menambahkan HelpCircle jika ingin menggunakannya
} from "lucide-react"; // Import ikon dari Lucide Icons

// Definisikan interface MenuItem agar sesuai dengan struktur Anda
// Asumsikan MenuItem sudah didefinisikan di '@/types/sidebar'
export interface MenuItem {
  title: string;
  href?: string; // Opsional jika groupTitle true atau hanya memiliki children
  icon?: React.ElementType;
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
        title: "Dashboard",
        href: "/dashboard", // Sesuai dengan src/app/(main)/dashboard/page.tsx (sebelumnya /app-dashboard)
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
        href: "/admin-dashboard", // Sesuai dengan src/app/(main)/admin-dashboard/page.tsx
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
        title: "Company", // Ganti "Customers"
        groupTitle: false,
        href: "/companies", // Sesuai dengan src/app/(main)/companies/page.tsx
        icon: Handshake,
        roles: ["SuperAdmin", "AdminUser", "SALES_STAFF"],
        companyTypes: [
          "INTERNAL",
          "RENTAL_COMPANY",
          "FLEET_COMPANY",
          "SERVICE_MAINTENANCE",
        ],
        notification: 0,
      },
      {
        title: "Manajemen Kendaraan", // Ganti "Armada"
        href: "/vehicles", // Sesuai dengan src/app/(main)/vehicles/page.tsx
        icon: Car,
        roles: ["SuperAdmin", "AdminUser", "FLEET_PIC", "SERVICE_ADVISOR"],
        companyTypes: [
          "FLEET_COMPANY",
          "RENTAL_COMPANY",
          "SERVICE_MAINTENANCE",
        ],
        children: [
          {
            title: "Daftar Kendaraan",
            href: "/vehicles",
            icon: Truck, // Menggunakan Truck untuk daftar kendaraan
          },
          {
            title: "Tambah Kendaraan",
            href: "/vehicles/create", // Sesuai dengan src/app/(main)/vehicles/create/page.tsx
            icon: PlusCircle,
          },
        ],
      },
      {
        title: "Operational", // Work Orders / SPK
        href: "/work-orders", // Sesuai dengan src/app/(main)/work-orders/page.tsx
        icon: ClipboardList,
        roles: [
          "SuperAdmin",
          "AdminUser",
          "SERVICE_ADVISOR",
          "MECHANIC",
          "FLEET_PIC",
        ],
        companyTypes: [
          "INTERNAL",
          "RENTAL_COMPANY",
          "FLEET_COMPANY",
          "SERVICE_MAINTENANCE",
        ],
        notification: 2,
        children: [
          {
            title: "Daftar Work Order", // Mengganti "List WO"
            href: "/work-orders", // Sesuai dengan src/app/(main)/work-orders/page.tsx
            icon: ClipboardList,
          },
          {
            title: "Buat Work Order", // Menambahkan "Buat WO"
            href: "/work-orders/create", // Sesuai dengan src/app/(main)/work-orders/create/page.tsx
            icon: PlusCircle,
          },
          {
            title: "Daftar Karyawan", // Ini akan merujuk ke daftar karyawan global atau di admin-dashboard
            href: "/admin-dashboard/users", // Sesuai dengan src/app/(main)/admin-dashboard/users/page.tsx
            icon: UsersRound,
            roles: ["SuperAdmin", "AdminUser", "SERVICE_ADVISOR"], // Peran yang bisa melihat daftar karyawan
          },
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
        title: "Estimasi",
        href: "/estimations", // Sesuai dengan src/app/(main)/estimations/page.tsx
        icon: FileText,
        roles: ["SuperAdmin", "FINANCE_STAFF", "SERVICE_ADVISOR"],
        notification: 0,
      },
      {
        title: "Invoice",
        href: "/invoices", // Sesuai dengan src/app/(main)/invoices/page.tsx
        icon: Receipt,
        roles: ["SuperAdmin", "FINANCE_STAFF", "SALES_STAFF"],
        notification: 2,
      },
      {
        title: "Faktur Pembelian", // Purchase Orders
        href: "/purchase-orders", // Sesuai dengan src/app/(main)/purchase-orders/page.tsx
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
        title: "Manajemen Pajak",
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
        title: "Daftar Stok & Spare Part",
        href: "/spare-parts", // Sesuai dengan src/app/(main)/spare-parts/page.tsx
        icon: Package,
        roles: ["SuperAdmin", "AdminUser", "WAREHOUSE_STAFF", "MECHANIC"],
        notification: 1,
        children: [
          {
            title: "Daftar Spare Part",
            href: "/spare-parts",
            icon: Package,
          },
          {
            title: "Tambah Spare Part",
            href: "/spare-parts/create", // Sesuai dengan src/app/(main)/spare-parts/create/page.tsx
            icon: PlusCircle,
            roles: ["SuperAdmin", "WAREHOUSE_STAFF"],
          },
        ],
      },
      {
        title: "Gudang",
        href: "/warehouses", // Sesuai dengan src/app/(main)/warehouses/page.tsx
        icon: Warehouse,
        roles: ["SuperAdmin", "WAREHOUSE_STAFF", "WAREHOUSE_MANAGER"], // Menambahkan role manager
        children: [
          {
            title: "Daftar Gudang",
            href: "/warehouses",
            icon: Warehouse,
          },
        ],
      },
      {
        title: "Manajemen Vendor",
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
          {
            title: "Tambah Vendor",
            href: "/vendors/create", // Sesuai dengan src/app/(main)/vendors/create/page.tsx
            icon: PlusCircle,
            roles: ["SuperAdmin", "PURCHASING_STAFF"], // Hanya admin dan purchasing staff yang bisa menambah
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
    title: "Administrasi",
    groupTitle: true,
    children: [
      {
        title: "Manajemen Karyawan",
        href: "/admin-dashboard/users", // Sesuai dengan src/app/(main)/admin-dashboard/users/page.tsx
        icon: Users,
        roles: ["SuperAdmin", "AdminUser"],
        notification: 0,
        children: [
          {
            title: "Daftar Karyawan",
            href: "/admin-dashboard/users",
            icon: Users,
          },
          {
            title: "Tambah Karyawan", // Menambahkan opsi tambah karyawan di sidebar admin
            href: "/admin-dashboard/users/create",
            icon: PlusCircle,
          },
        ],
      },
      {
        title: "Manajemen Perusahaan", // Untuk SuperAdmin mengelola semua perusahaan
        href: "/admin-dashboard/companies", // Sesuai dengan src/app/(main)/admin-dashboard/companies/page.tsx
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
            href: "/admin-dashboard/companies/create", // Sesuai dengan src/app/(main)/admin-dashboard/companies/create/page.tsx
            icon: PlusCircle,
          },
        ],
      },
      {
        title: "Pengaturan Sistem",
        href: "/admin-dashboard/settings", // Sesuai dengan src/app/(main)/admin-dashboard/settings/page.tsx
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
        href: "/profile", // Sesuai dengan src/app/(main)/profile/page.tsx
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
          "ACCOUNTING_STAFF", // Menambahkan role yang sebelumnya tidak ada
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
