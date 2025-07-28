"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import NavBar from "../common/NavBar";
import { MySideBar } from "../common/MySidebar";
import { sidebarMenuItems } from "@/config/sidebar";
import Link from "next/link";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const displayUser = currentUser || currentUser;

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]">
        <MySideBar />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-auto scrollbar flex flex-col flex-1 ">
        <NavBar currentUser={displayUser} />

        {/* Main Content Area */}
        <main className="flex-grow p-4 overflow-y-auto">{children}</main>

        {/* Footer */}
        <footer className="bg-background  text-ring  p-4 text-center text-sm border-t border-border  h-3 items-center flex justify-center">
          &copy; {new Date().getFullYear()} Bung Mekanik Power App | User Side.
        </footer>
      </div>
    </div>
  );
}
