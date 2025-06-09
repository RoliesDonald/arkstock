"use client";
import { MenuData } from "@/types/menu";
import { BiSolidPurchaseTag, BiSolidReceipt } from "react-icons/bi";
import {
  FaChalkboardTeacher,
  FaUserCheck,
  FaUser,
  FaFileInvoice,
  FaNewspaper,
  FaUserShield, // Untuk 'Attendance'
} from "react-icons/fa";
import { FaBoxesStacked, FaUsersBetweenLines } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";

export const menuItemsAdmin: MenuData = [
  {
    title: "operational",
    items: [
      {
        icon: MdSpaceDashboard,
        label: "Dashboard",
        href: "/admin-dashboard",
        visible: ["SuperAdmin"],
        notification: 0,
      },
      {
        icon: FaUsersBetweenLines,
        label: "Customers",
        href: "/list/customer",
        visible: ["SuperAdmin"],
        notification: 0,
      },
      {
        icon: FaUserShield,
        label: "Employee",
        href: "/bengkel/[bengkelId]/picOperasional",
        visible: ["SuperAdmin"],
        notification: 0,
      },
      {
        icon: FaNewspaper,
        label: "SPK",
        href: "/list/classes",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaNewspaper,
        label: "General Affair",
        href: "/list/classes",
        visible: ["SuperAdmin"],
      },
    ],
  },
  {
    title: "warehouse",
    items: [
      {
        icon: MdSpaceDashboard,
        label: "Dashboard",
        href: "/admin",
        visible: ["SuperAdmin"],
        notification: 0,
      },
      {
        icon: FaBoxesStacked,
        label: "Stock",
        href: "/list/stoks",
        visible: ["SuperAdmin"],
        notification: 1,
      },
      {
        icon: BiSolidPurchaseTag,
        label: "Faktur",
        href: "/list/subjects",
        visible: ["SuperAdmin"],
        notification: 8,
      },
      {
        icon: BiSolidReceipt,
        label: "Purchase Order",
        href: "/list/students",
        visible: ["SuperAdmin"],
        notification: 88,
      },
      {
        icon: FaNewspaper,
        label: "SPK",
        href: "/list/classes",
        visible: ["SuperAdmin"],
        notification: 2,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        icon: MdSpaceDashboard,
        label: "Dashboard",
        href: "/admin",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaChalkboardTeacher,
        label: "Customers",
        href: "/list/teachers",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaUserCheck,
        label: "PIC",
        href: "/list/students",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaUser,
        label: "Staff",
        href: "/list/parents",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaFileInvoice,
        label: "Invoice",
        href: "/list/subjects",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaNewspaper,
        label: "SPK",
        href: "/list/classes",
        visible: ["SuperAdmin"],
        notification: 2,
      },
    ],
  },
  {
    title: "tax",
    items: [
      {
        icon: MdSpaceDashboard,
        label: "Dashboard",
        href: "/admin",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaChalkboardTeacher,
        label: "Customers",
        href: "/list/teachers",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaUserCheck,
        label: "PIC",
        href: "/list/students",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaUser,
        label: "Staff",
        href: "/list/parents",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaFileInvoice,
        label: "Invoice",
        href: "/list/subjects",
        visible: ["SuperAdmin"],
        notification: 2,
      },
      {
        icon: FaNewspaper,
        label: "SPK",
        href: "/list/classes",
        visible: ["SuperAdmin"],
        notification: 2,
      },
    ],
  },
];
export const menuItemsMain: MenuData = [
  {
    title: "operational",
    items: [
      {
        icon: MdSpaceDashboard,
        label: "Dashboard",
        href: "/app-dashboard",
        visible: ["AdminUser"],
        notification: 0,
      },
      {
        icon: FaUsersBetweenLines,
        label: "Customers",
        href: "/list/customer",
        visible: ["AdminUser"],
        notification: 0,
      },
      {
        icon: FaUserShield,
        label: "Operasional",
        href: "/bengkel/[bengkelId]/picOperasional",
        visible: ["AdminUser"],
        notification: 0,
      },
      {
        icon: FaNewspaper,
        label: "SPK",
        href: "/list/classes",
        visible: ["AdminUser"],
        notification: 2,
      },
      {
        icon: FaNewspaper,
        label: "General Affair",
        href: "/list/classes",
        visible: ["AdminUser"],
      },
    ],
  },
  {
    title: "warehouse",
    items: [
      {
        icon: MdSpaceDashboard,
        label: "Dashboard",
        href: "/app-dashboard",
        visible: ["AdminUser"],
        notification: 0,
      },
      {
        icon: FaBoxesStacked,
        label: "Stock",
        href: "/list/stoks",
        visible: ["AdminUser"],
        notification: 1,
      },
      {
        icon: BiSolidReceipt,
        label: "Purchase Order",
        href: "/list/students",
        visible: ["AdminUser"],
        notification: 88,
      },
      {
        icon: FaBoxesStacked,
        label: "Supplier",
        href: "/list/stoks",
        visible: ["AdminUser"],
        notification: 1,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        icon: MdSpaceDashboard,
        label: "Dashboard",
        href: "/admin",
        visible: ["AdminUser"],
        notification: 2,
      },
      {
        icon: BiSolidPurchaseTag,
        label: "Faktur",
        href: "/list/subjects",
        visible: ["AdminUser"],
        notification: 8,
      },
      {
        icon: FaFileInvoice,
        label: "Invoice",
        href: "/list/subjects",
        visible: ["AdminUser"],
        notification: 2,
      },
      {
        icon: FaBoxesStacked,
        label: "Vendor",
        href: "/list/stoks",
        visible: ["AdminUser"],
        notification: 1,
      },
    ],
  },
  {
    title: "tax",
    items: [
      {
        icon: MdSpaceDashboard,
        label: "Dashboard",
        href: "/admin",
        visible: ["AdminUser"],
        notification: 2,
      },
      {
        icon: FaChalkboardTeacher,
        label: "PPn",
        href: "/list/teachers",
        visible: ["AdminUser"],
        notification: 2,
      },
      {
        icon: FaUserCheck,
        label: "SPT",
        href: "/list/students",
        visible: ["AdminUser"],
        notification: 2,
      },
      {
        icon: FaUser,
        label: "Faktur",
        href: "/list/parents",
        visible: ["AdminUser"],
        notification: 2,
      },
    ],
  },
];

export const menuItemsWarehouse: MenuData = [
  {
    title: "main",
    items: [
      {
        icon: FaUserCheck,
        label: "Home",
        href: "/warehouse",
        visible: ["AdminUser"],
        notification: 2,
      },
    ],
  },
];

export const menuItemsBengkel: MenuData = [
  {
    title: "main",
    items: [
      {
        icon: FaUserCheck,
        label: "Home",
        href: "/warehouse",
        visible: ["AdminUser"],
        notification: 2,
      },
    ],
  },
];
