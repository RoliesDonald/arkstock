import { Card } from "@/components/ui/card";
import InfoCard from "@/components/ui/InfoCard";

const CompanyPage = () => {
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      {/* LEFT SIDE */}
      <div className="w-full md:w-[70%] lg:w-[70%] ">
        <div className="flex gap-2 justify-between flex-wrap">
          <InfoCard type="SPK" amount="2.123" />
          <InfoCard type="Invoice" amount="2.123" />
          <InfoCard type="Outstanding" amount="2.123" />
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="w-full md:w-[30%] lg:w-[30%] bg-arkBg-500">RIGHT</div>
    </div>
  );
};

export default CompanyPage;
