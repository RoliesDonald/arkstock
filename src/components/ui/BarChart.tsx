"use client";
import Image from "next/image";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Mon",
    spk: 60,
    inv: 40,
  },
  {
    name: "Tue",
    spk: 70,
    inv: 60,
  },
  {
    name: "Wed",
    spk: 90,
    inv: 75,
  },
  {
    name: "Thu",
    spk: 90,
    inv: 75,
  },
  {
    name: "Fri",
    spk: 65,
    inv: 55,
  },
];

const BarChartCust = () => {
  return (
    <div className="bg-slate-100/30 rounded-xl w-full h-full p-4 shadow-lg border-t-2">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold text-slate-500 ">Progress</h1>
        <Image
          src="/moreDark.png"
          alt="more"
          width={20}
          height={20}
          className="cursor-pointer rotate-90"
        />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              borderColor: "lightgray",
              backgroundColor: "white",
              opacity: "0.9",
            }}
          />
          <Legend
            align="left"
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "0px" }}
          />
          <Bar
            dataKey="spk"
            fill="#FAE27C"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="inv"
            fill="#C3EBFA"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartCust;
