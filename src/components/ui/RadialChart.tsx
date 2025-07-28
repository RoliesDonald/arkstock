"use client";
import Image from "next/image";
import React from "react";
import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "SPK",
    count: 200,
    fill: "#8884d8",
  },
  {
    name: "Invoice",
    count: 120,
    fill: "#83a6ed",
  },
  {
    name: "PO",
    count: 80,
    fill: "#8dd1e1",
  },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const RadialChart = () => {
  return (
    <div className="bg-slate-100/30 rounded-xl w-full h-full p-4 shadow-lg border-t-2">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-500">Karyawan</h1>
        <Image
          src="/moreDark.png"
          alt="more"
          width={20}
          height={20}
          className="cursor-pointer rotate-90"
        />
      </div>
      <div className="w-full h-[85%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="100%"
            barSize={30}
            startAngle={180}
            endAngle={-160}
            data={data}
          >
            <RadialBar
              label={{ position: "insideStart", fill: "#fff", fontWeight: 600 }}
              dataKey="count"
              fill="#8884d8"
            />
            <Legend
              iconSize={20}
              iconType="circle"
              layout="horizontal"
              verticalAlign="bottom"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadialChart;
