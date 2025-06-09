"use client";
import TablesArea from "@/components/common/table/TablesArea";
import Announcement from "@/components/ui/Announcement";
import CalendarSchedule from "@/components/ui/CalendarSchedule";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  bengkelId?: string;
  rentalCompanyId?: string;
}

interface WorkOrderPageProps {
  currentUser: User | null;
}

const WorkOrderPage: React.FC = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full gap-4 flex-col flex">
        <h1 className="text-sm font-semibold text-arkBg-800 ">
          List SPK{" "}
          <span className="text-arkBlue-900 text-lg italic">
            {currentUser?.bengkelId}
          </span>
        </h1>
        <TablesArea searchQuery={searchQuery} />
        <div className="flex md:flex-row flex-col gap-4">
          {/* JADWAL MEKANIK */}
          <CalendarSchedule />
          <Announcement />
        </div>
      </div>
    </div>
  );
};

export default WorkOrderPage;
