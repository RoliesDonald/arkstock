// lib/utils/isActiveRoute.ts
import { MenuItem } from "@/types/sidebar";

export const isActiveRoute = (
  currentPathname: string,
  item: MenuItem,
  params: Record<string, string | null | undefined> // Anda bisa pakai ini untuk rute dinamis
): boolean => {
  if (!item.href) {
    return false;
  }

  // Case 1: Pencocokan eksak
  if (currentPathname === item.href) {
    return true;
  }

  // Case 2: Rute dinamis (contoh: /users/[id] match /users/123)
  // Ini adalah bagian yang paling tricky dan mungkin butuh penyesuaian khusus
  // Contoh dasar, jika href item adalah parent dari pathname
  if (item.href.includes("[") && item.href.includes("]")) {
    // Hapus segmen dinamis dari href item untuk perbandingan dasar
    const baseItemHref = item.href.split("[")[0];
    if (currentPathname.startsWith(baseItemHref) && baseItemHref !== "/") {
      return true;
    }
  }

  // Case 3: Jika item adalah grup dan salah satu anaknya aktif
  if (item.children) {
    return item.children.some((child) =>
      isActiveRoute(currentPathname, child, params)
    );
  }

  return false;
};
