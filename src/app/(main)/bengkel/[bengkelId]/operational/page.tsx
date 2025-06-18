"use client";
import TablesArea from "@/components/common/table/TablesArea";
import Announcement from "@/components/ui/Announcement";
import CalendarSchedule from "@/components/ui/CalendarSchedule";
import { useAppSelector } from "@/store/hooks";
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  vendorId?: string;
  rentalCompanyId?: string;
}

interface PicOperationalPageProps {
  currentUser: User | null;
}

const PicOperationalPage: React.FC = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const searchQuery = useAppSelector((state) => state.tableSearch.searchQuery);
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full gap-4 flex-col flex">
        <h1 className="text-sm font-semibold text-arkBlue-800 ">
          BreadCrumb / Operational
          <span className="text-arkBlue-700 italic ml-2">
            {currentUser?.vendorId}
          </span>
        </h1>
        <div className="flex md:flex-row flex-col gap-4">
          {/* JADWAL MEKANIK */}
          <CalendarSchedule />
          <Announcement />
        </div>
      </div>
    </div>
  );
};

export default PicOperationalPage;
