// types/sidebar.ts
import { LucideIcon } from "lucide-react"; // Pastikan Anda menginstal lucide-react

export type MenuItem = {
  title: string;
  href?: string; // Opsional jika ada sub-menu (untuk parent menu)
  icon?: LucideIcon; // Icon untuk menu
  children?: MenuItem[]; // Sub-menu
  roles?: string[]; // Role yang memiliki akses ke menu ini (misal: "ADMIN", "FINANCE", "WAREHOUSE_STAFF")
  companyTypes?: string[]; // Tipe perusahaan yang memiliki akses (misal: "INTERNAL", "SERVICE_MAINTENANCE")
  separator?: boolean; // Untuk garis pemisah
  notification?: number; // Tambahkan notification
  groupTitle?: boolean; // Tambahkan groupTitle
};
