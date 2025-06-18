"use client";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { default as MyMenu } from "./MyMenu";
import { logout } from "@/store/slices/userSlices";
import { LogOut, User } from "lucide-react";
import { Button } from "../ui/button";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  vendorId?: string;
  companyType?: string;
}

export function MySideBar() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    console.log("Sidebar (useEffect):currentUser di MySidebar:", currentUser);
  }, [currentUser]);

  return (
    <div className="flex flex-col h-screen bg-arkBlue-50 bg-opacity-40 shadow-md pt-4">
      {/* SIDEBAR HEAD */}
      <Link
        href={
          currentUser?.role === "SuperAdmin" ? "/admin-dashboard" : "/dashboard"
        }
      >
        <div className="flex items-center justify-center gap-3">
          <Image src="/bm.png" width={30} height={30} alt="logo"></Image>
          <span className="hidden lg:block text-sm font-semibold text-arkBlue-900">
            Bung Mekanik
          </span>
        </div>
      </Link>

      {/* SIDEBAR MENU */}
      <MyMenu />

      {/* SIDEBAR BOTTOM */}
      <div className="items-center justify-center flex  pb-2">
        {/* LOGOUT BUTTON */}
        <Button onClick={() => dispatch(logout())} variant={"secondary"}>
          <LogOut className="w-8 h-8 text-arkBg-800" />
          <span className="hidden lg:block">LogOut</span>
        </Button>
      </div>
    </div>
  );
}
