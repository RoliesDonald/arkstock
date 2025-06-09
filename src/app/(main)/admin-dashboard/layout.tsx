import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Super Admin Dashboard | Ark Power Apps",
  description: "Overview and management for Super Admin.",
};

interface DashboardLayoutAdminProps {
  children: React.ReactNode;
}

export default function DashboardLayoutAdmin({
  children,
}: DashboardLayoutAdminProps) {
  return <>{children}</>;
}
