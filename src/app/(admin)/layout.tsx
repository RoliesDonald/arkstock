import { MainLayout } from "@/components/layouts/MainLayout";
import React from "react";

interface AdminGroupLayoutProps {
  children: React.ReactNode;
}

export default function AdminGroupLayout({ children }: AdminGroupLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
