import { IconType } from "react-icons";

export interface MenuSection {
  title: string;
  items: MenuItem[];
}
export interface MenuItem {
  icon: IconType | string;
  label: string;
  href: string;
  visible: string[];
  notification?: number;
}

export type MenuData = MenuSection[];
