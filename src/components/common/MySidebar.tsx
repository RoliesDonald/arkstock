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
  bengkelId?: string;
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
      <div>
        <Link
          href={"/profile"}
          className="flex items-center p-3 rounded-lg text-arkBg-700 hover:bg-border transition-colors duration-200"
        >
          <User className="h-5 w-5 mr-3" />
          <span className="hidden lg:block">Profilwwwe</span>
        </Link>
        {/* LOGOUT BUTTON */}
        <Button
          onClick={() => dispatch(logout())}
          className="flex items-center w-full p-3 rounded-lg text-arkBg-700 hover:bg-border transition-colors duration-200 mt-2"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="hidden lg:block">LogOut</span>
        </Button>
      </div>
    </div>
  );
}
