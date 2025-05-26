import Announcement from "@/components/Announcement";
import BarChartCust from "@/components/BarChart";
import CalendarSchedule from "@/components/CalendarSchedule";
import FinanceChart from "@/components/FinanceChart";
import InfoCard from "@/components/InfoCard";
import RadialChart from "@/components/RadialChart";

const AdminPage = () => {
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      {/* LEFT SIDE */}
      <div className="w-full md:w-[70%] lg:w-[70%] gap-4 flex-col flex ">
        {/* INFO CARDS */}
        <div className="flex gap-2 justify-between flex-wrap">
          <InfoCard type="balance" amount="2.123" />
          <InfoCard type="Expense" amount="2.123" />
          <InfoCard type="Order" amount="2.123" />
          <InfoCard type="receivables" amount="2.123" />
        </div>
        {/* MIDDLE AREA */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <RadialChart />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <BarChartCust />
          </div>
        </div>
        {/* BOTTOM AREA */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="w-full md:w-[30%] lg:w-[30%] gap-6 flex flex-col">
        <div>
          <CalendarSchedule />
        </div>
        <div className="rounded-xl w-full h-full shadow-lg-300">
          <Announcement />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
