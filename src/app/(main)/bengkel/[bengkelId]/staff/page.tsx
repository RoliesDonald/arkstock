import Announcement from "@/components/ui/Announcement";
import BigCalendar from "@/components/ui/BigCalendar";
import CalendarSchedule from "@/components/ui/CalendarSchedule";

const OperationalStaff = () => {
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full md:w-[70%] lg:w-[70%] gap-4 flex-col flex">
        <BigCalendar />
      </div>
      {/* RIGHT SIDE */}
      <div className="w-full md:w-[30%] lg:w-[30%] gap-6 flex flex-col">
        <div>
          {/* JADWAL MEKANIK */}
          <CalendarSchedule />
        </div>
        <div className="rounded-xl w-full h-full shadow-lg-300">
          {/* LIST JADWAL MEKANIK DI TANGGAL YANG DI PILIH */}
          <Announcement />
        </div>
      </div>
    </div>
  );
};

export default OperationalStaff;
